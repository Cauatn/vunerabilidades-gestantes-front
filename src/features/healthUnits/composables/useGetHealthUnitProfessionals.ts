import { useQuery } from '@tanstack/react-query'
import { getHealthUnitProfessionals } from '../service/healthUnits'

export const healthUnitProfessionalsQueryKey = ['health-unit-professionals']

export function useGetHealthUnitProfessionals(
	healthUnitId?: string | null,
	params: { page?: number; pageSize?: number } = {},
) {
	return useQuery({
		queryKey: [...healthUnitProfessionalsQueryKey, healthUnitId, params],
		queryFn: () => getHealthUnitProfessionals(healthUnitId!, params),
		enabled: Boolean(healthUnitId),
		select: (response) => response.data,
	})
}
