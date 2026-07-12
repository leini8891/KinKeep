import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Vinext applies this limit to multipart Route Handler requests as well as
    // Server Actions. Keep it above the app's explicit 10 MB image limit so
    // the route can return a structured validation error itself.
    serverActions: {
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
