import { useMutation } from '@tanstack/react-query'

import { getSessionUser, updateSessionUser } from '@/features/core/service/tokenService'
import { setCurrentHealthUnit } from '@/features/usuarios/services/usuarios'
import type { Usuario } from '@/features/usuarios/types/usuario'

export function useSetCurrentHealthUnit(options?: { onSuccess?: () => void }) {
	return useMutation({
		mutationFn: (healthUnitId: string) => setCurrentHealthUnit(healthUnitId),
		onSuccess: ({ data }: { data: Usuario }) => {
			const session = getSessionUser()
			if (session) {
				updateSessionUser({ ...session, currentHealthUnitId: data.currentHealthUnitId })
			}
			options?.onSuccess?.()
		},
	})
}
