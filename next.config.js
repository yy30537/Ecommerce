/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
  onDemandEntries: {
    // 开发模式页面在内存中保留的时间
    maxInactiveAge: 15 * 1000,
    // 同时保留多少个页面
    pagesBufferLength: 2,
  },
  // 确保每次渲染都获取最新数据
  serverRuntimeConfig: {
    // 不从缓存读取
    unstable_skipMiddlewareUrlNormalize: true,
  },
};

module.exports = nextConfig; 