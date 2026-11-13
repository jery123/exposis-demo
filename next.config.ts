import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const laravelUrl = (
      process.env.LARAVEL_APP_URL ?? "http://127.0.0.1:8000"
    ).replace(/\/$/, "");

    return [
      { source: "/login", destination: `${laravelUrl}/login` },
      { source: "/register", destination: `${laravelUrl}/register` },
      { source: "/forgot-password", destination: `${laravelUrl}/forgot-password` },
      { source: "/reset-password/:path*", destination: `${laravelUrl}/reset-password/:path*` },
      { source: "/verify-email", destination: `${laravelUrl}/verify-email` },
      { source: "/confirm-password", destination: `${laravelUrl}/confirm-password` },
      { source: "/dashboard", destination: `${laravelUrl}/dashboard` },
      { source: "/profile", destination: `${laravelUrl}/profile` },
      { source: "/profile/:path*", destination: `${laravelUrl}/profile/:path*` },
      { source: "/communaute", destination: `${laravelUrl}/communaute` },
      { source: "/communaute/:path*", destination: `${laravelUrl}/communaute/:path*` },
      { source: "/admin", destination: `${laravelUrl}/admin` },
      { source: "/admin/:path*", destination: `${laravelUrl}/admin/:path*` },
      { source: "/projects", destination: `${laravelUrl}/projects` },
      { source: "/projects/:path*", destination: `${laravelUrl}/projects/:path*` },
      { source: "/build/:path*", destination: `${laravelUrl}/build/:path*` },
      { source: "/css/:path*", destination: `${laravelUrl}/css/:path*` },
      { source: "/images/:path*", destination: `${laravelUrl}/images/:path*` },
      { source: "/js/:path*", destination: `${laravelUrl}/js/:path*` },
      {
        source: "/api/public/projects/:slug/images/:image",
        destination: `${laravelUrl}/api/public/projects/:slug/images/:image`
      },
      {
        source: "/api/public/projects/:slug/report",
        destination: `${laravelUrl}/api/public/projects/:slug/report`
      }
    ];
  }
};

export default nextConfig;
