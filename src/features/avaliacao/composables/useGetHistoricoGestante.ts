import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, useQueryState } from 'nuqs'

import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { getPatientHistory } from '@/features/avaliacao/services/assessments'

export const historicoGestanteQueryKey = (patientId: string) => [
	'patients',
	patientId,
	'assessments',
]

export function useGetHistoricoGestante(patientId: string | undefined) {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

	const query = useQuery({
		queryKey: [...historicoGestanteQueryKey(patientId ?? ''), { page }],
		queryFn: () => getPatientHistory(patientId as string, { page, pageSize: PAGE_SIZE }),
		enabled: !!patientId,
		select: (response) => response.data,
	})

	return { ...query, page, setPage }
}
