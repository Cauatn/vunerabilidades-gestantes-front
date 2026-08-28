import { useParams } from 'react-router-dom'

import { AvaliacoesTimeline } from '@/features/gestantes/components/AvaliacoesTimeline'
import { DadosPessoaisCard } from '@/features/gestantes/components/DadosPessoaisCard'
import { SectionDivider } from '@/features/gestantes/components/SectionDivider'
import { useGetGestante } from '@/features/gestantes/composables/useGetGestante'
import { avaliacoesMock } from '@/features/gestantes/data/mock'

export function GestantesImprimirPage() {
	const { id } = useParams<{ id: string }>()
	const { data } = useGetGestante(id)

	return (
		<div className="min-h-screen bg-n-0 text-n-800">
			<div className="mx-auto flex max-w-[1440px] flex-col px-10 py-10">
				<p className="text-center text-5xl font-bold text-black">Pré-Natal</p>

				<h1 className="mt-24 text-[44px] leading-[44px] font-semibold tracking-[0.15px] text-n-800">
					{data ? `Perfil de ${data.name}` : 'Perfil'}
				</h1>

				<div className="mt-14 flex flex-col gap-4">
					<section className="flex flex-col gap-3">
						<SectionDivider label="Dados pessoais" />
						{data ? <DadosPessoaisCard gestante={data} /> : null}
					</section>

					<section className="flex flex-col gap-3">
						<SectionDivider label="Histórico de avaliações" />
						<AvaliacoesTimeline items={avaliacoesMock} />
					</section>
				</div>

				<footer className="mt-16 flex justify-end">
					<p className="text-right text-xs leading-6 text-n-600">Documento gerado pelo sistema Pré-Natal.</p>
				</footer>
			</div>
		</div>
	)
}
