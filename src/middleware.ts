import {
    SupabaseClient,
    createMiddlewareClient,
} from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    if (req.nextUrl.pathname.startsWith("/feedback")) {
        const feedbackID = getFeedbackIDValue(req.url);
        const {
            account_id: accountID,
            account_uid: accountUID,
            account_type: accountType,
        } = await fetchUserCredentials(supabase);
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

    if (
        req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname === "/register" ||
        req.nextUrl.pathname.startsWith("/_next") // To load files and CSS
    ) {
        const res = NextResponse.next();

        return res;
    }

    // Retrieve current session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) return NextResponse.redirect(new URL("/login", req.url));

    return res;
}

function getFeedbackIDValue(url: string) {
    const urlParts = url.split("/");
    const lastPart = urlParts.at(-1);
    const idParam = lastPart?.split("?")[1];
    const idValue = idParam?.split("=")[1];

    return idValue;
}

async function fetchUserCredentials(
    supabase: SupabaseClient<any, "public", any>
) {
    const {
        data: { user },
        error: error_one,
    } = await supabase.auth.getUser();

    if (error_one) throw error_one;

    const { data: user_credentials, error: error_two } = await supabase
        .from("accounts")
        .select("account_id, account_uid, account_type")
        .eq("account_uid", user?.id);

    if (error_two) throw error_two;

    const userCredentials = {
        account_id: user_credentials[0].account_id,
        account_uid: user_credentials[0].account_uid,
        account_type: user_credentials[0].account_type as
            | "Department"
            | "Student"
            | "Administrator",
    };

    return userCredentials;
}

async function fetchFeedbackCredentials(
    supabase: SupabaseClient<any, "public", any>,
    feedbackID: number
) {
    const { data, error } = await supabase
        .from("feedbacks")
        .select("feedback_creator_uid, feedback_reference")
        .eq("feedback_id", feedbackID);

    if (error) throw error;

    const feedbackCredentials = {
        feedback_creator_uid: data[0].feedback_creator_uid,
        feedback_reference: data[0].feedback_reference,
    };

    return feedbackCredentials;
}
