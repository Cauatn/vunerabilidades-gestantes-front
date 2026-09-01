import { FileText } from 'lucide-react'

import { cn } from '@/lib/utils'
import { VulnerabilidadeBadge } from '@/features/gestantes/components/VulnerabilidadeBadge'
import type { AvaliacaoTimelineItem, Vulnerabilidade } from '@/features/gestantes/data/mock'

const ringColor: Record<Vulnerabilidade, string> = {
	baixa: 'border-(--color-g-400) text-g-400',
	media: 'border-(--color-y-400) text-y-400',
	moderada: 'border-(--color-y-400) text-y-400',
	alta: 'border-(--color-r-500) text-r-500',
}

const badgeLabel: Record<Vulnerabilidade, string> = {
	baixa: 'Vulnerabilidade baixa',
	media: 'Vulnerabilidade média',
	moderada: 'Vulnerabilidade moderada',
	alta: 'Vulnerabilidade alta',
}

type Props = {
	items: AvaliacaoTimelineItem[]
	onViewDetails?: (assessmentId: string) => void
}

export function AvaliacoesTimeline({ items, onViewDetails }: Props) {
	return (
		<div className="flex w-full max-w-[731px] flex-col">
			{items.map((item, index) => {
				const isLast = index === items.length - 1

				return (
					<div key={item.id} className="flex gap-2.5 p-2">
						<p className="w-[70px] shrink-0 pt-0.5 text-[11px] leading-6 text-n-600">{item.data}</p>

						<div className="flex flex-col items-center gap-2 self-stretch">
							<span
								className={cn(
									'flex items-center rounded-full border p-1',
									ringColor[item.vulnerabilidade],
								)}
							>
								<FileText className="size-4" />
							</span>
							{!isLast ? <span className="w-px flex-1 bg-n-40" /> : null}
						</div>

						<div className="flex flex-1 flex-col gap-1 pb-4">
							<p className="text-sm font-semibold leading-6 text-n-900">{item.titulo}</p>
							<VulnerabilidadeBadge
								vulnerabilidade={item.vulnerabilidade}
								withIcon
								label={badgeLabel[item.vulnerabilidade]}
								className="self-start"
							/>
							<p className="text-[11px] leading-6 text-n-600">{item.descricao}</p>
							<button type="button" onClick={() => onViewDetails?.(item.id)} className="text-left text-[11px] leading-6 text-b-400 underline">
								Ver detalhamento da aplicação
							</button>
						</div>
					</div>
				)
			})}
		</div>
	)
}
