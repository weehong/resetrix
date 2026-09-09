import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal standalone server for Docker (see Dockerfile).
  output: "standalone",
  async redirects() {
    return [
      {
        // Legacy service path kept alive for indexed links and shared URLs.
        source: "/operational-transformation",
        destination: "/workflow-digitalisation",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
