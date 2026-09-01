import type { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { CATEGORIA_PROFISSIONAL_LABEL } from '@/features/usuarios/constants/categoriaProfissional'
import { ROLE_TO_CATEGORIA, type Usuario } from '@/features/usuarios/types/usuario'
import { UsuarioActionsCell } from './actionsCell'

const MAX_UBS_VISIVEIS = 2

interface CreateUsuariosColumnsParams {
	onToggleStatus: (usuario: Usuario) => void
	ubsNomePorId: Map<string, string>
}

export function createUsuariosColumns({
	onToggleStatus,
	ubsNomePorId,
}: CreateUsuariosColumnsParams): ColumnDef<Usuario>[] {
	return [
		{
			accessorKey: 'name',
			header: 'Nome',
			cell: ({ getValue }) => <span className="font-medium text-n-700">{getValue() as string}</span>,
		},
		{ accessorKey: 'email', header: 'Email' },
		{
			accessorKey: 'role',
			header: 'Categoria profissional',
			cell: ({ getValue }) =>
				CATEGORIA_PROFISSIONAL_LABEL[ROLE_TO_CATEGORIA[getValue() as Usuario['role']]],
		},
		{
			id: 'ubs',
			header: 'UBS de atendimento',
			cell: ({ row }) => {
				const nomes = row.original.healthUnitIds
					.map((id) => ubsNomePorId.get(id))
					.filter((nome): nome is string => !!nome)
				if (nomes.length === 0) return <span className="text-n-400">-</span>

				const visiveis = nomes.slice(0, MAX_UBS_VISIVEIS)
				const restantes = nomes.length - visiveis.length
				return (
					<div className="flex flex-wrap items-center gap-1">
						{visiveis.map((nome) => (
							<Badge key={nome} variant="neutral">
								{nome}
							</Badge>
						))}
						{restantes > 0 ? <Badge variant="outline">+{restantes}</Badge> : null}
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
			cell: ({ row }) => <UsuarioActionsCell usuario={row.original} onToggleStatus={onToggleStatus} />,
		},
	]
}
