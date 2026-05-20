export interface RefundItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateRefundPayload {
  orderId: string;
  items: RefundItemPayload[];
  reason: string;
  images: string[];
  videos?: string[];
}

export interface BankInfoPayload {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  thumbnail: string;
  quantity: number;
  price: number;
}

export interface RefundRequestData {
  _id?: string;
  status?: string;
  amount?: number;
  rejectReason?: string;
  bankInfo?: {
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
  } | null;
}

