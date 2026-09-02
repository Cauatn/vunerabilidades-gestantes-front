import { useMutation, useQueryClient } from '@tanstack/react-query'

import { submitAssessment } from '@/features/avaliacao/services/assessments'
import { assessmentsQueryKey } from '@/features/avaliacao/composables/useGetAssessment'
import { historicoGestanteQueryKey } from '@/features/avaliacao/composables/useGetHistoricoGestante'
import type { SubmitAssessmentPayload } from '@/features/avaliacao/types/assessment'

export function useSubmitAssessment(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: SubmitAssessmentPayload) => submitAssessment(payload),
		onSuccess: ({ data }) => {
			queryClient.invalidateQueries({ queryKey: assessmentsQueryKey })
			queryClient.invalidateQueries({ queryKey: historicoGestanteQueryKey(data.patientId) })
			options?.onSuccess?.()
		},
	})
}
