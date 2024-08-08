/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/hivechat",
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui.shadcn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
