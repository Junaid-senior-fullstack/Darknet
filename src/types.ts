export interface CardItem {
  id: string;
  price: number;
  balance: number;
  title: string;
  cardType: 'Visa' | 'Mastercard' | 'Amex' | 'Discover';
  cardNumber: string; // Dummy format e.g. 4532 **** **** 8821
  expDate: string;
  cvv: string;
  tier: string;
  bin: string;
  country: string;
  purchased?: boolean;
  purchasedAt?: number; // timestamp
  replacementTimerEnd?: number; // timestamp for 20h
}

export type CryptoType = 'USDT_TRC20';

export interface CryptoOption {
  id: CryptoType;
  name: string;
  symbol: string;
  network: string;
  address: string;
  rateToUsd: number; // e.g. ETH = 3400
  iconName: string;
}

export interface UserJobData {
  agentName: string;
  roleJob: string;
  clearanceLevel: string;
  accessCode: string;
  sessionKey: string;
}

export interface CustomerCheckoutData {
  customerName: string;
  address: string;
  email: string;
  region: string;
  sessionKey: string;
  paymentScreenshotName?: string;
  paymentScreenshotUrl?: string | null;
  txHash?: string;
}

export interface PurchasedLinkItem {
  id: string;
  price: number;
  email: string;
  purchasedAt: number;
  activationTimerEnd: number; // timestamp for 20h
  status: 'PENDING_ACTIVATION' | 'ACTIVE';
}

export type AppPhase = 'JOB_FORM' | 'TIMER_WAIT' | 'PORTAL' | 'LOCKED_OUT';
