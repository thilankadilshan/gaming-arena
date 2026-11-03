/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
  reactStrictMode: true,
  transpilePackages: ['three'],
};

export default nextConfig;
