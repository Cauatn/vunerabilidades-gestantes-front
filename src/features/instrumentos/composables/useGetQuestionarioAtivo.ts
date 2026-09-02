import { useQuery } from '@tanstack/react-query'

import { getActiveQuestionnaire } from '@/features/instrumentos/services/questionnaires'

export const questionarioQueryKey = ['questionnaires', 'active']

export function useGetQuestionarioAtivo() {
	return useQuery({
		queryKey: questionarioQueryKey,
		queryFn: () => getActiveQuestionnaire(),
		retry: false,
		select: (response) => response.data,
	})
}
