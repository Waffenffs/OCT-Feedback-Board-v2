import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.startsWith("/feedback")) {
        const tokenHeaders = new Headers(req.headers);
        tokenHeaders.set("x-url", req.url);

        const res = NextResponse.next({
            request: {
                headers: tokenHeaders,
            },
        });

        return res;
    }

    if (
        req.nextUrl.pathname === "/login" ||
        req.nextUrl.pathname === "/register" ||
        req.nextUrl.pathname.startsWith("/_next")
    ) {
        const res = NextResponse.next();

        return res;
    }

    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Retrieve current session
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) return NextResponse.redirect(new URL("/login", req.url));

    return res;
}
