import { useQuery } from '@tanstack/react-query'

import { getAssessment } from '@/features/avaliacao/services/assessments'

export const assessmentsQueryKey = ['assessments']

export function useGetAssessment(id: string | undefined) {
	return useQuery({
		queryKey: [...assessmentsQueryKey, id],
		queryFn: () => getAssessment(id as string),
		enabled: !!id,
		select: (response) => response.data,
	})
}
