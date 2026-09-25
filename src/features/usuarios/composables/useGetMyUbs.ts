import { useQuery } from '@tanstack/react-query'

import { getMyUbs } from '@/features/usuarios/services/usuarios'

export const myUbsQueryKey = ['my-ubs']

export function useGetMyUbs() {
	return useQuery({
		queryKey: myUbsQueryKey,
		queryFn: () => getMyUbs(),
		select: (response) => response.data,
	})
}
