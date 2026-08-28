import { Plus, Search } from 'lucide-react'
import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ComboboxOption {
	value: string
	label: string
}

interface ComboboxProps {
	options: ComboboxOption[]
	value?: string
	onValueChange: (value: string) => void
	placeholder?: string
	emptyMessage?: string
	onCreateNew?: (query: string) => void
	createNewLabel?: string
	className?: string
	id?: string
}

export function Combobox({
	options,
	value,
	onValueChange,
	placeholder = 'Selecione',
	emptyMessage = 'Nenhum resultado encontrado.',
	onCreateNew,
	createNewLabel = 'Cadastrar novo',
	className,
	id,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false)
	const [busca, setBusca] = React.useState('')

	const selecionada = options.find((option) => option.value === value)

	React.useEffect(() => {
		if (!open) setBusca(selecionada?.label ?? '')
	}, [open, selecionada])

	const termo = busca.trim().toLowerCase()
	const filtradas = termo ? options.filter((option) => option.label.toLowerCase().includes(termo)) : options

	function selecionar(option: ComboboxOption) {
		onValueChange(option.value)
		setBusca(option.label)
		setOpen(false)
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-n-400" />
					<Input
						id={id}
						value={busca}
						placeholder={placeholder}
						autoComplete="off"
						onChange={(event) => {
							setBusca(event.target.value)
							if (!open) setOpen(true)
						}}
						className={cn('pl-9', className)}
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				onOpenAutoFocus={(event) => event.preventDefault()}
				className="w-(--radix-popover-trigger-width) p-1"
			>
				<div className="max-h-60 overflow-y-auto">
					{filtradas.map((option) => {
						const isSelected = option.value === value
						return (
							<button
								key={option.value}
								type="button"
								onClick={() => selecionar(option)}
								className={cn(
									'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-hidden',
									isSelected ? 'bg-t-100 font-semibold text-t-600' : 'text-n-700 hover:bg-t-50',
								)}
							>
								{option.label}
							</button>
						)
					})}

					{filtradas.length === 0 && !onCreateNew && (
						<p className="px-2 py-3 text-center text-sm text-n-400">{emptyMessage}</p>
					)}
				</div>

				{filtradas.length === 0 && onCreateNew && (
					<button
						type="button"
						onClick={() => {
							onCreateNew(busca.trim())
							setOpen(false)
						}}
						className="flex w-full items-center gap-2 rounded-md border-t border-n-30 px-2 py-2.5 text-left text-sm font-semibold text-t-500 outline-hidden hover:bg-t-50"
					>
						<Plus className="size-4" />
						{createNewLabel}
					</button>
				)}
			</PopoverContent>
		</Popover>
	)
}
