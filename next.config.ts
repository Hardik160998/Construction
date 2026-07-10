import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/superadmin/builder-matrix',
        destination: '/superadmin?tab=builder',
      },
      {
        source: '/superadmin/customer',
        destination: '/superadmin?tab=customer',
      },
      {
        source: '/superadmin/project',
        destination: '/superadmin?tab=project',
      },
      {
        source: '/superadmin/inquiry',
        destination: '/superadmin?tab=inquiry',
      }
    ];
  },
};

export default nextConfig;
