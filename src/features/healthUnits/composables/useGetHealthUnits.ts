import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { getHealthUnits } from '@/features/healthUnits/service/healthUnits'

export const healthUnitsQueryKey = ['health-units']

export function useGetHealthUnits() {
	const [page, setPage] = useQueryState(
		'unidadePagina',
		parseAsInteger.withDefault(1),
	)
	const [busca, setBusca] = useQueryState(
		'unidadeBusca',
		parseAsString.withDefault(''),
	)

	const query = useQuery({
		queryKey: [...healthUnitsQueryKey, { page, busca }],
		queryFn: () =>
			getHealthUnits({ page, pageSize: PAGE_SIZE, name: busca }),
		select: (response) => response.data,
	})

	return { ...query, page, setPage, busca, setBusca }
}
