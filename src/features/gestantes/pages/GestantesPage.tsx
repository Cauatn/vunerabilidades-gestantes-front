import { useState } from 'react'

import { Page } from '@/components/Layout/Page'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { GestanteSheet } from '@/features/gestantes/components/GestanteSheet'
import { createGestantesColumns } from '@/features/gestantes/components/gestantesDataTable/columns'
import {
	useCreateGestante,
	useGestantesListagem,
	useUpdateGestante,
} from '@/features/gestantes/composables/useGestantes'
import type { CreateGestantePayload, Gestante } from '@/features/gestantes/types/gestante'

export function GestantesPage() {
	const { data, isLoading, page, setPage, busca, setBusca } = useGestantesListagem()

	const [termoBusca, setTermoBusca] = useState(busca ?? '')
	const [gestanteEmEdicao, setGestanteEmEdicao] = useState<Gestante | undefined>(undefined)
	const [sheetOpen, setSheetOpen] = useState(false)

	const criar = useCreateGestante({ onSuccess: () => setSheetOpen(false) })
	const atualizar = useUpdateGestante({ onSuccess: () => setSheetOpen(false) })

	function aplicarBusca() {
		void setBusca(termoBusca.trim() || null)
		void setPage(1)
	}

	function abrirCriacao() {
		setGestanteEmEdicao(undefined)
		setSheetOpen(true)
	}

	function handleSubmit(payload: CreateGestantePayload) {
		if (gestanteEmEdicao) {
			atualizar.mutate({ id: gestanteEmEdicao.id, payload })
		} else {
			criar.mutate(payload)
		}
	}

	const columns = createGestantesColumns({
		onEdit: (gestante) => {
			setGestanteEmEdicao(gestante)
			setSheetOpen(true)
		},
		onVerDetalhes: (gestante) => {
			setGestanteEmEdicao(gestante)
			setSheetOpen(true)
		},
	})

	return (
		<>
			<Page
				title="Gestantes"
				description="Cadastro das gestantes acompanhadas — usado apenas para consulta de dados."
				withButton
				buttonText="Criar gestante"
				buttonProps={{ onClick: abrirCriacao }}
			>
				<div className="flex items-center gap-3">
					<Input
						placeholder="Buscar por nome, CPF ou CNS..."
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
					emptyStateTitle="Nenhuma gestante encontrada."
					emptyStateDescription="Cadastre gestantes para poder acompanhá-las."
				/>

				<Pagination
					page={page}
					totalPages={data?.meta.totalPages ?? 1}
					onPageChange={(next) => void setPage(next)}
				/>
			</Page>

			<GestanteSheet
				gestante={gestanteEmEdicao}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				onSubmit={handleSubmit}
				isSubmitting={criar.isPending || atualizar.isPending}
			/>
		</>
	)
}
