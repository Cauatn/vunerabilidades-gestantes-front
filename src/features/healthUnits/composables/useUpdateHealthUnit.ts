import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateHealthUnit } from '@/features/healthUnits/service/healthUnits'
import { healthUnitsQueryKey } from '@/features/healthUnits/composables/useGetHealthUnits'
import type { UpdateHealthUnitPayload } from '@/features/healthUnits/types/healthUnit'

export function useUpdateHealthUnit(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateHealthUnitPayload }) =>
			updateHealthUnit(id, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: healthUnitsQueryKey })
			options?.onSuccess?.()
		},
	})
}
