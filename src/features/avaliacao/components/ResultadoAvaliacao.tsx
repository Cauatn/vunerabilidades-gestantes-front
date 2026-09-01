import {
	CLASSIFICACAO_COR_BORDA,
	CLASSIFICACAO_COR_TEXTO,
	CLASSIFICACAO_LABEL,
	RECOMENDACOES,
	type Classificacao,
} from '@/features/avaliacao/constants'
import { cn } from '@/lib/utils'
import { ScoreMeter } from './ScoreMeter'

interface ResultadoAvaliacaoProps {
	nomeGestante: string
	pontuacao: number
	classificacao: Classificacao
	className?: string
}

export function ResultadoAvaliacao({ nomeGestante, pontuacao, classificacao, className }: ResultadoAvaliacaoProps) {
	const cor = CLASSIFICACAO_COR_TEXTO[classificacao]

	return (
		<div className={cn('flex w-full flex-col items-center gap-10', className)}>
			<div className="flex flex-col items-center gap-3">
				<div className={cn('flex size-[191px] shrink-0 items-center justify-center rounded-full border-4', CLASSIFICACAO_COR_BORDA[classificacao])}>
					<div className="flex flex-col items-center gap-1 px-2 text-center">
						<span className={cn('text-5xl font-bold', cor)}>{pontuacao}</span>
						<span className="max-w-[151px] text-caption font-semibold text-n-500">
							Pontuação na escala de vulnerabilidade
						</span>
					</div>
				</div>

				<p className="max-w-[534px] text-center text-sm text-n-900">
					Com base nas respostas do formulário, a gestante <span className="font-semibold">{nomeGestante}</span>{' '}
					foi categorizada como vulnerabilidade{' '}
					<span className={cn('font-semibold', cor)}>{CLASSIFICACAO_LABEL[classificacao]}</span>.
				</p>

				<ScoreMeter pontuacao={pontuacao} classificacao={classificacao} />
			</div>

			<div className="max-w-[534px] text-center text-sm text-n-900">
				<p>Com base no resultado da avaliação, considere as seguintes ações:</p>
				<ul className="mt-2 list-disc space-y-1 text-left">
					{RECOMENDACOES.map((recomendacao) => (
						<li key={recomendacao.id} className="ms-[21px] text-n-700">
							{recomendacao.texto}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
