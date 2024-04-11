/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    // unoptimized: true,
    // 引用网络图片，需要配置
    domains: ['localhost'], 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.nextjs.cn",
      },
      {
        protocol: "https",
        hostname: "dimg04.c-ctrip.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "pic.616pic.com",
      },
      {
        protocol: "https",
        hostname: "images4.c-ctrip.com",
      },
    ],
  },
  publicRuntimeConfig: {
    staticFolder: "/public",
  },
  transpilePackages: ["antd-mobile"],
};

module.exports = nextConfig;
