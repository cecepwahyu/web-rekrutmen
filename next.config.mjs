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
            value: "no-referrer", // Controls the amount of referrer information sent with requests
          },
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=()", // Controls the use of browser features
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp", // Ensures that only same-origin resources can be embedded
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin", // Ensures that only same-origin resources can be accessed
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin", // Ensures that the document can only interact with same-origin documents
          },
        ],
      },
    ];
  },
};

export default nextConfig;

