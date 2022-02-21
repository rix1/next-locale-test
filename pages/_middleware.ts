import { NextRequest, NextResponse } from "next/server";
import config from "../config.json";

const PUBLIC_FILE = /\.(.*)$/;

// const stripDefaultLocale = (str: string): string => {
//   const stripped = str.replace("/default", "");
//   return stripped;
// };

const lookup = {
  nb: "nb-no",
  fallback: "fr-fr",
};

function getLocaleFromPath(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

function figureOutLocaleAndStripPath(locale: string, pathname: string) {
  if (locale === "default") {
    const pathSegments = getLocaleFromPath(pathname);
    const properLocale =
      pathSegments[0] === "nb" ? lookup[pathSegments[0]] : lookup["fallback"];

    return {
      pathname: pathSegments.slice(1),
      locale: properLocale,
    };
  }
}

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

  if (!pathname.includes(".") && !pathname.startsWith("/api")) {
    const detectedStuff = figureOutLocaleAndStripPath(locale, pathname);

    const buConfig = config
      .filter((bu) => ["OWN_AND_OPERATE", "WHITE_LABEL"].includes(bu.type))
      .find((bu) => bu.locale === detectedStuff?.locale);

    console.log("found bu", buConfig);

    if (pathname === "/") {
      url.pathname = `/${detectedStuff?.locale}/_sites/redirectHere`;
      console.log("1: will rewrite to", JSON.stringify(url));
      return NextResponse.rewrite(url);
    }

    if (!buConfig) {
      url.pathname = "/404";
      return NextResponse.redirect(url);
    }

    url.pathname = `/${detectedStuff?.locale}/_sites/${buConfig.slug}${detectedStuff?.pathname}`;
    console.log("2: will rewrite to", JSON.stringify(url));
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}
