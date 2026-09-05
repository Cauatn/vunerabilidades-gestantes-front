import { SquarePen, UserRound } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import type { Gestante } from '@/features/gestantes/types/gestante'

interface GestanteActionsCellProps {
	gestante: Gestante
	onVerPerfil: (gestante: Gestante) => void
	onEditar: (gestante: Gestante) => void
}

export function GestanteActionsCell({ gestante, onVerPerfil, onEditar }: GestanteActionsCellProps) {
	return (
		<div className="flex items-center justify-end gap-1">
			<IconButton icon={UserRound} tooltipText="Ver perfil" onClick={() => onVerPerfil(gestante)} />
			<IconButton icon={SquarePen} tooltipText="Editar" onClick={() => onEditar(gestante)} />
		</div>
	)
}
