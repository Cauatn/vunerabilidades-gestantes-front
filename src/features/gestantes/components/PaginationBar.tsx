import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const pages = [1, 2, 3, 4, 5]

type Props = {
	current?: number
}

export function PaginationBar({ current = 1 }: Props) {
	return (
		<div className="flex items-center gap-2">
			<div className="flex items-center gap-2 pr-1">
				<StepButton label="Primeira página">
					<ChevronsLeft className="size-5" />
				</StepButton>
				<StepButton label="Página anterior">
					<ChevronLeft className="size-4" />
				</StepButton>
			</div>

			{pages.map((page) => (
				<button
					key={page}
					type="button"
					aria-current={page === current ? 'page' : undefined}
					className={cn(
						'flex size-[38px] items-center justify-center rounded-[4px] text-sm font-semibold tracking-[0.1px]',
						page === current
							? 'bg-t-400 text-n-10'
							: 'border border-n-40 bg-n-0 text-n-500',
					)}
				>
					{page}
				</button>
			))}

			<div className="flex items-center gap-2 pl-1">
				<StepButton label="Próxima página">
					<ChevronRight className="size-4" />
				</StepButton>
				<StepButton label="Última página">
					<ChevronsRight className="size-5" />
				</StepButton>
			</div>
		</div>
	)
}

function StepButton({ label, children }: { label: string; children: ReactNode }) {
	return (
		<button
			type="button"
			aria-label={label}
			className="flex size-[38px] items-center justify-center rounded-[4px] border border-n-40 bg-n-0 text-n-500"
		>
			{children}
		</button>
	)
}
