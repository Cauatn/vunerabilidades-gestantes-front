import { useQuery } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { getUsuarios } from '@/features/usuarios/services/usuarios'
import type { PaginatedUsuarios } from '@/features/usuarios/types/usuario'

export const usuariosQueryKey = ['users']

export function useGetUsuarios() {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	const [busca, setBusca] = useQueryState('busca', parseAsString)

	const query = useQuery({
		queryKey: [...usuariosQueryKey, { page, busca }],
		queryFn: () => getUsuarios({ page, pageSize: PAGE_SIZE, search: busca }),
		select: (response) => response.data as PaginatedUsuarios,
	})

	return { ...query, page, setPage, busca, setBusca }
}
