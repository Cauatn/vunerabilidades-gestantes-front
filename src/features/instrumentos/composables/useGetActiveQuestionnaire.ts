import { useQuery } from '@tanstack/react-query'

import { getActiveQuestionnaire } from '@/features/instrumentos/services/questionnaire'

export const activeQuestionnaireQueryKey = ['questionnaires', 'active']

export function useGetActiveQuestionnaire(options?: { enabled?: boolean }) {
	return useQuery({
		queryKey: activeQuestionnaireQueryKey,
		queryFn: getActiveQuestionnaire,
		select: (response) => response.data,
		retry: false,
		enabled: options?.enabled ?? true,
	})
}
