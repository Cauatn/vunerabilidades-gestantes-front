import { UserRoundCheck, UserRoundX } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import type { Usuario } from '@/features/usuarios/types/usuario'

interface UsuarioActionsCellProps {
	usuario: Usuario
	onToggleStatus: (usuario: Usuario) => void
}

export function UsuarioActionsCell({ usuario, onToggleStatus }: UsuarioActionsCellProps) {
	const ativo = usuario.status === 'ACTIVE'
	return (
		<div className="flex items-center justify-end gap-1">
			<IconButton
				icon={ativo ? UserRoundX : UserRoundCheck}
				tooltipText={ativo ? 'Inativar' : 'Ativar'}
				onClick={() => onToggleStatus(usuario)}
			/>
		</div>
	)
}
