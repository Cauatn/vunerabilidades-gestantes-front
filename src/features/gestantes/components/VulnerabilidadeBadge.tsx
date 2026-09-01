import { ChevronDown, ChevronUp, Equal } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { Vulnerabilidade } from '@/features/gestantes/data/mock'

const config: Record<
	Vulnerabilidade,
	{ label: string; wrapper: string; icon: typeof ChevronDown | null }
> = {
	baixa: { label: 'Baixa', wrapper: 'bg-g-100 text-g-600', icon: null },
	media: { label: 'Média', wrapper: 'bg-y-100 text-y-600', icon: Equal },
	moderada: { label: 'Moderada', wrapper: 'bg-y-100 text-y-600', icon: null },
	alta: { label: 'Alta', wrapper: 'bg-r-100 text-r-600', icon: null },
}

type Props = {
	vulnerabilidade: Vulnerabilidade
	/** show the leading trend icon (used inside the timeline) */
	withIcon?: boolean
	/** override the label text, e.g. "Vulnerabilidade baixa" */
	label?: string
	className?: string
}

export function VulnerabilidadeBadge({ vulnerabilidade, withIcon, label, className }: Props) {
	const { label: defaultLabel, wrapper, icon } = config[vulnerabilidade]
	const Icon = withIcon ? getTrendIcon(vulnerabilidade) ?? icon : null

	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap',
				wrapper,
				className,
			)}
		>
			{Icon ? <Icon className="size-4" /> : null}
			{label ?? defaultLabel}
		</span>
	)
}

function getTrendIcon(vulnerabilidade: Vulnerabilidade) {
	if (vulnerabilidade === 'alta') return ChevronUp
	if (vulnerabilidade === 'media' || vulnerabilidade === 'moderada') return Equal
	return ChevronDown
}
