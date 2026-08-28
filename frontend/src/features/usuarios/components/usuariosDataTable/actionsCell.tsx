import { SquarePen } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import type { Usuario } from '@/features/usuarios/types/usuario'

interface UsuarioActionsCellProps {
	usuario: Usuario
	onEdit: (usuario: Usuario) => void
}

export function UsuarioActionsCell({ usuario, onEdit }: UsuarioActionsCellProps) {
	return (
		<div className="flex items-center justify-end gap-1">
			<IconButton icon={SquarePen} tooltipText="Editar usuário" onClick={() => onEdit(usuario)} />
		</div>
	)
}
