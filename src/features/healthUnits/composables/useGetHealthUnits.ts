import { useQuery } from '@tanstack/react-query'

import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { getHealthUnits } from '@/features/healthUnits/service/healthUnits'

export const healthUnitsQueryKey = ['health-units']

export function useGetHealthUnits() {
	return useQuery({
		queryKey: healthUnitsQueryKey,
		queryFn: () => getHealthUnits({ page: 1, pageSize: PAGE_SIZE }),
		select: (response) => response.data,
	})
}
