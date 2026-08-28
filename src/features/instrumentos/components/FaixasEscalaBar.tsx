import type { GrauConfig } from '../types/escala'

interface FaixasEscalaBarProps {
	graus: GrauConfig[]
	min: number
	max: number
}

/** trilhas horizontais (uma por grau) com a faixa preenchida na posição proporcional */
export function FaixasEscalaBar({ graus, min, max }: FaixasEscalaBarProps) {
	const span = Math.max(1, max - min)
	const clamp = (n: number) => Math.min(100, Math.max(0, n))

	return (
		<div className="flex gap-2.5">
			<div className="flex flex-col gap-3">
				{graus.map((g) => (
					<span key={g.id} className="flex h-4 items-center text-sm text-n-900">
						{g.nome}
					</span>
				))}
			</div>
			<div className="flex flex-1 flex-col gap-3">
				<div className="flex flex-col gap-3">
					{graus.map((g) => {
						const left = clamp(((g.min - min) / span) * 100)
						const width = clamp(((Math.max(g.max, g.min) - g.min) / span) * 100)
						return (
							<div
								key={g.id}
								className="relative h-4 w-full overflow-hidden rounded bg-n-30"
							>
								<div
									className="absolute inset-y-0 rounded"
									style={{ left: `${left}%`, width: `${width}%`, background: g.cor }}
								/>
							</div>
						)
					})}
				</div>
				<div className="flex justify-between text-[11px] text-n-600">
					<span>{min}</span>
					<span>{Math.round(min + span / 3)}</span>
					<span>{Math.round(min + (span * 2) / 3)}</span>
					<span>{max}</span>
				</div>
			</div>
		</div>
	)
}
