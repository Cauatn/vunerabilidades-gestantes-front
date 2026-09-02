import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateAssessmentRecommendations } from '@/features/avaliacao/services/assessments'
import { assessmentsQueryKey } from '@/features/avaliacao/composables/useGetAssessment'
import type { UpdateRecommendationsPayload } from '@/features/avaliacao/types/assessment'

export function useUpdateAssessmentRecommendations(id: string, options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: UpdateRecommendationsPayload) =>
			updateAssessmentRecommendations(id, payload),
		onSuccess: ({ data }) => {
			queryClient.setQueryData([...assessmentsQueryKey, id], { data })
			options?.onSuccess?.()
		},
	})
}
