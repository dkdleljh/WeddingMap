import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FilterSheet } from "./filter-sheet";

describe("FilterSheet", () => {
  it("필터 입력과 정렬 선택을 렌더링한다", () => {
    render(<FilterSheet selectedSido="서울" selectedSort="score" keyword="서울" />);

    expect(screen.getByPlaceholderText("예식장명 또는 주소 검색")).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[0]).toHaveDisplayValue("서울");
    expect(screen.getByText("공공예식장만")).toBeInTheDocument();
  });
});
