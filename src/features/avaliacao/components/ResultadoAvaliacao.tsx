import type { VulnerabilityBand } from '@/features/instrumentos/types/scale'
import { cn } from '@/lib/utils'
import { ScoreMeter } from './ScoreMeter'
import { scaleColor } from '@/features/core/utils/color'

interface ResultadoAvaliacaoProps {
	nomeGestante: string
	pontuacao: number
	vulnerabilityLevel: string
	vulnerabilityBandId: string
	bands: VulnerabilityBand[]
	className?: string
}

export function ResultadoAvaliacao({
	nomeGestante,
	pontuacao,
	vulnerabilityLevel,
	vulnerabilityBandId,
	bands,
	className,
}: ResultadoAvaliacaoProps) {
	const bandaAtiva = bands.find((band) => band.id === vulnerabilityBandId)

	return (
		<div
			className={cn(
				'flex w-full flex-col items-center gap-10',
				className,
			)}
		>
			<div className="flex flex-col items-center gap-3">
				<div
					className="flex size-47.75 shrink-0 items-center justify-center rounded-full border-4"
					style={{ borderColor: scaleColor(bandaAtiva?.color) }}
				>
					<div className="flex flex-col items-center gap-1 px-2 text-center">
						<span
							className="text-5xl font-bold"
							style={{ color: scaleColor(bandaAtiva?.color) }}
						>
							{pontuacao}
						</span>
						<span className="max-w-37.75 text-caption font-semibold text-n-500">
							Pontuação na escala de vulnerabilidade
						</span>
					</div>
				</div>

				<p className="max-w-133.5 text-center text-sm text-n-900">
					Com base nas respostas do formulário, a gestante{' '}
					<span className="font-semibold">{nomeGestante}</span> foi
					categorizada como vulnerabilidade{' '}
					<span
						className="font-semibold"
						style={{ color: scaleColor(bandaAtiva?.color) }}
					>
						{vulnerabilityLevel}
					</span>
					.
				</p>

				<ScoreMeter
					pontuacao={pontuacao}
					bands={bands}
					activeBandId={vulnerabilityBandId}
				/>
			</div>
		</div>
	)
}
