import path from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.*", "10.*", "172.*"],
  turbopack: {
    root: rootDirectory,
  },
};

export default nextConfig;
