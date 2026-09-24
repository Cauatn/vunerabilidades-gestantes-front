import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { CATEGORIA_PROFISSIONAL_LABEL } from '@/features/usuarios/constants/categoriaProfissional'
import {
	ROLE_TO_CATEGORIA,
	type Usuario,
} from '@/features/usuarios/types/usuario'
import { UsuarioActionsCell } from './actionsCell'

const MAX_UBS_VISIVEIS = 2

interface CreateUsuariosColumnsParams {
	onEdit: (usuario: Usuario) => void
	onToggleStatus: (usuario: Usuario) => void
	ubsNomePorId: Map<string, { name: string; active: boolean }>
}

export function createUsuariosColumns({
	onEdit,
	onToggleStatus,
	ubsNomePorId,
}: CreateUsuariosColumnsParams): ColumnDef<Usuario>[] {
	return [
		{
			accessorKey: 'name',
			header: 'Nome',
			cell: ({ getValue }) => (
				<span className="font-medium text-n-700">
					{getValue() as string}
				</span>
			),
		},
		{ accessorKey: 'email', header: 'Email' },
		{
			accessorKey: 'role',
			header: 'Categoria profissional',
			cell: ({ getValue }) =>
				CATEGORIA_PROFISSIONAL_LABEL[
					ROLE_TO_CATEGORIA[getValue() as Usuario['role']]
				],
		},
		{
			id: 'ubs',
			header: 'UBS de atendimento',
			cell: ({ row }) => {
				const ubss = row.original.healthUnitIds
					.map((id) => ubsNomePorId.get(id))
					.sort((a, b) => (a === b ? 0 : a ? -1 : 1))
					.filter((ubs) => !!ubs)
				if (ubss.length === 0)
					return <span className="text-n-400">-</span>

				const visiveis = ubss.slice(0, MAX_UBS_VISIVEIS)
				const restantes = ubss.length - visiveis.length
				return (
					<div className="flex flex-wrap items-center gap-1">
						{visiveis.map((ubs) => (
							<Badge
								key={ubs.name}
								variant={
									ubs.active === true ? 'neutral' : 'red'
								}
							>
								{ubs.name}
							</Badge>
						))}
						{restantes > 0 ? (
							<Badge variant="outline">+{restantes}</Badge>
						) : null}
					</div>
				)
			},
		},
		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ getValue }) => {
				const status = getValue() as Usuario['status']
				return (
					<Badge variant={status === 'ACTIVE' ? 'green' : 'red'}>
						{status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
					</Badge>
				)
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => (
				<UsuarioActionsCell
					usuario={row.original}
					onEdit={onEdit}
					onToggleStatus={onToggleStatus}
				/>
			),
		},
	]
}
