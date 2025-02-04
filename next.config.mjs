// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     output: "standalone",
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: ['localhost', '192.168.4.79', '192.168.10.45', 'api-rekrutmen'],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY", // Prevents clickjacking by blocking iframes
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'none';", // Blocks embedding on any other site
          },
        ],
      },
    ];
  },
};

export default nextConfig;

