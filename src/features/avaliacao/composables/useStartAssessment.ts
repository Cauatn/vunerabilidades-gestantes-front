import { useMutation } from '@tanstack/react-query'

import { startAssessment } from '@/features/avaliacao/services/assessments'
import type { StartAssessmentPayload } from '@/features/avaliacao/types/assessment'

export function useStartAssessment() {
	return useMutation({
		mutationFn: (payload: StartAssessmentPayload) => startAssessment(payload),
	})
}
