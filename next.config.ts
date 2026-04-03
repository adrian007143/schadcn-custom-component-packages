import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    unoptimized: false,

    qualities: [50, 75],

    localPatterns: [
      {
        pathname: "/images/**",
        search: undefined,
      },
      {
        pathname: "/images/**",
        search: "(.*)",
      },
    ],
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev']
};

export default withMDX(nextConfig);
