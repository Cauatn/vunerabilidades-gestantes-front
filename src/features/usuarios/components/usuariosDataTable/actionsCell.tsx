import { UserRoundCheck, UserRoundX } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import { useSession } from '@/features/auth/composables/useSession'
import type { Usuario } from '@/features/usuarios/types/usuario'

interface UsuarioActionsCellProps {
	usuario: Usuario
	onToggleStatus: (usuario: Usuario) => void
}

export function UsuarioActionsCell({ usuario, onToggleStatus }: UsuarioActionsCellProps) {
	const { user } = useSession()
	const ativo = usuario.status === 'ACTIVE'
	const ehProprioUsuario = user?.id === usuario.id

	return (
		<div className="flex items-center justify-end gap-1">
			<IconButton
				icon={ativo ? UserRoundX : UserRoundCheck}
				tooltipText={
					ehProprioUsuario
						? 'Você não pode alterar o status da sua própria conta'
						: ativo
							? 'Inativar'
							: 'Ativar'
				}
				disabled={ehProprioUsuario}
				onClick={() => onToggleStatus(usuario)}
			/>
		</div>
	)
}
