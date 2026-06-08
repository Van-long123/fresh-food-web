import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { chatbotService } from '~/services/chatbot.service'

export const chatbotHistoryKeys = {
  all: ['chatbot-history'] as const,
  session: (sessionId: string | null) => ['chatbot-history', sessionId] as const,
}

export const useChatbotHistoryQuery = (sessionId: Ref<string | null>) => {
  const enabled = computed(() => Boolean(sessionId.value))

  return useQuery({
    queryKey: computed(() => chatbotHistoryKeys.session(sessionId.value)),
    enabled,
    queryFn: () => chatbotService.getHistory(sessionId.value as string),
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: false,
  })
}
