import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/sa/signin", "/login"];
const protectedPrefixes = ["/sa", "/member"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // get token from cookies
  const token = req.cookies.get("auth_token");

  // if public path just pass
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // if not logged in redirect with callback
  for (const prefix of protectedPrefixes) {
    if (path.startsWith(prefix) && !token) {
      const callbackUrl = encodeURIComponent(`${url.pathname}${url.search}`);

      // Tentukan login path sesuai prefix
      const loginPath = prefix === "/sa" ? "/sa/signin" : "/login";
      url.pathname = loginPath;
      url.searchParams.set("callbackUrl", callbackUrl);

      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
