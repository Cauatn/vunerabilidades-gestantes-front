import { cn } from '@/lib/utils'

interface RadioGroupOption {
	value: string
	label: string
}

interface RadioGroupProps {
	options: RadioGroupOption[]
	value?: string
	onValueChange: (value: string) => void
	name?: string
	className?: string
}

function RadioGroupItem({
	label,
	selected,
	onSelect,
}: {
	label: string
	selected: boolean
	onSelect: () => void
}) {
	return (
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			onClick={onSelect}
			className={cn(
				'flex w-full items-center gap-2 rounded-lg border px-[18px] py-[14px] text-left text-sm transition-colors',
				selected ? 'border-(--t-500) bg-t-50 font-semibold text-n-700' : 'border-n-100 font-normal text-n-700 hover:bg-n-10',
			)}
		>
			<span
				className={cn(
					'flex size-4 shrink-0 items-center justify-center rounded-full border-2',
					selected ? 'border-(--t-500)' : 'border-n-200',
				)}
			>
				{selected && <span className="size-2 rounded-full bg-t-500" />}
			</span>
			{label}
		</button>
	)
}

export function RadioGroup({ options, value, onValueChange, name, className }: RadioGroupProps) {
	return (
		<div role="radiogroup" aria-label={name} className={cn('flex flex-col gap-2', className)}>
			{options.map((option) => (
				<RadioGroupItem
					key={option.value}
					label={option.label}
					selected={value === option.value}
					onSelect={() => onValueChange(option.value)}
				/>
			))}
		</div>
	)
}
