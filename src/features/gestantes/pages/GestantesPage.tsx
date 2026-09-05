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
import type { CreateGestantePayload, Gestante } from '@/features/gestantes/types/gestante'
import { apiErrorMessage } from '@/features/core/utils/apiError'

export function GestantesPage() {
	const navigate = useNavigate()
	const { data, page, setPage, busca, setBusca } = useGetGestantes()

	const [termo, setTermo] = useState(busca)
	const [emEdicao, setEmEdicao] = useState<Gestante | undefined>(undefined)
	const [sheetOpen, setSheetOpen] = useState(false)

	const criar = useCreateGestante({ onSuccess: () => setSheetOpen(false) })
	const atualizar = useUpdateGestante({ onSuccess: () => setSheetOpen(false) })

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
				},
			})
		} else {
			criar.mutate(payload)
		}
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
					{criar.isError ? <p className="rounded-md bg-r-100 px-4 py-3 text-sm text-r-500">{apiErrorMessage(criar.error, 'Não foi possível cadastrar a gestante.')}</p> : null}
					<div className="flex items-end gap-3">
						{/* //TODO: espaçar verticalmente esse input da tabela */}
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
						<Button variant="outline" className="font-bold text-n-600">
							Filtros
						</Button>
					</div>

					<DataTable
						columns={columns}
						data={data?.items}
						emptyStateTitle="Nenhuma gestante encontrada."
						emptyStateDescription="Cadastre uma gestante para começar."
					/>

					{data ? (
						<div className="flex justify-center pt-4">
							<Pagination page={page} totalPages={totalPages} onPageChange={(next) => void setPage(next)} />
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
		</>
	)
}
