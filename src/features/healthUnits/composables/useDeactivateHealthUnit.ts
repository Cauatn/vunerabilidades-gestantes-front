import { useMutation, useQueryClient } from '@tanstack/react-query'

import { healthUnitsQueryKey } from '@/features/healthUnits/composables/useGetHealthUnits'
import { updateHealthUnit } from '@/features/healthUnits/service/healthUnits'

export function useDeactivateHealthUnit(options?: {
	onSuccess?: () => void
	onError?: () => void
}) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: string) => updateHealthUnit(id, { active: false }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: healthUnitsQueryKey })
			options?.onSuccess?.()
		},
		onError: () => {
			options?.onError?.()
		},
	})
}
