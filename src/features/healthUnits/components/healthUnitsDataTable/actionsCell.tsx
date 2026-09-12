import { Lock, SquarePen, Unlock } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import type { HealthUnit } from '@/features/healthUnits/types/healthUnit'

interface HealthUnitActionsCellProps {
	healthUnit: HealthUnit
	onEdit: (healthUnit: HealthUnit) => void
	onToggleStatus: (healthUnit: HealthUnit) => void
}

export function HealthUnitActionsCell({ healthUnit, onEdit, onToggleStatus }: HealthUnitActionsCellProps) {
	return (
		<div className="flex items-center justify-end gap-1">
			<IconButton icon={SquarePen} tooltipText="Editar" onClick={() => onEdit(healthUnit)} />
			<IconButton
				icon={healthUnit.active ? Lock : Unlock}
				tooltipText={healthUnit.active ? 'Desativar' : 'Ativar'}
				onClick={() => onToggleStatus(healthUnit)}
			/>
		</div>
	)
}
