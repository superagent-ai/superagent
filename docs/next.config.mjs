import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/safety-agent',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        // allow appending .mdx to any docs URL to fetch raw Markdown
        source: '/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ];
  },
};

export default withMDX(config);
