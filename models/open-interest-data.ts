export interface OpenInterestItem {
  openTime: number;
  closeTime: number;
  symbol: string;
  openInterest: number;
  openInterestChange: number;
  colors?: {
    openInterest?: string;
    openInterestChange?: string;
  };
  normalizedOpenInterest?: number;
  normalizedOpenInterestChange?: number;
}

export interface OpenInterestData {
  success: boolean;
  symbol: string;
  imageUrl: string;
  category: string;
  exchanges: string[];
  data: OpenInterestItem[];
}
