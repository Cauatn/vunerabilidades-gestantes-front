import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateUsuario } from '@/features/usuarios/services/usuarios'
import { usuariosQueryKey } from '@/features/usuarios/composables/useGetUsuarios'
import type { UpdateUsuarioPayload } from '@/features/usuarios/types/usuario'

export function useUpdateUsuario(options?: { onSuccess?: () => void, onError?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateUsuarioPayload }) =>
			updateUsuario(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usuariosQueryKey })
			options?.onSuccess?.()
		},
		onError: () => {
			options?.onError?.()
		}
	})
}
