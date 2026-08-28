import { useMemo, useState } from 'react'

import { Page } from '@/components/Layout/Page'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { useSession } from '@/features/auth/composables/useSession'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'
import { UsuarioSheet } from '@/features/usuarios/components/UsuarioSheet'
import { createUsuariosColumns } from '@/features/usuarios/components/usuariosDataTable/columns'
import { useActivateUsuario } from '@/features/usuarios/composables/useActivateUsuario'
import { useDeactivateUsuario } from '@/features/usuarios/composables/useDeactivateUsuario'
import { useGetUsuarios } from '@/features/usuarios/composables/useGetUsuarios'
import { useInviteUsuario } from '@/features/usuarios/composables/useInviteUsuario'
import type { InviteUsuarioPayload, Usuario } from '@/features/usuarios/types/usuario'

export function UsuariosPage() {
	const { data, isLoading, page, setPage, busca, setBusca } = useGetUsuarios()
	const { data: healthUnits } = useGetHealthUnits()
	const { user } = useSession()

	const [termo, setTermo] = useState(busca ?? '')
	const [sheetOpen, setSheetOpen] = useState(false)

	const convidar = useInviteUsuario({ onSuccess: () => setSheetOpen(false) })
	const inativar = useDeactivateUsuario()
	const ativar = useActivateUsuario()

	const ubsNomePorId = useMemo(() => {
		const map = new Map<string, string>()
		healthUnits?.items.forEach((unit) => map.set(unit.id, unit.name))
		return map
	}, [healthUnits])

	function buscar() {
		void setBusca(termo.trim() || null)
		void setPage(1)
	}

	function handleInvite(payload: InviteUsuarioPayload) {
		convidar.mutate(payload)
	}

	function handleToggleStatus(usuario: Usuario) {
		// trava de segurança: ninguém altera o status da própria conta pelo front
		if (usuario.id === user?.id) return
		if (usuario.status === 'ACTIVE') inativar.mutate(usuario.id)
		else ativar.mutate(usuario.id)
	}

	const columns = createUsuariosColumns({ onToggleStatus: handleToggleStatus, ubsNomePorId })
	const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

	return (
		<>
			<Page
				title="Usuários"
				description="Gerencie os profissionais e suas UBS de atuação."
				withButton
				buttonText="Criar usuário"
				buttonProps={{ onClick: () => setSheetOpen(true) }}
			>
				<div className="flex items-center gap-3">
					<Input
						placeholder="Buscar por nome ou e-mail..."
						value={termo}
						onChange={(event) => setTermo(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter') buscar()
						}}
						className="flex-1"
					/>
					<Button type="button" onClick={buscar}>
						Buscar
					</Button>
				</div>

				<DataTable
					columns={columns}
					data={data?.items}
					isLoading={isLoading}
					emptyStateTitle="Nenhum usuário encontrado."
					emptyStateDescription="Convide profissionais para dar acesso ao sistema."
				/>

				{data ? (
					<Pagination page={page} totalPages={totalPages} onPageChange={(next) => void setPage(next)} />
				) : null}
			</Page>

			<UsuarioSheet
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onSubmit={handleInvite}
				isSubmitting={convidar.isPending}
			/>
		</>
	)
}
