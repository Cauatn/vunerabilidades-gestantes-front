import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import type { HealthUnit } from '@/features/healthUnits/types/healthUnit'
import { HealthUnitActionsCell } from './actionsCell'

interface CreateHealthUnitsColumnsParams {
	onEdit: (healthUnit: HealthUnit) => void
	onToggleStatus: (healthUnit: HealthUnit) => void
}

export function createHealthUnitsColumns({
	onEdit,
	onToggleStatus,
}: CreateHealthUnitsColumnsParams): ColumnDef<HealthUnit>[] {
	return [
		{
			accessorKey: 'name',
			header: 'Nome',
			cell: ({ getValue }) => <span className="font-medium text-n-700">{getValue() as string}</span>,
		},
		{ accessorKey: 'code', header: 'Código CNES' },
		{
			id: 'localizacao',
			header: 'Município/UF',
			cell: ({ row }) => `${row.original.city}/${row.original.state}`,
		},
		{
			accessorKey: 'active',
			header: 'Status',
			cell: ({ getValue }) => (
				<Badge variant={getValue() ? 'green' : 'red'}>{getValue() ? 'Ativa' : 'Inativa'}</Badge>
			),
		},
		{
			id: 'actions',
			cell: ({ row }) => (
				<HealthUnitActionsCell healthUnit={row.original} onEdit={onEdit} onToggleStatus={onToggleStatus} />
			),
		},
	]
}
