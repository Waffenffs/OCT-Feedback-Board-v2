import {
    SupabaseClient,
    createMiddlewareClient,
} from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    const resourcePaths: string[] = [
        "/login",
        "/register",
        "/department-register",
    ];

    // To load resources like CSS and necessary files
    if (
        resourcePaths.includes(req.nextUrl.pathname) ||
        req.nextUrl.pathname.startsWith("/_next")
    ) {
        return res;
    }

    // if (
    //     req.nextUrl.pathname === "/login" ||
    //     req.nextUrl.pathname === "/register" ||
    //     req.nextUrl.pathname === "/department-register" ||
    //     req.nextUrl.pathname.startsWith("/_next") // To load files and CSS
    // ) {
    //     return res;
    // }

    const {
        data: { session },
        error: error_one,
    } = await supabase.auth.getSession();
    const sessionCookies = {
        name: `sb-${supabaseURL}-auth-token`,
        value: JSON.stringify(session),
        path: "/",
    };
    res.cookies.set(sessionCookies);

    if (error_one) {
        console.error(`Error 1 triggered`);
    }
    if (!session) return NextResponse.redirect(new URL(`/login`, req.url));

    const {
        account_id: accountID,
        account_type: accountType,
        account_uid: accountUID,
    } = await fetchUserCredentials(supabase);

    // Redirect user to `/` path to be rerouted to appropriate type (Department, Student, and Admin)
    if (req.nextUrl.pathname === "/") {
        return NextResponse.redirect(
            new URL(`/${accountType.toLowerCase()}`, req.url)
        );
    }

    if (req.nextUrl.pathname.startsWith("/feedback")) {
        const feedbackID = getFeedbackIDValue(req.url);
        const {
            feedback_creator_uid: feedbackCreatorUID,
            feedback_reference: feedbackReference,
        } = await fetchFeedbackCredentials(
            supabase,
            parseInt(feedbackID as string)
        );

        const isAdmin = accountType === "Administrator";
        const isCreator = accountUID === feedbackCreatorUID;
        const isReferencedAccount = accountID === feedbackReference;

        const tokenHeaders = new Headers(req.headers);
        tokenHeaders.set("x-url", req.url);
        const res = NextResponse.next({
            request: {
                headers: tokenHeaders,
            },
        });

        if (isAdmin || isCreator || isReferencedAccount) {
            return res;
        } else {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    const pathRequiresAccountType: Record<string, string> = {
        "/department": "Department",
        "/student": "Student",
        "/administrator": "Administrator",
    };
    const requiredAccountType = pathRequiresAccountType[req.nextUrl.pathname];
    if (requiredAccountType && accountType !== requiredAccountType) {
        return NextResponse.redirect(
            new URL(`/${accountType?.toLowerCase()}`, req.url)
        );
    }
}

async function fetchUserCredentials(supabase: SupabaseClient) {
    const {
        data: { session },
        error: error_one,
    } = await supabase.auth.getSession();
    if (error_one) throw error_one;

    const user = session?.user;

    const { data: user_credentials, error: error_two } = await supabase
        .from("accounts")
        .select("account_id, account_uid, account_type")
        .eq("account_uid", user?.id);
    if (error_two) throw error_two;

    const userCredentials = {
        account_id: user_credentials[0]?.account_id,
        account_uid: user_credentials[0]?.account_uid,
        account_type: user_credentials[0]?.account_type as
            | "Department"
            | "Student"
            | "Administrator",
    };

    return userCredentials;
}

async function fetchFeedbackCredentials(
    supabase: SupabaseClient,
    feedbackID: number
) {
    const { data, error } = await supabase
        .from("feedbacks")
        .select("feedback_creator_uid, feedback_reference")
        .eq("feedback_id", feedbackID);

    if (error) throw error;

    const feedbackCredentials = {
        feedback_creator_uid: data[0]?.feedback_creator_uid,
        feedback_reference: data[0]?.feedback_reference,
    };

    return feedbackCredentials;
}

function getFeedbackIDValue(url: string) {
    const urlParts = url.split("/");
    const lastPart = urlParts.at(-1);
    const idParam = lastPart?.split("?")[1];
    const idValue = idParam?.split("=")[1];

    return idValue;
}
