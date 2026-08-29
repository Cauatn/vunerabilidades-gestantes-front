import { useQuery } from '@tanstack/react-query'

import { getUsuario } from '@/features/usuarios/services/usuarios'
import { usuariosQueryKey } from '@/features/usuarios/composables/useGetUsuarios'

export function useGetUsuario(id: string | undefined) {
	return useQuery({
		queryKey: [...usuariosQueryKey, id],
		queryFn: () => getUsuario(id as string),
		enabled: !!id,
		select: (response) => response.data,
	})
}
