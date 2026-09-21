import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Page } from '@/components/Layout/Page'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { createGestantesColumns } from '@/features/gestantes/components/gestantesDataTable/columns'
import { GestanteSheet } from '@/features/gestantes/components/GestanteSheet'
import { useCreateGestante } from '@/features/gestantes/composables/useCreateGestante'
import { useGetGestantes } from '@/features/gestantes/composables/useGetGestantes'
import { useUpdateGestante } from '@/features/gestantes/composables/useUpdateGestante'
import type {
	CreateGestantePayload,
	Gestante,
} from '@/features/gestantes/types/gestante'
import { toast } from 'sonner'
import { GestantesFiltersSheet } from '@/features/gestantes/components/GestantesFiltersSheet'
import {
	activeFilterCount,
} from '@/features/shared/types/listFilters'

import { useListFilters } from '@/features/shared/composables/useListFilters'

export function GestantesPage() {
	const navigate = useNavigate()
	const [filters, setFilters] = useListFilters()
	const [filtersOpen, setFiltersOpen] = useState(false)
	const {
		data,
		page,
		setPage,
		busca,
		setBusca,
		isLoading,
		isError,
		refetch,
	} = useGetGestantes(filters)
	const filterCount = activeFilterCount(filters)

	const [termo, setTermo] = useState(busca)
	const [emEdicao, setEmEdicao] = useState<Gestante | undefined>(undefined)
	const [sheetOpen, setSheetOpen] = useState(false)

	const criar = useCreateGestante({
		onSuccess: onMutateSuccess,
		onError: onMutateError,
	})
	const atualizar = useUpdateGestante({
		onSuccess: onMutateSuccess,
		onError: onMutateError,
	})

	function buscar() {
		void setBusca(termo.trim())
		void setPage(1)
	}

	function handleSubmit(payload: CreateGestantePayload) {
		if (emEdicao) {
			atualizar.mutate({
				id: emEdicao.id,
				payload: {
					name: payload.name,
					cpf: payload.cpf,
					cns: payload.cns,
					birthDate: payload.birthDate,
					motherName: payload.motherName ?? null,
					phone: payload.phone ?? null,
					state: payload.state,
					city: payload.city,
				},
			})
		} else {
			criar.mutate(payload)
		}
	}

	function onMutateSuccess() {
		const action = emEdicao ? 'editada' : 'criada'

		setSheetOpen(false)
		toast.success(`Gestante ${action} com sucesso.`)
	}

	function onMutateError() {
		const action = emEdicao ? 'editar' : 'criar'

		toast.error(`Houve um erro ao ${action} a gestante`, {
			description:
				'Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.',
		})
	}

	const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1
	const columns = createGestantesColumns({
		onVerPerfil: (row) => navigate(`/gestantes/${row.id}`),
		onEditar: (row) => {
			setEmEdicao(row)
			setSheetOpen(true)
		},
	})

	return (
		<>
			<Page
				title="Gestantes"
				description="Gerencie as gestantes cadastradas no sistema."
				withButton
				buttonText="Criar gestante"
				buttonProps={{
					onClick: () => {
						setEmEdicao(undefined)
						setSheetOpen(true)
					},
				}}
			>
				<div className="flex flex-col gap-8">
					<div className="flex items-end gap-3">
						<Input
							placeholder="Buscar por nome, CPF ou CNS..."
							value={termo}
							onChange={(event) => setTermo(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') buscar()
							}}
							className="flex-1"
						/>
						<Button onClick={buscar}>Buscar</Button>
						<Button
							variant="outline"
							className="font-bold text-n-600"
							onClick={() => setFiltersOpen(true)}
						>
							Filtros{filterCount > 0 ? ` (${filterCount})` : ''}
						</Button>
					</div>

					{isError ? (
						<div role="alert" className="space-y-3">
							Não foi possível carregar as gestantes.{' '}
							<Button
								variant="outline"
								onClick={() => void refetch()}
							>
								Tentar novamente
							</Button>
						</div>
					) : (
						<DataTable
							columns={columns}
							data={data?.items}
							isLoading={isLoading}
							emptyStateTitle="Nenhuma gestante encontrada."
							emptyStateDescription={
								filterCount || busca
									? 'Nenhuma gestante corresponde à busca e aos filtros selecionados. Tente ajustar os critérios.'
									: 'Cadastre uma gestante para começar.'
							}
						/>
					)}

					{data && !isError ? (
						<div className="flex justify-center pt-4">
							<Pagination
								page={page}
								totalPages={totalPages}
								onPageChange={(next) => void setPage(next)}
							/>
						</div>
					) : null}
				</div>
			</Page>

			<GestanteSheet
				gestante={emEdicao}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onSubmit={handleSubmit}
				isSubmitting={criar.isPending || atualizar.isPending}
			/>
			{filtersOpen && (
				<GestantesFiltersSheet
					value={filters}
					onClose={() => setFiltersOpen(false)}
					onApply={(next) => {
						setFilters(next)
						void setPage(1)
					}}
				/>
			)}
		</>
	)
}
