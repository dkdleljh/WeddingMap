import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { VenueCard } from "./venue-card";

describe("VenueCard", () => {
  it("예식장 핵심 정보를 렌더링한다", () => {
    render(<VenueCard venue={{ id: 1, name: "라비에벨 서울 컨벤션", slug: "laviebelle-seoul-convention", address: "서울 중구 세종대로 110", region: "서울 중구", meal_price_min: 72000, meal_price_max: 95000, rental_fee_min: 7000000, rental_fee_max: 12000000, trust_grade: "A", overall_score: 88.2, review_rating: 4.6, review_count: 124, is_public_hall: false, mood_tags: ["모던"] }} />);
    expect(screen.getByText("라비에벨 서울 컨벤션")).toBeInTheDocument();
    expect(screen.getByText(/신뢰도 A/)).toBeInTheDocument();
  });
});
