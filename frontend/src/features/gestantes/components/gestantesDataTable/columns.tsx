import type { ColumnDef } from '@tanstack/react-table'

import { calcularIdade, formatarDataBr } from '@/features/core/utils/date'
import type { Gestante } from '@/features/gestantes/types/gestante'
import { GestanteActionsCell } from './actionsCell'

interface CreateGestantesColumnsParams {
	onEdit: (gestante: Gestante) => void
	onVerDetalhes: (gestante: Gestante) => void
}

export function createGestantesColumns({
	onEdit,
	onVerDetalhes,
}: CreateGestantesColumnsParams): ColumnDef<Gestante>[] {
	return [
		{
			accessorKey: 'name',
			header: 'Nome',
			cell: ({ getValue }) => <span className="font-medium text-n-700">{getValue() as string}</span>,
		},
		{
			id: 'idade',
			header: 'Idade',
			cell: ({ row }) => calcularIdade(row.original.birthDate),
		},
		{
			accessorKey: 'birthDate',
			header: 'Data de nascimento',
			cell: ({ getValue }) => formatarDataBr((getValue() as string).slice(0, 10)),
		},
		{
			accessorKey: 'cpf',
			header: 'CPF',
			cell: ({ getValue }) => (getValue() as string | null) ?? <span className="text-n-400">-</span>,
		},
		{
			accessorKey: 'cns',
			header: 'CNS',
			cell: ({ getValue }) => (getValue() as string | null) ?? <span className="text-n-400">-</span>,
		},
		{
			accessorKey: 'motherName',
			header: 'Nome da mãe',
			cell: ({ getValue }) => (getValue() as string | null) ?? <span className="text-n-400">-</span>,
		},
		{
			id: 'actions',
			cell: ({ row }) => (
				<GestanteActionsCell gestante={row.original} onEdit={onEdit} onVerDetalhes={onVerDetalhes} />
			),
		},
	]
}
