import { SquarePen, User } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import type { Gestante } from '@/features/gestantes/types/gestante'

interface GestanteActionsCellProps {
	gestante: Gestante
	onEdit: (gestante: Gestante) => void
	onVerDetalhes: (gestante: Gestante) => void
}

export function GestanteActionsCell({ gestante, onEdit, onVerDetalhes }: GestanteActionsCellProps) {
	return (
		<div className="flex items-center justify-end gap-1">
			<IconButton icon={User} tooltipText="Ver detalhes" onClick={() => onVerDetalhes(gestante)} />
			<IconButton icon={SquarePen} tooltipText="Editar gestante" onClick={() => onEdit(gestante)} />
		</div>
	)
}
