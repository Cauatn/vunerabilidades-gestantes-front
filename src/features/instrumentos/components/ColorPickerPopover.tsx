import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { CORES_GRAU } from '../constants'

interface ColorPickerPopoverProps {
	cor: string
	onChange: (hex: string) => void
}

export function ColorPickerPopover({ cor, onChange }: ColorPickerPopoverProps) {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button type="button" className="flex items-center rounded-lg border border-n-40 p-2">
					<span className="size-4 rounded-full" style={{ background: cor }} />
				</button>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-auto p-3">
				<div className="flex flex-col gap-2">
					{CORES_GRAU.map((linha, i) => (
						<div key={i} className="flex gap-2">
							{linha.map((c) => (
								<button
									key={c}
									type="button"
									onClick={() => {
										onChange(c)
										setOpen(false)
									}}
									className={cn(
										'size-8 rounded-[2px]',
										cor === c && 'ring-2 ring-n-500 ring-offset-2',
									)}
									style={{ background: c }}
								/>
							))}
						</div>
					))}
				</div>
			</PopoverContent>
		</Popover>
	)
}
