import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone(); // clone the request url
  const { locale, pathname, hostname: nextHost } = req.nextUrl; // get pathname of request (e.g. /products/:id)
  const hostname = req.headers.get("host"); // get hostname of request (e.g. solar.otovo.com)

  console.log(
    "locale:",
    locale,
    "pathname:",
    pathname,
    "\nnextHost:",
    nextHost,
    "\nhostname:",
    hostname
  );

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    if (pathname === "/") {
      url.pathname = `/_sites/redirectHere`;
      console.log("1: will rewrite to", JSON.stringify(url));
      return NextResponse.rewrite(url);
    }
    url.pathname = `/_sites${pathname}`;
    console.log("2: will rewrite to", JSON.stringify(url));
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
