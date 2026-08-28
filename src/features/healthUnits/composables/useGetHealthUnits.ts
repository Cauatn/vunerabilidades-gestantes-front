import { useQuery } from '@tanstack/react-query'

import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { getHealthUnits } from '@/features/healthUnits/service/healthUnits'
import type { PaginatedHealthUnits } from '@/features/healthUnits/types/healthUnit'

export const healthUnitsQueryKey = ['health-units']

export function useGetHealthUnits() {
	return useQuery({
		queryKey: healthUnitsQueryKey,
		queryFn: () => getHealthUnits({ pageSize: PAGE_SIZE }),
		select: (response) => response.data as PaginatedHealthUnits,
	})
}
