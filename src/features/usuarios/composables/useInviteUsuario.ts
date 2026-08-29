import { useMutation, useQueryClient } from '@tanstack/react-query'

import { inviteUsuario } from '@/features/usuarios/services/usuarios'
import { usuariosQueryKey } from '@/features/usuarios/composables/useGetUsuarios'
import type { InviteUsuarioPayload } from '@/features/usuarios/types/usuario'

export function useInviteUsuario(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: InviteUsuarioPayload) => inviteUsuario(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usuariosQueryKey })
			options?.onSuccess?.()
		},
	})
}
