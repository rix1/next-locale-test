import { NextRequest, NextResponse } from "next/server";
import config from "../config.json";

function resolveLocale(locale) {
  return {
    nb: "nb-no",
    no: "nb-no",
    sv: "sv-se",
    se: "sv-se",
  }[locale];
}

export default function middleware(req) {
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
    if (locale === "default") {
      // We're not able to resolve locale – try to figure it out!
      const strippedPath = pathname.match(/^(\/(nb|no|se|sv))(.+)?/); // TODO: add all locales
      console.log("strippedPath", strippedPath);
      const newPath = strippedPath?.[2];
      if (newPath && ["nb", "no", "sv", "se"].includes(newPath)) {
        const resolvedLocale = resolveLocale(strippedPath[2]);
        const newPath = strippedPath[3];
        if (!strippedPath?.[3]) {
          url.pathname = `/${resolvedLocale}/_sites/redirectHere`;
          console.log(
            `1: resolved locale "${locale}" - will rewrite to`,
            JSON.stringify(url)
          );
          return NextResponse.rewrite(url);
        }
        url.pathname = `/${resolvedLocale}/_sites${newPath}`;
        console.log(
          `1: resolved locale "${locale}" - will rewrite to`,
          JSON.stringify(url)
        );
        return NextResponse.rewrite(url);
      } else {
        // This means we weren't able to find a locale or sub path after the locale
        url.pathname = `/en-gb/_sites/redirectHere`;
        console.log(
          `1: resolved locale "${locale}" - will rewrite to`,
          JSON.stringify(url)
        );
        return NextResponse.rewrite(url);
      }
    } else {
      // Locale resolved – no need to "redirect"2
      url.pathname = `/_sites${pathname}`;
      console.log(
        `2: resolvedd locale is ${locale} will rewrite to`,
        JSON.stringify(url)
      );
      return NextResponse.rewrite(url);
    }
  }
  return NextResponse.next();
}
