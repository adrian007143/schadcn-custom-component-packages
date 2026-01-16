import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: false,

    qualities: [50, 75],

    localPatterns: [
      {
        pathname: "/images/**",
        search: undefined, // images without query params
      },
      {
        pathname: "/images/**",
        search: "(.*)", // images WITH any query params
      },
    ],
  },
};

export default nextConfig;
