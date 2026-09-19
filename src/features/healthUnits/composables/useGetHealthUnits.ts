import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { getHealthUnits } from '@/features/healthUnits/service/healthUnits'

import type { ListHealthUnitsParams } from '../types/healthUnit'

export const healthUnitsQueryKey = ['health-units']

export function useGetHealthUnits(params?: Partial<ListHealthUnitsParams>) {
	const [page, setPage] = useQueryState(
		'unidadePagina',
		parseAsInteger.withDefault(1),
	)
	const [busca, setBusca] = useQueryState(
		'unidadeBusca',
		parseAsString.withDefault(''),
	)

	const mergedParams = {
		page,
		pageSize: PAGE_SIZE,
		name: busca,
		...params,
	}

	const query = useQuery({
		queryKey: [...healthUnitsQueryKey, mergedParams],
		queryFn: () => getHealthUnits(mergedParams),
		select: (response) => response.data,
	})

	return { ...query, page, setPage, busca, setBusca }
}
