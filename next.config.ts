import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Proxy Traco tracking through this domain for ad-blocker bypass.
   * Requests to /traco/* are forwarded to the Traco API.
   * This makes tracking requests first-party (same-origin). */
  async rewrites() {
    return [
      {
        source: "/traco/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "https://tracoapi.ankitpatil.tech"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
