import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const path = url.pathname;

    // get token from cookies
    const token = req.cookies.get("auth_token");

    const publicPath = ["/sa/signin"]

    if (publicPath.includes(path)) {
        return NextResponse.next();
    }

    if (path.startsWith("/sa")) {
        if (!token) {
            url.pathname = "/sa/signin"
            return NextResponse.redirect(url);
        }
    }

    if (path.startsWith("/member")) {
        if (!token) {
            url.pathname = "/login"
            return NextResponse.redirect(url);
        }
    }
}