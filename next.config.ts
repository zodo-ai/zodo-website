import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{
      protocol: "https",
      hostname: "slotit.s3.ap-south-1.amazonaws.com",
      port: "",
      pathname: "/**",
    },{
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**",
    }]
  }

};

export default nextConfig;
