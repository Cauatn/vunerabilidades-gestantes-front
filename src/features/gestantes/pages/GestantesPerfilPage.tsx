import { useNavigate, useParams } from 'react-router-dom'

import { GestantesShell } from '@/features/gestantes/components/GestantesShell'
import { AvaliacoesTimeline } from '@/features/gestantes/components/AvaliacoesTimeline'
import { DadosPessoaisCard } from '@/features/gestantes/components/DadosPessoaisCard'
import { SectionDivider } from '@/features/gestantes/components/SectionDivider'
import { useGetGestante } from '@/features/gestantes/composables/useGetGestante'
import { avaliacoesMock } from '@/features/gestantes/data/mock'

export function GestantesPerfilPage() {
	const navigate = useNavigate()
	const { id } = useParams<{ id: string }>()
	const { data } = useGetGestante(id)

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
					<AvaliacoesTimeline items={avaliacoesMock} />
				</section>
			</div>
		</GestantesShell>
	)
}
