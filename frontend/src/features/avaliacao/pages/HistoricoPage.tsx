import type { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Page } from '@/components/Layout/Page'
import { formatarDataBr } from '@/features/core/utils/date'
import { type HistoricoAplicacao, HISTORICO } from '@/features/avaliacao/utils/avaliacaoMock'
import { VULNERABILIDADE_BADGE_VARIANT, VULNERABILIDADE_LABEL } from '@/features/gestantes/constants/vulnerabilidade'
import type { Vulnerabilidade } from '@/features/gestantes/types/gestante'

const columns: ColumnDef<HistoricoAplicacao>[] = [
	{
		accessorKey: 'gestante',
		header: 'Gestante',
		cell: ({ getValue }) => <span className="font-medium text-n-700">{getValue() as string}</span>,
	},
	{
		accessorKey: 'data',
		header: 'Data da aplicação',
		cell: ({ getValue }) => formatarDataBr(getValue() as string),
	},
	{
		accessorKey: 'vulnerabilidade',
		header: 'Vulnerabilidade',
		cell: ({ getValue }) => {
			const vulnerabilidade = getValue() as Vulnerabilidade
			return <Badge variant={VULNERABILIDADE_BADGE_VARIANT[vulnerabilidade]}>{VULNERABILIDADE_LABEL[vulnerabilidade]}</Badge>
		},
	},
	{
		accessorKey: 'aplicadoPor',
		header: 'Aplicado por',
	},
]

export function HistoricoPage() {
	const navigate = useNavigate()

	return (
		<Page title="Histórico" description="Aplicações da Escala já realizadas.">
			<DataTable
				columns={columns}
				data={HISTORICO}
				emptyStateTitle="Nenhuma aplicação registrada."
				emptyStateDescription="As aplicações da escala aparecerão aqui."
				onRowClick={(row) => navigate(`/historico/${row.id}`)}
			/>
		</Page>
	)
}
