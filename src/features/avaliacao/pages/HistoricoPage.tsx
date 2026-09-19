import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { PAGE_SIZE } from '@/features/core/constants/pagination'
import { HistoricoFiltersSheet } from '@/features/avaliacao/components/HistoricoFiltersSheet'
import {
	activeFilterCount,
	assessmentFilterParams,
} from '@/features/shared/types/listFilters'
import { Page } from '@/components/Layout/Page'
import { DataTable } from '@/components/ui/data-table'
import { useAssessments } from '@/features/avaliacao/composables/useAssessments'
import { columns } from '../constants/tabelaHistoricoAvaliacoes'

import { useListFilters } from '@/features/shared/composables/useListFilters'

export function HistoricoPage() {
	const [filters, setFilters] = useListFilters()
	const [filtersOpen, setFiltersOpen] = useState(false)
	const [page, setPage] = useState(1)
	const [termo, setTermo] = useState('')
	const [busca, setBusca] = useState('')
	function buscar() {
		setBusca(termo.trim())
		setPage(1)
	}
	const {
		data: assessments,
		isLoading,
		isError,
		refetch,
	} = useAssessments({
		...assessmentFilterParams(filters),
		search: busca,
		page,
		pageSize: PAGE_SIZE,
	})
	const count = activeFilterCount(filters)

	return (
		<>
			<Page
				className="max-w-full p-4 sm:p-6 lg:p-10"
				title="Avaliações"
				description="Verifique o histórico de avaliações aplicadas."
			>
				<div className="flex min-w-0 max-w-full flex-col gap-8">
					<div className="flex flex-wrap items-end gap-3">
						<Input
							aria-label="Buscar avaliações por nome, CPF ou CNS da gestante"
							placeholder="Buscar por nome, CPF ou CNS..."
							value={termo}
							onChange={(event) => setTermo(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') buscar()
							}}
							className="min-w-0 flex-1 basis-full sm:basis-0"
						/>
						<Button onClick={buscar}>Buscar</Button>
						<Button
							variant="outline"
							className="font-bold text-n-600"
							onClick={() => setFiltersOpen(true)}
						>
							Filtros{count > 0 ? ` (${count})` : ''}
						</Button>
						{count > 0 && (
							<Button
								variant="ghost"
								onClick={() => {
									void setFilters(null)
									setPage(1)
								}}
							>
								Limpar filtros
							</Button>
						)}
					</div>
					{isError ? (
						<div role="alert" className="space-y-3">
							Não foi possível carregar as avaliações.{' '}
							<Button
								variant="outline"
								onClick={() => void refetch()}
							>
								Tentar novamente
							</Button>
						</div>
					) : (
						<DataTable
							scrollable
							columns={columns}
							data={assessments?.items}
							isLoading={isLoading}
							emptyStateTitle={
								count || busca
									? 'Nenhuma avaliação encontrada.'
									: 'Nenhuma aplicação registrada.'
							}
							emptyStateDescription={
								count || busca
									? 'Nenhuma avaliação corresponde aos filtros selecionados. Tente ajustar os critérios.'
									: 'As aplicações da escala aparecerão aqui.'
							}
						/>
					)}
					{assessments && !isError && (
						<div className="flex justify-center pt-4">
							<Pagination
								className="flex-wrap"
								page={page}
								totalPages={Math.max(
									1,
									Math.ceil(assessments.total / PAGE_SIZE),
								)}
								onPageChange={setPage}
							/>
						</div>
					)}
				</div>
			</Page>
			{filtersOpen && (
				<HistoricoFiltersSheet
					value={filters}
					onClose={() => setFiltersOpen(false)}
					onApply={(next) => {
						void setFilters(next)
						setPage(1)
					}}
				/>
			)}
		</>
	)
}
