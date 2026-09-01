import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createHealthUnit } from '@/features/healthUnits/service/healthUnits'
import { healthUnitsQueryKey } from '@/features/healthUnits/composables/useGetHealthUnits'
import type { CreateHealthUnitPayload } from '@/features/healthUnits/types/healthUnit'

export function useCreateHealthUnit(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: CreateHealthUnitPayload) => createHealthUnit(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: healthUnitsQueryKey })
			options?.onSuccess?.()
		},
	})
}
