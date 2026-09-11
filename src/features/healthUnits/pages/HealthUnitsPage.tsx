import { useState } from 'react'

import { Page } from '@/components/Layout/Page'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { apiErrorMessage } from '@/features/core/utils/apiError'
import { Modal } from '@/features/core/components/Modal'
import { HealthUnitSheet } from '@/features/healthUnits/components/HealthUnitSheet'
import { createHealthUnitsColumns } from '@/features/healthUnits/components/healthUnitsDataTable/columns'
import { useCreateHealthUnit } from '@/features/healthUnits/composables/useCreateHealthUnit'
import { useGetHealthUnits } from '@/features/healthUnits/composables/useGetHealthUnits'
import { useUpdateHealthUnit } from '@/features/healthUnits/composables/useUpdateHealthUnit'
import type { CreateHealthUnitPayload, HealthUnit } from '@/features/healthUnits/types/healthUnit'

export function HealthUnitsPage() {
	const { data, isLoading, page, setPage, busca, setBusca } = useGetHealthUnits()

	const [searchTerm, setSearchTerm] = useState(busca)
	const [editingUnit, setEditingUnit] = useState<HealthUnit | undefined>(undefined)
	const [sheetOpen, setSheetOpen] = useState(false)
	const [deactivateTarget, setDeactivateTarget] = useState<HealthUnit | undefined>(undefined)

	const create = useCreateHealthUnit({ onSuccess: () => setSheetOpen(false) })
	const update = useUpdateHealthUnit({ onSuccess: () => setSheetOpen(false) })

	function search() {
		void setBusca(searchTerm.trim())
		void setPage(1)
	}

	function handleSubmit(payload: CreateHealthUnitPayload) {
		if (editingUnit) {
			update.mutate({
				id: editingUnit.id,
				payload: {
					name: payload.name,
					city: payload.city,
					state: payload.state,
					address: payload.address ?? null,
				},
			})
		} else {
			create.mutate(payload)
		}
	}

	function handleToggleStatus(healthUnit: HealthUnit) {
		if (healthUnit.active) {
			setDeactivateTarget(healthUnit)
			return
		}
		update.mutate({ id: healthUnit.id, payload: { active: true } })
	}

	const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1
	const columns = createHealthUnitsColumns({
		onEdit: (row) => {
			setEditingUnit(row)
			setSheetOpen(true)
		},
		onToggleStatus: handleToggleStatus,
	})

	return (
		<>
			<Page
				title="Unidades de saúde"
				description="Gerencie as UBS disponíveis para os atendimentos."
				withButton
				buttonText="Cadastrar UBS"
				buttonProps={{
					onClick: () => {
						setEditingUnit(undefined)
						setSheetOpen(true)
					},
				}}
			>
				<div className="flex flex-col gap-8">
					{create.isError ? (
						<p className="rounded-md bg-r-100 px-4 py-3 text-sm text-r-500">
							{apiErrorMessage(create.error, 'Não foi possível cadastrar a UBS.')}
						</p>
					) : null}
					{update.isError ? (
						<p className="rounded-md bg-r-100 px-4 py-3 text-sm text-r-500">
							{apiErrorMessage(update.error, 'Não foi possível atualizar a UBS.')}
						</p>
					) : null}

					<div className="flex items-center gap-3">
						<Input
							placeholder="Buscar por nome..."
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
						emptyStateTitle="Nenhuma UBS encontrada."
						emptyStateDescription="Cadastre uma UBS para disponibilizá-la nos atendimentos."
					/>

					{data ? (
						<div className="flex justify-center pt-4">
							<Pagination page={page} totalPages={totalPages} onPageChange={(next) => void setPage(next)} />
						</div>
					) : null}
				</div>
			</Page>

			<HealthUnitSheet
				healthUnit={editingUnit}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onSubmit={handleSubmit}
				isSubmitting={create.isPending || update.isPending}
			/>

			<Modal
				open={!!deactivateTarget}
				onOpenChange={(open) => !open && setDeactivateTarget(undefined)}
				variant="warning"
				title="Desativar UBS"
				description="Ao desativar, esta UBS deixa de ser oferecida em novos atendimentos. Atendimentos já registrados continuam apontando para ela normalmente."
				confirmLabel="Desativar"
				onConfirm={() => {
					if (!deactivateTarget) return
					update.mutate({ id: deactivateTarget.id, payload: { active: false } })
					setDeactivateTarget(undefined)
				}}
			/>
		</>
	)
}
