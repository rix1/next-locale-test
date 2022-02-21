import { NextRequest, NextResponse } from "next/server";
import config from "../config.json";

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

  // // const buConfig = config
  // //   .filter((bu) => ["OWN_AND_OPERATE", "WHITE_LABEL"].includes(bu.type))
  // //   .find((bu) => bu.locale === locale);
  // // console.log("found bu", buConfig);

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    url.pathname = `/_sites${pathname}`;
    console.log(`2: locale is ${locale} will rewrite to`, JSON.stringify(url));
    return NextResponse.rewrite(url);
    // return NextResponse.rewrite(url);
    //   if (pathname === "/") {
    //     url.pathname = `/_sites/redirectHere`;
    //     console.log(
    //       `1: locale is ${locale} will rewrite to`,
    //       JSON.stringify(url)
    //     );
    //     return NextResponse.rewrite(url);
    //   }
    //   // if (!buConfig) {
    //   //   return NextResponse.redirect("/404");
    //   // }
    //   url.pathname = `/_sites${pathname}`;
    //   console.log(`2: locale is ${locale} will rewrite to`, JSON.stringify(url));
    //   return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
