import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { getGestantes } from '@/features/gestantes/services/gestantes'
import type { PaginatedGestantes } from '@/features/gestantes/types/gestante'

export const gestantesQueryKey = ['patients']

export function useGetGestantes() {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	const [busca, setBusca] = useQueryState('busca', parseAsString)

	const query = useQuery({
		queryKey: [...gestantesQueryKey, { page, busca }],
		queryFn: () => getGestantes({ page, pageSize: PAGE_SIZE, name: busca }),
		select: (response) => response.data as PaginatedGestantes,
	})

	return { ...query, page, setPage, busca, setBusca }
}
