import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    // TO-DO:
    // 1. Only the Administrator, Student, and the referenced Department can access that feedback.

    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Retrieve current session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (session) {
        // User is authenticated
        return res;
    }

    // Authentication check failed so redirect user to login
    return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
    matcher: "/",
};
