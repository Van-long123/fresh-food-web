import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'

import type { AiContentType, AiContentResult } from '~/types/aiContent.type'

export const generateAiContentRequest = async (
  title: string,
  type: AiContentType
): Promise<AiContentResult> => {
  const response = await getAuthorizedAxios().post(
    API_ENDPOINTS.ADMIN.AI_CONTENT.GENERATE,
    { title, type }
  )
  return response.data
}
