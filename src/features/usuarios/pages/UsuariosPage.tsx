import { useMemo, useState } from 'react'

import { Page } from '@/components/Layout/Page'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { Modal } from '@/features/core/components/Modal'
import { useSession } from '@/features/auth/composables/useSession'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'
import { UsuarioSheet } from '@/features/usuarios/components/UsuarioSheet'
import { createUsuariosColumns } from '@/features/usuarios/components/usuariosDataTable/columns'
import { useActivateUsuario } from '@/features/usuarios/composables/useActivateUsuario'
import { useDeactivateUsuario } from '@/features/usuarios/composables/useDeactivateUsuario'
import { useGetUsuarios } from '@/features/usuarios/composables/useGetUsuarios'
import { useInviteUsuario } from '@/features/usuarios/composables/useInviteUsuario'
import { useUpdateUsuario } from '@/features/usuarios/composables/useUpdateUsuario'
import type { InviteUsuarioPayload, Usuario } from '@/features/usuarios/types/usuario'
import { toast } from 'sonner'

export function UsuariosPage() {
	const { data, isLoading, page, setPage, busca, setBusca } = useGetUsuarios()
	const { data: healthUnits } = useGetHealthUnits()
	const { user } = useSession()

	const [searchTerm, setSearchTerm] = useState(busca)
	const [sheetOpen, setSheetOpen] = useState(false)
	const [editingUser, setEditingUser] = useState<Usuario | undefined>(undefined)
	const [statusChangeTarget, setStatusChangeTarget] = useState<{data: Usuario, action: 'Ativar' | 'Desativar'} | undefined>(undefined)

	const invite = useInviteUsuario({ onSuccess: onMutateSuccess, onError: onMutateError })
	const update = useUpdateUsuario({ onSuccess: onMutateSuccess, onError: onMutateError })
	const deactivate = useDeactivateUsuario(
		{
		onSuccess: () => toast.success('O acesso do profissional foi desativado com sucesso'),
		onError: () => toast.error(
			'Houve um erro ao desatiar o acesso do profissonal',
			{ description: 'Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.' }
		)
	}
	)
	const activate = useActivateUsuario({
		onSuccess: () => toast.success('O acesso do profissional foi ativado com sucesso'),
		onError: () => toast.error(
			'Houve um erro ao reativar o acesso do profissonal',
			{ description: 'Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.' }
		)
	})

	const ubsNomePorId = useMemo(() => {
		const map = new Map<string, string>()
		healthUnits?.items.forEach((unit) => map.set(unit.id, unit.name))
		return map
	}, [healthUnits])

	function search() {
		void setBusca(searchTerm.trim())
		void setPage(1)
	}

	function handleSubmit(payload: InviteUsuarioPayload) {
		if (editingUser) {
			update.mutate({ id: editingUser.id, payload: { role: payload.role, healthUnitIds: payload.healthUnitIds } })
		} else {
			invite.mutate(payload)
		}
	}

	function onMutateSuccess() {
		const action = editingUser ? {
			label: 'editado',
		} : {
			label: 'criado',
			description: 'Um convite de acesso foi enviado para o email do usuário. O cadastro deve ser finalizado via convite.'
		}

		setSheetOpen(false)
		toast.success(`Profissional ${action.label} com sucesso.`, { description: action.description })
	}

	function onMutateError() {
		const action = editingUser ? 'editar' : 'criar'

		toast.error(`Houve um erro ao ${action} o profissional`, {
			description: 'Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.'
		})
	}

	function handleToggleStatus(usuario: Usuario) {
		// trava de segurança: ninguém altera o status da própria conta pelo front
		if (usuario.id === user?.id) return
		setStatusChangeTarget({ data: usuario, action: usuario.status === 'ACTIVE' ? 'Desativar' : 'Ativar' })
	}

	function buildStatusChangeModalDescription() {
		const benefit = statusChangeTarget?.data.status === 'ACTIVE' ? 'perde' : 'ganha'
		return `Ao ${statusChangeTarget?.action.toLowerCase()}, este profissional ${benefit} o acesso ao sistema. O cadastro é mantido e pode ser reativado depois.`
	}

	const columns = createUsuariosColumns({
		onEdit: (usuario) => {
			setEditingUser(usuario)
			setSheetOpen(true)
		},
		onToggleStatus: handleToggleStatus,
		ubsNomePorId,
	})
	const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

	return (
		<>
			<Page
				title="Usuários"
				description="Gerencie os profissionais e suas UBS de atuação."
				withButton
				buttonText="Criar usuário"
				buttonProps={{
					onClick: () => {
						setEditingUser(undefined)
						setSheetOpen(true)
					},
				}}
			>
				<div className="flex items-center gap-3">
					<Input
						placeholder="Buscar por nome ou e-mail..."
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter') search()
						}}
						className="flex-1"
					/>
					<Button type="button" onClick={search}>
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
				usuario={editingUser}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onSubmit={handleSubmit}
				isSubmitting={invite.isPending || update.isPending}
			/>

			<Modal
				open={!!statusChangeTarget}
				onOpenChange={(open) => !open && setStatusChangeTarget(undefined)}
				variant="warning"
				title={`${statusChangeTarget?.action} profissional`}
				description={buildStatusChangeModalDescription()}
				confirmLabel={statusChangeTarget?.action as string}
				onConfirm={() => {
					const data = statusChangeTarget?.data
					if (!statusChangeTarget) return

					data?.status === 'ACTIVE' ? deactivate.mutate(data!.id) : activate.mutate(data!.id)
					setStatusChangeTarget(undefined)
				}}
			/>
		</>
	)
}
