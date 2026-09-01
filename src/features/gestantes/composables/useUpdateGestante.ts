import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateGestante } from '@/features/gestantes/services/gestantes'
import { gestantesQueryKey } from '@/features/gestantes/composables/useGetGestantes'
import type { UpdateGestantePayload } from '@/features/gestantes/types/gestante'

export function useUpdateGestante(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateGestantePayload }) =>
			updateGestante(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: gestantesQueryKey })
			options?.onSuccess?.()
		},
	})
}
