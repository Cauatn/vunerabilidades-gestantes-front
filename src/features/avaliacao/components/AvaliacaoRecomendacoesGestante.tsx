import type { RecomendacaoGestante } from '@/features/avaliacao/types/historico'

interface AvaliacaoRecomendacoesGestanteProps {
	recomendacoes: RecomendacaoGestante[]
}

export function AvaliacaoRecomendacoesGestante({ recomendacoes }: AvaliacaoRecomendacoesGestanteProps) {
	return (
		<div className="flex w-full flex-col gap-3">
			{recomendacoes.map((recomendacao, index) => (
				<div key={recomendacao.id} className="flex w-full items-center gap-5 rounded-xl border border-n-50 px-8 py-7">
					<p className="text-[28px] font-bold text-p-400">{index + 1}.</p>
					<div className="grid flex-1 grid-cols-3 gap-5 px-6">
						<div className="col-span-1 flex flex-col gap-3">
							<p className="text-xl font-semibold text-n-700">Recomendação</p>
							<p className="text-base text-n-700">{recomendacao.titulo}</p>
						</div>
						<div className="col-span-2 flex flex-col gap-3">
							<p className="text-xl font-semibold text-n-700">Observações</p>
							<p className="text-caption text-n-600">{recomendacao.observacoes}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}
