import { useRouter } from "next/router";
import config from "../../config.json";

type homeProps = {
  children: React.ReactNode;
};

const Home = ({ children }: homeProps) => {
  const { query, locale } = useRouter();

  return (
    <h1 className="">
      Home for <pre>{query.buSlug}</pre> locale: <pre>{locale}</pre>
    </h1>
  );
};

// export async function getStaticProps(context) {
//   const { buSlug } = context.params;
//   console.log("buSlug", buSlug);

//   const bu = config.find((bu) => bu.slug === buSlug);

//   return {
//     props: {
//       businessUnit: bu,
//     },
//   };
// }

// export async function getStaticPaths() {
//   const paths = config
//     .filter((bu) => bu.type === "OWN_AND_OPERATE")
//     .map((bu) => ({
//       params: { buSlug: bu.slug },
//       locale: bu.locale,
//     }));

//   return {
//     paths,
//     fallback: false,
//   };
// }

export default Home;
