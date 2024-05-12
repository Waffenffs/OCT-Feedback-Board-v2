import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

import {
    fetchFeedbackCredentials,
    fetchUserCredentials,
} from "@/app/utils/supabaseUtils";
import { getFeedbackIDValue } from "@/app/utils/helperUtils";

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

    // Redirect user to `/` path to be rerouted to appropriate type (Department, Student, and Administrator)
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

    const pathRequiresAccountType: Record<string, TAccountType> = {
        "/department": "Department",
        "/student": "Student",
        "/administrator": "Administrator",
    };
    if (pathRequiresAccountType[req.nextUrl.pathname]) {
        const requiredAccountType =
            pathRequiresAccountType[req.nextUrl.pathname];
        if (accountType !== requiredAccountType) {
            return NextResponse.redirect(
                new URL(`/${accountType?.toLowerCase()}`, req.url)
            );
        }
    }
}
