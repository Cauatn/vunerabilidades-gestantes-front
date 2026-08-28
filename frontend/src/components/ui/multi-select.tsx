import { Check, ChevronDown, X } from 'lucide-react'
import * as React from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface MultiSelectProps {
	options: string[]
	value: string[]
	onValueChange: (value: string[]) => void
	placeholder?: string
	className?: string
	id?: string
}

export function MultiSelect({ options, value, onValueChange, placeholder = 'Selecione', className, id }: MultiSelectProps) {
	const [open, setOpen] = React.useState(false)

	function toggle(option: string) {
		onValueChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])
	}

	function remove(option: string, event: React.MouseEvent) {
		event.stopPropagation()
		onValueChange(value.filter((item) => item !== option))
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					id={id}
					type="button"
					className={cn(
						'flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-lg border border-border-default bg-surface px-3 py-1.5 text-base shadow-xs outline-none md:min-h-10',
						'focus-visible:border-accent-mint focus-visible:ring-[3px] focus-visible:ring-accent-mint/25',
						'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
						className,
					)}
				>
					{value.length === 0 ? (
						<span className="flex-1 text-left text-ink-faint md:text-sm">{placeholder}</span>
					) : (
						value.map((option) => (
							<span
								key={option}
								className="flex h-7 items-center gap-1 rounded-md bg-n-20 py-1 pr-1 pl-2.5 text-xs font-semibold whitespace-nowrap text-n-600 md:text-xs"
							>
								{option}
								<span
									role="button"
									tabIndex={-1}
									onClick={(event) => remove(option, event)}
									className="rounded p-0.5 text-n-500 hover:bg-n-30 hover:text-n-700"
								>
									<X className="size-3" />
								</span>
							</span>
						))
					)}
					<ChevronDown className="ml-auto size-4 shrink-0 self-center opacity-50" />
				</button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-1">
				{options.map((option) => {
					const selecionado = value.includes(option)
					return (
						<button
							key={option}
							type="button"
							onClick={() => toggle(option)}
							className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-n-700 outline-hidden hover:bg-t-100 hover:text-t-600"
						>
							<span
								className={cn(
									'flex size-4 shrink-0 items-center justify-center rounded border border-n-200',
									selecionado && 'border-(--t-500) bg-t-500 text-n-0',
								)}
							>
								{selecionado && <Check className="size-3" />}
							</span>
							{option}
						</button>
					)
				})}
			</PopoverContent>
		</Popover>
	)
}
