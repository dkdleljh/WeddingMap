import React from "react";
// 앱 루트 진입 화면은 상대 경로를 사용해 테스트 환경과 빌드 환경 모두에서 안정적으로 해석되게 합니다.
import { DashboardPanel } from "../components/dashboard-panel";

export default function AdminDashboardPage() {
  return <DashboardPanel />;
}
