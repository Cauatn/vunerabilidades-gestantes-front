import { useNavigate, useParams } from 'react-router-dom'

import { GestantesShell } from '@/features/gestantes/components/GestantesShell'
import { AvaliacoesTimeline } from '@/features/gestantes/components/AvaliacoesTimeline'
import { DadosPessoaisCard } from '@/features/gestantes/components/DadosPessoaisCard'
import { SectionDivider } from '@/features/gestantes/components/SectionDivider'
import { useGetGestante } from '@/features/gestantes/composables/useGetGestante'
import { useGetHistoricoGestante } from '@/features/avaliacao/composables/useGetHistoricoGestante'
import { atendimentoParaTimeline } from '@/features/gestantes/utils/atendimentoParaTimeline'

export function GestantesPerfilPage() {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const { data } = useGetGestante(id)
	const { data: historico } = useGetHistoricoGestante(id)

	const itens = (historico?.assessments.items ?? []).map(atendimentoParaTimeline)

	return (
		<GestantesShell
			title={data ? `Perfil de ${data.name}` : 'Perfil'}
			subtitle={
				data ? `Acesse os dados e o histórico de aplicações da gestante ${data.name}.` : 'Carregando…'
			}
			action={{ label: 'Imprimir', onClick: () => navigate(`/gestantes/${id}/imprimir`) }}
		>
			<div className="flex flex-col gap-4">
				<section className="flex flex-col gap-3">
					<SectionDivider label="Dados pessoais" />
					{data ? <DadosPessoaisCard gestante={data} /> : null}
				</section>

				<section className="flex flex-col gap-3">
					<SectionDivider label="Histórico de avaliações" />
					{itens.length > 0 ? (
						<AvaliacoesTimeline items={itens} />
					) : (
						<p className="text-sm text-n-500">Nenhuma avaliação registrada para esta gestante.</p>
					)}
				</section>
			</div>
		</GestantesShell>
	)
}
