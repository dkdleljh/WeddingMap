import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 상위 사용자 폴더의 잠금 파일을 무시하고 현재 프로젝트 루트를 기준으로 빌드 추적 경로를 고정합니다.
  outputFileTracingRoot: path.resolve(__dirname, "../.."),
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
