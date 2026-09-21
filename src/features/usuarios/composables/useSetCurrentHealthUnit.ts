import { useMutation, useQueryClient } from '@tanstack/react-query'

import { assessmentsQueryKey } from '@/features/avaliacao/composables/useAssessments'
import {
	getSessionUser,
	updateSessionUser,
} from '@/features/core/service/tokenService'
import { gestantesQueryKey } from '@/features/gestantes/composables/useGetGestantes'
import { setCurrentHealthUnit } from '@/features/usuarios/services/usuarios'
import type { Usuario } from '@/features/usuarios/types/usuario'

export function useSetCurrentHealthUnit(options?: {
	onSuccess?: () => void
	onError?: () => void
}) {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (healthUnitId: string) =>
			setCurrentHealthUnit(healthUnitId),
		onSuccess: async ({ data }: { data: Usuario }) => {
			const session = getSessionUser()
			if (session) {
				updateSessionUser({
					...session,
					currentHealthUnitId: data.currentHealthUnitId,
				})
				await Promise.all([
					queryClient.invalidateQueries({
						queryKey: assessmentsQueryKey,
					}),
					queryClient.invalidateQueries({
						queryKey: gestantesQueryKey,
					}),
				])
			}
			options?.onSuccess?.()
		},
		onError: () => {
			options?.onError?.()
		},
	})
}
