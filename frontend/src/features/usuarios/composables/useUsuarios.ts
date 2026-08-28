import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { getSessionUser, updateSessionUser } from '@/features/core/service/tokenService'
import {
	createUsuario,
	getUsuarios,
	setCurrentHealthUnit,
	updateUsuario,
	updateUsuarioStatus,
} from '@/features/usuarios/services/usuarios'
import type {
	CreateUsuarioPayload,
	PaginatedUsuarios,
	UpdateUsuarioPayload,
	UsuarioStatus,
} from '@/features/usuarios/types/usuario'

const PAGE_SIZE = 10

export const usuariosQueryKey = ['users']

export function useUsuariosListagem() {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	const [busca, setBusca] = useQueryState('busca', parseAsString)

	const query = useQuery({
		queryKey: [...usuariosQueryKey, { page, busca }],
		queryFn: () => getUsuarios({ page, limit: PAGE_SIZE, search: busca }),
		select: (response) => response.data as PaginatedUsuarios,
	})

	return { ...query, page, setPage, busca, setBusca, pageSize: PAGE_SIZE }
}

export function useCreateUsuario(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: CreateUsuarioPayload) =>
			createUsuario(payload).then((response) => response.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usuariosQueryKey })
			options?.onSuccess?.()
		},
	})
}

export function useUpdateUsuario(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateUsuarioPayload }) =>
			updateUsuario(id, payload).then((response) => response.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usuariosQueryKey })
			options?.onSuccess?.()
		},
	})
}

export function useSetCurrentHealthUnit(options?: { onSuccess?: () => void }) {
	return useMutation({
		mutationFn: (healthUnitId: string) =>
			setCurrentHealthUnit(healthUnitId).then((response) => response.data),
		onSuccess: (updated: { currentHealthUnitId: string | null }) => {
			const session = getSessionUser()
			if (session) {
				updateSessionUser({ ...session, currentHealthUnitId: updated.currentHealthUnitId })
			}
			options?.onSuccess?.()
		},
	})
}

export function useUpdateUsuarioStatus(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: UsuarioStatus }) =>
			updateUsuarioStatus(id, status).then((response) => response.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usuariosQueryKey })
			options?.onSuccess?.()
		},
	})
}
