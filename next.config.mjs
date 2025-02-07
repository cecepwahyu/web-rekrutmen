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
          {
            key: "X-Content-Type-Options",
            value: "nosniff", // Prevents MIME-type sniffing
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin", // Sends referrer only to same-origin
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()", // Restricts browser features
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", // Ensures secure cross-origin resource loading
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin", // Blocks unauthorized resource sharing
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin", // Protects against cross-origin attacks
          },
        ],
      },
    ];
  },
};

export default nextConfig;

