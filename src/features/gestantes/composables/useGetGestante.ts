import { useQuery } from '@tanstack/react-query'

import { getGestante } from '@/features/gestantes/services/gestantes'
import { gestantesQueryKey } from '@/features/gestantes/composables/useGetGestantes'
import type { Gestante } from '@/features/gestantes/types/gestante'

export function useGetGestante(id: string | undefined) {
	return useQuery({
		queryKey: [...gestantesQueryKey, id],
		queryFn: () => getGestante(id as string),
		enabled: !!id,
		select: (response) => response.data as Gestante,
	})
}
