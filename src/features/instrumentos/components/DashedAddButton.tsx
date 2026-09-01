import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

interface DashedAddButtonProps {
	label: string
	onClick: () => void
	tone?: 'teal' | 'orange'
	className?: string
}

export function DashedAddButton({ label, onClick, tone = 'teal', className }: DashedAddButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'flex w-full items-center justify-center gap-1 rounded-xl border-2 border-dashed py-3 text-sm font-semibold tracking-[0.1px] transition-colors',
				tone === 'orange'
					? 'border-(--color-o-400) text-o-400 hover:bg-o-100'
					: 'border-(--color-t-400) text-t-400 hover:bg-t-50',
				className,
			)}
		>
			<Plus className="size-5" />
			{label}
		</button>
	)
}
