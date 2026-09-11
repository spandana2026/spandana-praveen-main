export interface DonationPricing {
  presets?: number[];
  monthlyPresets?: number[];
  unitCost?: number | null;
  unitName?: string;
}

export interface DonationOpportunity {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "fixed" | "unit";
  geography: "india" | "international" | "both";
  pricing: { INR?: DonationPricing; USD?: DonationPricing };
  quantityPresets?: number[];
  targetQuantity?: number | null;
  targetAmountINR?: number | null;
  targetAmountUSD?: number | null;
  impactText?: string;
  active: boolean;
  published: boolean;
  order: number;
}
