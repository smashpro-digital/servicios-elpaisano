import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProd ? "/servicios-elpaisano" : "",
  assetPrefix: isProd ? "/servicios-elpaisano/" : "",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? "/servicios-elpaisano" : "",
  },
};

export default nextConfig;