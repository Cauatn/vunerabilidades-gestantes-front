import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

export interface Option {
	id: string
	name: string
}

export function FilterSelect({
	label,
	value,
	onChange,
	options,
	disabled = false,
	placeholder = 'Todos',
}: {
	label: string
	value?: string
	onChange: (value: string) => void
	options: Option[]
	disabled?: boolean
	placeholder?: string
}) {
	const id = `filter-${label.replace(/\s/g, '-')}`
	return (
		<div className="space-y-2">
			<Label htmlFor={id}>{label}</Label>
			<Select
				value={value || '__all__'}
				onValueChange={(next) =>
					onChange(next === '__all__' ? '' : next)
				}
				disabled={disabled}
			>
				<SelectTrigger id={id} className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="__all__">{placeholder}</SelectItem>
					{options.map((option) => (
						<SelectItem key={option.id} value={option.id}>
							{option.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
