import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { getGestantes } from '@/features/gestantes/services/gestantes'
import type { ListGestantesParams } from '../types/gestante'

export const gestantesQueryKey = ['patients']

export function useGetGestantes(
	filters: Omit<ListGestantesParams, 'page' | 'pageSize' | 'name'> = {},
) {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	const [busca, setBusca] = useQueryState(
		'busca',
		parseAsString.withDefault(''),
	)

	const query = useQuery({
		queryKey: [...gestantesQueryKey, { page, busca, ...filters }],
		queryFn: () =>
			getGestantes({
				page,
				pageSize: PAGE_SIZE,
				name: busca,
				...filters,
			}),
		select: (response) => response.data,
	})

	return { ...query, page, setPage, busca, setBusca }
}
