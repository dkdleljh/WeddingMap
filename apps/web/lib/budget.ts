export type BudgetInput = {
  mealGuestCount: number;
  totalBudget: number;
  includeRentalFee: boolean;
  includeFlowerDecor: boolean;
  includeExtraOptions: boolean;
  preferredRegion: string;
  preferredStyle: string;
};

export function calculateBudgetPreview(input: BudgetInput) {
  const mealCost = input.mealGuestCount * 65000;
  const regionBase = input.preferredRegion === "서울" ? 9000000 : input.preferredRegion === "경기" ? 7000000 : 5500000;
  const styleFactor = input.preferredStyle === "호텔" ? 1.2 : input.preferredStyle === "공공" ? 0.8 : 1.0;
  const rentalFee = input.includeRentalFee ? Math.round(regionBase * styleFactor) : 0;
  const optionCost = (input.includeFlowerDecor ? 1800000 : 0) + (input.includeExtraOptions ? 2400000 : 0);
  const expectedTotalMax = Math.round((mealCost + rentalFee + optionCost) * 1.15);
  const fitnessLabel = expectedTotalMax <= input.totalBudget * 0.9 ? "여유" : expectedTotalMax <= input.totalBudget ? "적정" : expectedTotalMax <= input.totalBudget * 1.1 ? "빠듯함" : "초과";
  return { mealCost, rentalFee, optionCost, expectedTotalMax, fitnessLabel };
}
