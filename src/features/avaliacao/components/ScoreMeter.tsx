import { ChevronDown } from 'lucide-react'

import type { VulnerabilityBand } from '@/features/instrumentos/types/scale'
import { cn } from '@/lib/utils'

interface ScoreMeterProps {
	pontuacao: number
	bands: VulnerabilityBand[]
	activeBandId: string
}

export function ScoreMeter({
	pontuacao,
	bands,
	activeBandId,
}: ScoreMeterProps) {
	const bandsOrdenadas = [...bands].sort((a, b) => a.minScore - b.minScore)
	if (bandsOrdenadas.length === 0) return null

	const min = bandsOrdenadas[0].minScore
	const max = bandsOrdenadas[bandsOrdenadas.length - 1].maxScore
	const total = Math.max(1, max - min)

	const posicaoIndicador = `${Math.max(2, Math.min(98, ((pontuacao - min) / total) * 100))}%`
	const marcadores = [min, ...bandsOrdenadas.map((band) => band.maxScore)]
	const bandaAtiva = bandsOrdenadas.find((band) => band.id === activeBandId)

	return (
		<div className="flex w-full max-w-157.5 flex-col items-center gap-0.5">
			<div className="flex w-full flex-col items-start px-6">
				<div
					className="flex -translate-x-1/2 flex-col items-center"
					style={{ marginLeft: posicaoIndicador }}
				>
					<span
						className="text-[11px] leading-5 font-semibold"
						style={{ color: bandaAtiva?.color }}
					>
						{bandaAtiva?.level ?? ''}
					</span>
					<ChevronDown
						className="size-4"
						style={{ color: bandaAtiva?.color }}
					/>
				</div>
			</div>

			<div className="flex h-4 w-full items-end gap-0.5">
				{bandsOrdenadas.map((band) => (
					<div
						key={band.id}
						className="h-full flex-1 rounded-sm"
						style={{
							background: band.color,
							opacity: band.id === activeBandId ? 1 : 0.35,
						}}
					/>
				))}
			</div>

			<div className="flex w-full items-center justify-between text-caption">
				<span className="text-n-700">{marcadores[0]}</span>
				{bandsOrdenadas.map((band, index) => (
					<span key={band.id} className="contents">
						<span
							className={cn(
								'font-normal',
								band.id === activeBandId && 'font-semibold',
							)}
							style={{ color: band.color }}
						>
							{band.level}
						</span>
						<span className="text-n-700">
							{marcadores[index + 1]}
						</span>
					</span>
				))}
			</div>
		</div>
	)
}
