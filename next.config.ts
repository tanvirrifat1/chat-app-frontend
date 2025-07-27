/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // Use "https" if your server uses HTTPS
        hostname: "10.10.12.25",
        port: "5006", // Specify the port
        pathname: "/images/**", // Restrict to images under /images/ (optional)
      },
    ],
  },
};
export default nextConfig;
