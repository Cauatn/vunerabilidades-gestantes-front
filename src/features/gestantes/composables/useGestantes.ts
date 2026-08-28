import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import {
	createGestante,
	deactivateGestante,
	getGestantes,
	updateGestante,
} from '@/features/gestantes/services/gestantes'
import type {
	CreateGestantePayload,
	PaginatedGestantes,
	UpdateGestantePayload,
} from '@/features/gestantes/types/gestante'

const PAGE_SIZE = 10

export const gestantesQueryKey = ['patients']

export function useGestantesListagem() {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	const [busca, setBusca] = useQueryState('busca', parseAsString)

	const query = useQuery({
		queryKey: [...gestantesQueryKey, { page, busca }],
		queryFn: () => getGestantes({ page, limit: PAGE_SIZE, search: busca }),
		select: (response) => response.data as PaginatedGestantes,
	})

	return { ...query, page, setPage, busca, setBusca, pageSize: PAGE_SIZE }
}

export function useGestantesOptions() {
	return useQuery({
		queryKey: [...gestantesQueryKey, 'options'],
		queryFn: () => getGestantes({ limit: 100, isActive: true }),
		select: (response) => (response.data as PaginatedGestantes).data,
	})
}

export function useCreateGestante(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: CreateGestantePayload) =>
			createGestante(payload).then((response) => response.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: gestantesQueryKey })
			options?.onSuccess?.()
		},
	})
}

export function useUpdateGestante(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateGestantePayload }) =>
			updateGestante(id, payload).then((response) => response.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: gestantesQueryKey })
			options?.onSuccess?.()
		},
	})
}

export function useDeactivateGestante(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => deactivateGestante(id).then((response) => response.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: gestantesQueryKey })
			options?.onSuccess?.()
		},
	})
}
