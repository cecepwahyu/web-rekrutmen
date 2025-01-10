// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     output: "standalone",
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ['localhost', 'your-production-domain.com'], // Add 'localhost' for local development
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL, // Ensure your API URL is available
  },
};

export default nextConfig;

