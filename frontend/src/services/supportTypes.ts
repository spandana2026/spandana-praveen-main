export type Geography = 'india' | 'international' | 'both';
export type Currency = 'INR' | 'USD';

export interface CampaignDonationOptions {
  allowCustomAmount?: boolean;
  presetAmountsINR?: number[];
  presetAmountsUSD?: number[];
  showPerUnit?: boolean;
  perUnitName?: string;
  perUnitCost?: number|null;
  quantityPresets?: number[];
}

export interface FundraisingCampaign {
  id: string; slug?: string; title: string; description?: string; type: 'fundraising'|'emergency'; geography: Geography; currency: Currency;
  targetAmount?: number|null; targetQuantity?: number|null; startDate?: string|null; endDate?: string|null;
  status: 'draft'|'active'|'paused'|'completed'|'archived'; published: boolean; image?: string; campaignDetails?: Record<string, any>; donationOptions?: CampaignDonationOptions; order: number;
}
export interface Requirement {
  id: string; title: string; description?: string; parentType: 'program'|'project'|'campaign'|'emergency-campaign'|'organization'; parentId?: string|null;
  geography: Geography; currency: Currency; unitName?: string; unitCost?: number|null; targetQuantity?: number|null;
  targetAmount?: number|null; visibility: 'public'|'private'; fundable: boolean; status: 'draft'|'active'|'fulfilled'|'archived'; published: boolean; order: number;
}
export interface Contribution {
  id: string; reference: string; donor: { name: string; email: string; mobile: string; country: string };
  supportType: 'cash'|'in-kind'; targetType: string; targetId?: string|null; title: string; quantity?: number|null; unitName?: string;
  amount: number; currency: Currency; note?: string; inKindStatus?: string; status: string; createdAt?: string;
}
export interface Transaction {
  id: string; reference: string; contributionId: string; donorName: string; donorEmail: string; amount: number; currency: Currency;
  paymentMethod: string; provider: string; providerReference?: string; transactionType?: 'donation'|'sponsorship'|'event_ticket'|'other'; paymentAccountId?: string|null; verification?: {status:string;utr?:string;paymentDate?:string|null;proofUrl?:string;verifiedBy?:string;verifiedAt?:string|null;rejectionReason?:string}; status: string; notes?: string; paidAt?: string|null; createdAt?: string;
}
export interface PaymentAccount { id:string; name:string; geography:Geography; currency:Currency; accountType:'bank'|'upi'|'gateway'|'other'; accountName?:string; accountNumber?:string; ifscSwift?:string; upiId?:string; provider?:string; active:boolean; publicDisplay:boolean; }
export interface Receipt { id: string; receiptNumber: string; transactionId: string; contributionId: string; donorName: string; donorEmail: string; amount: number; currency: Currency; issuedAt?: string; notes?: string; }
export interface PaymentMethod { type: string; label: string; enabled: boolean; checkoutUrl?: string; accountName?: string; accountNumber?: string; ifscSwift?: string; notes?: string; }
export interface PaymentProfile { id: string; name: string; geography: Geography; currency: Currency; paymentAccountIds?: string[]; publicDisplay?: boolean; methods: PaymentMethod[]; active: boolean; }
export interface SupportCatalog { opportunities: any[]; campaigns: FundraisingCampaign[]; emergencyCampaigns?: any[]; requirements: Requirement[]; }
export interface SupportReport { counts: Record<string, number>; financial: { paidTransactions: number; byCurrency: Record<string, number> }; inKind: { pledges: number; received: number } }
