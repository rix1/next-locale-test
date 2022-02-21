import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone(); // clone the request url
  const { locale, pathname } = req.nextUrl; // get pathname of request (e.g. /products/:id)
  const hostname = req.headers.get("host"); // get hostname of request (e.g. solar.otovo.com)

  console.log(locale, pathname, hostname);

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    if (pathname === "/") {
      url.pathname = `/redirectHere`;
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}
