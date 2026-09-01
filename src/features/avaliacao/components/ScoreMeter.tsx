import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Classificacao } from '@/features/avaliacao/constants'
import { CLASSIFICACAO_COR_BG, CLASSIFICACAO_COR_TEXTO, CLASSIFICACAO_LABEL } from '@/features/avaliacao/constants'

interface Faixa {
	classificacao: Classificacao
	min: number
	max: number
}

const FAIXAS: Faixa[] = [
	{ classificacao: 'BAIXA', min: 0, max: 3 },
	{ classificacao: 'MODERADA', min: 3, max: 8 },
	{ classificacao: 'ALTA', min: 8, max: 12 },
]

interface ScoreMeterProps {
	pontuacao: number
	classificacao: Classificacao
}

export function ScoreMeter({ pontuacao, classificacao }: ScoreMeterProps) {
	const min = FAIXAS[0].min
	const max = FAIXAS[FAIXAS.length - 1].max
	const total = max - min

	const posicaoIndicador = `${Math.max(2, Math.min(98, ((pontuacao - min) / total) * 100))}%`
	const marcadores = [min, ...FAIXAS.map((faixa) => faixa.max)]

	return (
		<div className="flex w-full max-w-[630px] flex-col items-center gap-0.5">
			<div className="flex w-full flex-col items-start px-6">
				<div className="flex -translate-x-1/2 flex-col items-center" style={{ marginLeft: posicaoIndicador }}>
					<span className={cn('text-[11px] leading-5 font-semibold', CLASSIFICACAO_COR_TEXTO[classificacao])}>
						{CLASSIFICACAO_LABEL[classificacao]}
					</span>
					<ChevronDown className={cn('size-4', CLASSIFICACAO_COR_TEXTO[classificacao])} />
				</div>
			</div>

			<div className="flex h-4 w-full items-end">
				{FAIXAS.map((faixa) => (
					<div
						key={faixa.classificacao}
						className={cn(
							'h-full flex-1',
							CLASSIFICACAO_COR_BG[faixa.classificacao],
							faixa.classificacao === 'BAIXA' && 'rounded-l-xl',
							faixa.classificacao === 'ALTA' && 'rounded-r-xl',
						)}
					/>
				))}
			</div>

			<div className="flex w-full items-center justify-between text-caption">
				<span className="text-n-700">{marcadores[0]}</span>
				{FAIXAS.map((faixa, index) => (
					<span key={faixa.classificacao} className="contents">
						<span className={cn('font-normal', CLASSIFICACAO_COR_TEXTO[faixa.classificacao])}>
							{CLASSIFICACAO_LABEL[faixa.classificacao]}
						</span>
						<span className="text-n-700">{marcadores[index + 1]}</span>
					</span>
				))}
			</div>
		</div>
	)
}
