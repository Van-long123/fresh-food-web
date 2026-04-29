import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { articleService } from '~/services/article.service'
import type { CreateArticleCommentPayload } from '~/types/article.type'

type CreateCommentInput = {
  slug: string
  payload: CreateArticleCommentPayload
}

export const useCreateArticleCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, payload }: CreateCommentInput) => articleService.createComment(slug, payload),
    onSuccess: async (_response, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['articles', 'detail', variables.slug] })
    }
  })
}
