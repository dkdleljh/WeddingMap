import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname)
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    // 루트 작업공간에서 테스트를 실행해도 항상 앱 내부 설정 파일을 읽도록 절대 경로를 사용합니다.
    setupFiles: [path.resolve(__dirname, "vitest.setup.ts")]
  }
});
