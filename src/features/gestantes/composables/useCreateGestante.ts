import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createGestante } from '@/features/gestantes/services/gestantes'
import { gestantesQueryKey } from '@/features/gestantes/composables/useGetGestantes'
import type { CreateGestantePayload } from '@/features/gestantes/types/gestante'

export function useCreateGestante(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: CreateGestantePayload) => createGestante(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: gestantesQueryKey })
			options?.onSuccess?.()
		},
	})
}
