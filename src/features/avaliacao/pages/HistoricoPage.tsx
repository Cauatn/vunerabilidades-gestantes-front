import type { ColumnDef } from '@tanstack/react-table'
import { useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'
import { Page } from '@/components/Layout/Page'
import { formatarDataBr } from '@/features/core/utils/date'
import { VULNERABILIDADE_BADGE_VARIANT, VULNERABILIDADE_LABEL } from '@/features/gestantes/constants/vulnerabilidade'
import type { Vulnerabilidade } from '@/features/gestantes/constants/vulnerabilidade'
import { useAssessmentsHistory } from '@/features/avaliacao/composables/useAssessments'
import { assessmentResult } from '@/features/avaliacao/services/assessments'

type HistoricoAplicacao = {
	id: string
	gestante: string
	data: string
	vulnerabilidade: Vulnerabilidade
	aplicadoPor: string
}

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
	const { data: assessments, isLoading } = useAssessmentsHistory()
	const historico: HistoricoAplicacao[] = (assessments ?? []).map((assessment) => {
		const result = assessmentResult(assessment.result)
		return {
			id: assessment.id,
			gestante: assessment.patientName,
			data: assessment.appliedAt,
			vulnerabilidade: toVulnerabilidade(result.vulnerabilityLevel ?? 'BAIXA'),
			aplicadoPor: '—',
		}
	})

	return (
		<Page title="Histórico" description="Aplicações da Escala já realizadas.">
			<DataTable
				columns={columns}
				data={historico}
				isLoading={isLoading}
				emptyStateTitle="Nenhuma aplicação registrada."
				emptyStateDescription="As aplicações da escala aparecerão aqui."
				onRowClick={(row) => navigate(`/historico/${row.id}`)}
			/>
		</Page>
	)
}

function toVulnerabilidade(level: string): Vulnerabilidade {
	const normalized = level.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
	if (normalized.includes('alta')) return 'alta'
	if (normalized.includes('moderada')) return 'moderada'
	if (normalized.includes('media')) return 'moderada'
	return 'baixa'
}
