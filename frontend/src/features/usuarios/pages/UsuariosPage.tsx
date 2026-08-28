import { useMemo, useState } from 'react'

import { Page } from '@/components/Layout/Page'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { useHealthUnits } from '@/features/healthUnits/composables/useHealthUnits'
import { UsuarioSheet } from '@/features/usuarios/components/UsuarioSheet'
import { createUsuariosColumns } from '@/features/usuarios/components/usuariosDataTable/columns'
import {
	useCreateUsuario,
	useUpdateUsuario,
	useUsuariosListagem,
} from '@/features/usuarios/composables/useUsuarios'
import type { CreateUsuarioPayload, Usuario } from '@/features/usuarios/types/usuario'

export function UsuariosPage() {
	const { data, isLoading, page, setPage, busca, setBusca } = useUsuariosListagem()
	const { data: healthUnits } = useHealthUnits({ activeOnly: true })

	const [termoBusca, setTermoBusca] = useState(busca ?? '')
	const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<Usuario | undefined>(undefined)
	const [sheetOpen, setSheetOpen] = useState(false)

	const criar = useCreateUsuario({ onSuccess: () => setSheetOpen(false) })
	const atualizar = useUpdateUsuario({ onSuccess: () => setSheetOpen(false) })

	const ubsNomePorId = useMemo(() => {
		const map = new Map<string, string>()
		healthUnits?.data.forEach((unit) => map.set(unit.id, unit.name))
		return map
	}, [healthUnits])

	function aplicarBusca() {
		void setBusca(termoBusca.trim() || null)
		void setPage(1)
	}

	function abrirCriacao() {
		setUsuarioEmEdicao(undefined)
		setSheetOpen(true)
	}

	function handleSubmit(payload: CreateUsuarioPayload) {
		if (usuarioEmEdicao) {
			atualizar.mutate({
				id: usuarioEmEdicao.id,
				payload: {
					role: payload.role,
					regiaoUf: payload.regiaoUf,
					regiaoMunicipio: payload.regiaoMunicipio,
					healthUnitIds: payload.healthUnitIds,
				},
			})
		} else {
			criar.mutate(payload)
		}
	}

	const columns = createUsuariosColumns({
		onEdit: (usuario) => {
			setUsuarioEmEdicao(usuario)
			setSheetOpen(true)
		},
		ubsNomePorId,
	})

	return (
		<>
			<Page
				title="Usuários"
				description="Gerencie os profissionais e suas UBS de atuação."
				withButton
				buttonText="Criar usuário"
				buttonProps={{ onClick: abrirCriacao }}
			>
				<div className="flex items-center gap-3">
					<Input
						placeholder="Buscar por nome ou e-mail..."
						value={termoBusca}
						onChange={(event) => setTermoBusca(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter') aplicarBusca()
						}}
						className="flex-1"
					/>
					<Button type="button" onClick={aplicarBusca}>
						Buscar
					</Button>
				</div>

				<DataTable
					columns={columns}
					data={isLoading ? undefined : data?.data}
					isLoading={isLoading}
					emptyStateTitle="Nenhum usuário encontrado."
					emptyStateDescription="Cadastre usuários para dar acesso ao sistema."
				/>

				<Pagination
					page={page}
					totalPages={data?.meta.totalPages ?? 1}
					onPageChange={(next) => void setPage(next)}
				/>
			</Page>

			<UsuarioSheet
				usuario={usuarioEmEdicao}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onSubmit={handleSubmit}
				isSubmitting={criar.isPending || atualizar.isPending}
			/>
		</>
	)
}
