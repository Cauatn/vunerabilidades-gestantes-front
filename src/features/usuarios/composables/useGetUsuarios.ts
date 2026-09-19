import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { getUsuarios } from '@/features/usuarios/services/usuarios'

import type { ListUsuariosParams } from '../types/usuario'

export const usuariosQueryKey = ['users']

export function useGetUsuarios(params?: Partial<ListUsuariosParams>) {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	const [busca, setBusca] = useQueryState(
		'busca',
		parseAsString.withDefault(''),
	)

	const mergedParams = {
		page,
		pageSize: PAGE_SIZE,
		search: busca,
		...params,
	}

	const query = useQuery({
		queryKey: [...usuariosQueryKey, mergedParams],
		queryFn: () => getUsuarios(mergedParams),
		select: (response) => response.data,
	})

	return { ...query, page, setPage, busca, setBusca }
}
