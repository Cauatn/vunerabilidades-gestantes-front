import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateUsuarioStatus } from '@/features/usuarios/services/usuarios'
import { usuariosQueryKey } from '@/features/usuarios/composables/useGetUsuarios'
import type { UsuarioStatus } from '@/features/usuarios/types/usuario'

export function useUpdateUsuarioStatus(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: UsuarioStatus }) =>
			updateUsuarioStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usuariosQueryKey })
			options?.onSuccess?.()
		},
	})
}
