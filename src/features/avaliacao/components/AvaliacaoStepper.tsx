import { Fragment } from 'react'

import { cn } from '@/lib/utils'

interface AvaliacaoStepperProps {
	steps: string[]
	activeIndex: number
	className?: string
}

export function AvaliacaoStepper({ steps, activeIndex, className }: AvaliacaoStepperProps) {
	function segmentoPreenchido(indice: number) {
		return indice === 0 || indice <= activeIndex
	}

	return (
		<div className={cn('flex flex-col gap-0.5', className)}>
			<div className="flex items-center py-px">
				{steps.map((_, indice) => (
					<Fragment key={indice}>
						<div className={cn('h-px flex-1', segmentoPreenchido(indice) ? 'bg-t-400' : 'bg-n-30')} />
						<div
							className={cn(
								'flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] text-sm font-semibold',
								indice < activeIndex && 'border-(--t-400) bg-t-400 text-white',
								indice === activeIndex && 'border-solid border-(--t-400) text-t-400',
								indice > activeIndex && 'border-dashed border-(--t-400) text-t-400',
							)}
						>
							{indice + 1}
						</div>
					</Fragment>
				))}
				<div className={cn('h-px flex-1', segmentoPreenchido(steps.length) ? 'bg-t-400' : 'bg-n-30')} />
			</div>

			<div className="flex w-full text-center text-caption text-n-600">
				{steps.map((label, indice) => (
					<p key={indice} className="flex-1 px-1">
						{label}
					</p>
				))}
			</div>
		</div>
	)
}
