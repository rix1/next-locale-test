/** @type {import('next').NextConfig} */

const config = require("./config.json");

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    localeDetection: false,
    locales: config
      .filter((unit) => unit.type === "OWN_AND_OPERATE")
      .map((businessUnit) => businessUnit.locale),
    defaultLocale: "en-gb",
  },
  async redirects(stuff) {
    console.log("redirecting stuff", stuff);
    return [
      {
        source: "/no/:path*",
        destination: "/nb-no/:path*",
        permanent: false,
      },
      {
        source: "/nb/:path*",
        destination: "/nb-no/:path*",
        permanent: false,
      },
      {
        source: "/se/:path*",
        destination: "/sv-se/:path*",
        permanent: false,
      },
      {
        source: "/sv/:path*",
        destination: "/sv-se/:path*",
        permanent: false,
      },
      {
        source: "/de/:path*",
        destination: "/de-de/:path*",
        permanent: false,
      },
      {
        source: "/br/:path*",
        destination: "/pt-br/:path*",
        permanent: false,
      },
      {
        source: "/it/:path*",
        destination: "/it-it/:path*",
        permanent: false,
      },
      {
        source: "/es/:path*",
        destination: "/es-es/:path*",
        permanent: false,
      },
      {
        source: "/pl/:path*",
        destination: "/pl-pl/:path*",
        permanent: false,
      },
      // {
      //   source: "/de/:path*",
      //   destination: "/de-at/:path*",
      //   permanent: false,

      // },
      // {
      //   source: `/${DEFAULT_MARKET.locale}`,
      //   destination: "/welcome",
      //   permanent: false,

      // },
    ];
  },
};

module.exports = nextConfig;
