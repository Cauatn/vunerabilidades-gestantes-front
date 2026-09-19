import { useQuery } from '@tanstack/react-query'
import { getLocalitiesByUf } from '../services/brasilApi'

export const useGetLocalities = ['brasil-api-localities'] as const

export function useGetLocalitiesByUf(uf: string) {
	return useQuery({
		queryKey: [...useGetLocalities, uf],
		queryFn: () => getLocalitiesByUf(uf),
		enabled: !!uf,
		select: (response) => response.data,
	})
}
