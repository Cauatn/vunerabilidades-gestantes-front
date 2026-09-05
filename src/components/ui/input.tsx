import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays } from 'lucide-react'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const inputVariants = cva(
	'w-full min-w-0 transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'h-11 md:h-10 rounded-lg border border-border-default bg-surface px-3 py-1 text-base md:text-sm text-ink-secondary shadow-xs selection:bg-primary selection:text-primary-foreground placeholder:text-ink-faint file:text-foreground focus-visible:border-accent-mint focus-visible:ring-[3px] focus-visible:ring-accent-mint/25 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
				shadcn:
					'h-11 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs selection:bg-primary selection:text-primary-foreground file:text-foreground placeholder:text-muted-foreground dark:bg-input/30 md:text-sm focus-visible:border-blue-500 focus-visible:ring-[3px] focus-visible:ring-blue-500/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

export type MaskType = 'cpf' | 'cns'

export function onlyDigits(value: string): string {
	return value.replace(/\D/g, '')
}

function applyCpfMask(rawValue: string): string {
	const digits = onlyDigits(rawValue).slice(0, 11)
	const groups = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean)
	const lastDigits = digits.slice(9, 11)
	if (!lastDigits) return groups.join('.')
	return `${groups.join('.')}-${lastDigits}`
}

function applyCnsMask(rawValue: string): string {
	const digits = onlyDigits(rawValue).slice(0, 15)
	const groups = [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7, 11), digits.slice(11, 15)]
	return groups.filter(Boolean).join(' ')
}

const MASKS: Record<MaskType, (value: string) => string> = {
	cpf: applyCpfMask,
	cns: applyCnsMask,
}

export function applyMask(maskType: MaskType, value: string): string {
	return MASKS[maskType](value)
}

const MASK_PLACEHOLDERS: Record<MaskType, string> = {
	cpf: '000.000.000-00',
	cns: '000 0000 0000 0000',
}

type BaseInputProps = React.ComponentProps<'input'> & VariantProps<typeof inputVariants>

interface MaskedInputProps extends BaseInputProps {
	maskType?: MaskType
	datePicker?: false
}

interface DatePickerInputProps
	extends Omit<React.ComponentProps<'button'>, 'value' | 'onChange' | 'type' | 'onClick'>,
		Pick<VariantProps<typeof inputVariants>, 'variant'> {
	maskType?: undefined
	datePicker: true
	value?: string
	onValueChange: (value: string) => void
	placeholder?: string
}

type InputProps = MaskedInputProps | DatePickerInputProps

function Input(props: InputProps) {
	if (props.datePicker) {
		const { className, variant, value, onValueChange, placeholder = 'Selecione', ...rest } = props
		return (
			<DatePickerInput
				className={className}
				variant={variant}
				value={value}
				onValueChange={onValueChange}
				placeholder={placeholder}
				{...rest}
			/>
		)
	}

	const { className, type, variant, maskType, onChange, placeholder, inputMode, ...rest } = props
	return (
		<input
			type={type}
			data-slot="input"
			placeholder={placeholder ?? (maskType ? MASK_PLACEHOLDERS[maskType] : undefined)}
			inputMode={inputMode ?? (maskType ? 'numeric' : undefined)}
			className={cn(inputVariants({ variant }), className)}
			onChange={
				maskType
					? (event) => {
							event.target.value = MASKS[maskType](event.target.value)
							onChange?.(event)
						}
					: onChange
			}
			{...rest}
		/>
	)
}

function DatePickerInput({
	className,
	variant,
	value,
	onValueChange,
	placeholder,
	...props
}: Omit<DatePickerInputProps, 'datePicker' | 'maskType'>) {
	const [open, setOpen] = React.useState(false)
	const selectedDate = value ? new Date(`${value}T00:00:00`) : undefined

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={cn(
						inputVariants({ variant }),
						'flex cursor-pointer items-center gap-2 text-left',
						!value && 'text-ink-faint',
						className,
					)}
					{...props}
				>
					<CalendarDays className="size-4 shrink-0 text-n-400" />
					<span className="truncate">
						{selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : placeholder}
					</span>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start" onOpenAutoFocus={(event) => event.preventDefault()}>
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={(date) => {
						if (date) {
							onValueChange(format(date, 'yyyy-MM-dd'))
							setOpen(false)
						}
					}}
					locale={ptBR}
					defaultMonth={selectedDate}
				/>
			</PopoverContent>
		</Popover>
	)
}

export { Input, inputVariants }
