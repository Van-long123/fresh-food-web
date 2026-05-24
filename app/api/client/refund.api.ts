import { API_ENDPOINTS } from "~/constants/api";
import { getAuthorizedAxios } from "~/utils/authorizedAxios";

import type { BankInfoPayload, CreateRefundPayload } from "~/types/refund.type";

export const uploadRefundEvidenceRequest = async (formData: FormData) => {
  const response = await getAuthorizedAxios().post(
    API_ENDPOINTS.REFUND.UPLOAD,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
};

export const createRefundRequest = async (payload: CreateRefundPayload) => {
  const response = await getAuthorizedAxios().post(
    API_ENDPOINTS.REFUND.CREATE,
    payload,
  );
  return response.data.data;
};

export const getRefundRequestByOrder = async (orderId: string) => {
  const response = await getAuthorizedAxios().get(
    API_ENDPOINTS.REFUND.BY_ORDER(orderId),
  );
  return response.data.data;
};

export const submitRefundBankInfo = async (
  id: string,
  payload: BankInfoPayload,
) => {
  const response = await getAuthorizedAxios().put(
    API_ENDPOINTS.REFUND.BANK_INFO(id),
    payload,
  );
  return response.data.data;
};
