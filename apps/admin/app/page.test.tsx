import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AdminDashboardPage from "./page";

describe("관리자 대시보드", () => {
  it("주요 KPI를 렌더링한다", () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText("실시간 운영 현황")).toBeInTheDocument();
    expect(screen.getByText("등록 예식장 수")).toBeInTheDocument();
  });
});
