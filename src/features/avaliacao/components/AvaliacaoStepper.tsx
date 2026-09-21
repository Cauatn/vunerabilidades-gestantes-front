import { cn } from '@/lib/utils'

interface AvaliacaoStepperProps {
	steps: string[]
	activeIndex: number
	className?: string
}

export function AvaliacaoStepper({
	steps,
	activeIndex,
	className,
}: AvaliacaoStepperProps) {
	return (
		<div className={cn('flex flex-col gap-0.5', className)}>
			{/* Números e linha */}
			<div
				className="grid w-full grid-cols-[repeat(var(--steps),minmax(0,1fr))] items-center"
				style={{ '--steps': steps.length } as React.CSSProperties}
			>
				{steps.map((_, indice) => (
					<div
						key={indice}
						className="relative flex items-center justify-center"
					>
						{/* Linha para a esquerda */}
						{indice > 0 && (
							<div
								className={cn(
									'absolute right-1/2 top-1/2 h-px w-full -translate-y-1/2',
									indice <= activeIndex
										? 'bg-t-400'
										: 'bg-n-30',
								)}
							/>
						)}

						{/* Linha para a direita do último passo */}
						{indice === steps.length - 1 && (
							<div
								className={cn(
									'absolute left-1/2 top-1/2 h-px w-full -translate-y-1/2',
									activeIndex >= steps.length - 1
										? 'bg-t-400'
										: 'bg-n-30',
								)}
							/>
						)}

						{/* Linha antes do primeiro passo */}
						{indice === 0 && (
							<div
								className={cn(
									'absolute right-1/2 top-1/2 h-px w-1/2 -translate-y-1/2',
									'bg-t-400',
								)}
							/>
						)}

						{/* Número */}
						<div
							className={cn(
								'relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-[1.5px] bg-white text-sm font-semibold',
								indice < activeIndex &&
									'border-(--t-400) bg-t-400 text-white',
								indice === activeIndex &&
									'border-solid border-(--t-400) text-t-400',
								indice > activeIndex &&
									'border-dashed border-(--t-400) text-t-400',
							)}
						>
							{indice + 1}
						</div>
					</div>
				))}
			</div>

			{/* Textos */}
			<div
				className="grid w-full grid-cols-[repeat(var(--steps),minmax(0,1fr))] text-center text-caption text-n-600"
				style={{ '--steps': steps.length } as React.CSSProperties}
			>
				{steps.map((label, indice) => (
					<p key={indice} className="px-1">
						{label}
					</p>
				))}
			</div>
		</div>
	)
}
