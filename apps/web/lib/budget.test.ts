import { describe, expect, it } from "vitest";

import { calculateBudgetPreview } from "./budget";

describe("예산 계산기", () => {
  it("예산 적합도를 계산한다", () => {
    const result = calculateBudgetPreview({
      mealGuestCount: 200,
      totalBudget: 30000000,
      includeRentalFee: true,
      includeFlowerDecor: true,
      includeExtraOptions: true,
      preferredRegion: "서울",
      preferredStyle: "호텔"
    });

    expect(result.mealCost).toBe(13000000);
    expect(result.fitnessLabel).toBeTypeOf("string");
  });
});
