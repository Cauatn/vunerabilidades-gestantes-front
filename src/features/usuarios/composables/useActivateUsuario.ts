import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateUsuarioStatus } from '@/features/usuarios/services/usuarios'
import { usuariosQueryKey } from '@/features/usuarios/composables/useGetUsuarios'

export function useActivateUsuario(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => updateUsuarioStatus(id, 'ACTIVE'),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usuariosQueryKey })
			options?.onSuccess?.()
		},
	})
}
