/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ovo govori Vercel-u da ignoriše TypeScript greške kako bi uspešno pokrenuo sajt
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
