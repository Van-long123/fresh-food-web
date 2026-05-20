import {
  createRefundRequest,
  getRefundRequestByOrder,
  submitRefundBankInfo,
  uploadRefundEvidenceRequest,
} from "~/api/refund.api";
import type { BankInfoPayload, CreateRefundPayload } from "~/types/refund.type";

export const refundService = {
  uploadEvidence: (formData: FormData) => uploadRefundEvidenceRequest(formData),
  createRefund: (payload: CreateRefundPayload) => createRefundRequest(payload),
  getByOrder: (orderId: string) => getRefundRequestByOrder(orderId),
  submitBankInfo: (id: string, payload: BankInfoPayload) =>
    submitRefundBankInfo(id, payload),
};
