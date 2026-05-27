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
  refundMethod: 'bank_transfer' | 'cash_on_pickup';
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  } | null;
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
  refundMethod?: 'bank_transfer' | 'cash_on_pickup';
  bankInfo?: {
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
  } | null;
}

export type RefundStatus =
  | 'pending'
  | 'approved_waiting_pickup'
  | 'processing_refund'
  | 'completed'
  | 'rejected';

export type RefundMethod = 'bank_transfer' | 'cash_on_pickup';

export interface AdminRefundRequestQueryParams {
  page?: number;
  perPage?: number;
  keyword?: string;
  status?: RefundStatus | 'all' | '';
  refundMethod?: RefundMethod | 'all' | '';
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminRefundRequestSummary {
  pending: number;
  approved_waiting_pickup: number;
  processing_refund: number;
  completed: number;
  rejected: number;
  totalAmount: number;
}

export interface AdminRefundRequestListItem {
  id: string;
  orderId: string;
  userId: string;
  customerName: string;
  refundMethod: RefundMethod;
  amount: number;
  status: RefundStatus;
  createdAt: string;
  updatedAt?: string | null;
}

export interface AdminRefundRequestDetail extends AdminRefundRequestListItem {
  reason: string;
  images: string[];
  videos: string[];
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  bankInfo?: {
    bankName?: string;
    accountNumber?: string;
    accountHolder?: string;
  } | null;
  rejectReason?: string;
  transactionImage?: string;
}

export interface AdminRefundRequestListResponse {
  data: AdminRefundRequestListItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
  summary: AdminRefundRequestSummary;
}

