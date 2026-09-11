import { useQuery } from '@tanstack/react-query'

import { getActiveQuestionnaire } from '@/features/instrumentos/services/questionario'

export const questionarioAtivoQueryKey = ['questionnaires', 'active']

export function useGetQuestionarioAtivo(options?: { enabled?: boolean }) {
	return useQuery({
		queryKey: questionarioAtivoQueryKey,
		queryFn: getActiveQuestionnaire,
		select: (response) => response.data,
		retry: false,
		enabled: options?.enabled ?? true,
	})
}
