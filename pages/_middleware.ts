import { NextRequest, NextResponse } from "next/server";
import config from "../config.json";

const PUBLIC_FILE = /\.(.*)$/;

// const stripDefaultLocale = (str: string): string => {
//   const stripped = str.replace("/default", "");
//   return stripped;
// };

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone(); // clone the request url
  const { locale, pathname, hostname: nextHost } = req.nextUrl; // get pathname of request (e.g. /products/:id)
  const hostname = req.headers.get("host"); // get hostname of request (e.g. solar.otovo.com)

  const shouldHandleLocale =
    !PUBLIC_FILE.test(pathname) &&
    !pathname.includes("/api/") &&
    locale === "default";

  console.log(
    "locale:",
    locale,
    "pathname:",
    pathname,
    "\nnextHost:",
    nextHost,
    "\nhostname:",
    hostname,
    `\n Will handle locale: ${shouldHandleLocale}`
  );

  const buConfig = config
    .filter((bu) => ["OWN_AND_OPERATE", "WHITE_LABEL"].includes(bu.type))
    .find((bu) => bu.locale === locale);

  console.log("found bu", buConfig);

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    if (pathname === "/") {
      url.pathname = `/_sites/redirectHere`;
      console.log("1: will rewrite to", JSON.stringify(url));
      return NextResponse.rewrite(url);
    }

    if (!buConfig) {
      url.pathname = "/404";
      return NextResponse.redirect(url);
    }

    url.pathname = `/_sites/${buConfig.slug}${pathname}`;
    console.log("2: will rewrite to", JSON.stringify(url));
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
