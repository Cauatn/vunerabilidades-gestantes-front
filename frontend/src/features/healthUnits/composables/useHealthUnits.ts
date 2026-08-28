import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
	createHealthUnit,
	getHealthUnits,
	updateHealthUnit,
} from '@/features/healthUnits/service/healthUnits'
import type {
	CreateHealthUnitPayload,
	PaginatedHealthUnits,
	UpdateHealthUnitPayload,
} from '@/features/healthUnits/types/healthUnit'

export const healthUnitsQueryKey = ['health-units']

export function useHealthUnits(params?: { activeOnly?: boolean; limit?: number }) {
	return useQuery({
		queryKey: [...healthUnitsQueryKey, params ?? {}],
		queryFn: () =>
			getHealthUnits({
				limit: params?.limit ?? 100,
				isActive: params?.activeOnly ? true : undefined,
			}),
		select: (response) => response.data as PaginatedHealthUnits,
	})
}

export function useCreateHealthUnit(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: CreateHealthUnitPayload) =>
			createHealthUnit(payload).then((response) => response.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: healthUnitsQueryKey })
			options?.onSuccess?.()
		},
	})
}

export function useUpdateHealthUnit(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateHealthUnitPayload }) =>
			updateHealthUnit(id, payload).then((response) => response.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: healthUnitsQueryKey })
			options?.onSuccess?.()
		},
	})
}
