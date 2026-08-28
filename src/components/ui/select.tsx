import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

// Sentinel usado para "sem seleção" enquanto o Select está aberto — o Radix
// exige um value não-vazio pra funcionar; fechado, o value volta pra '' e o
// placeholder aparece. Contorna bug do Radix onde value=undefined não volta
// a mostrar o placeholder (radix-ui/primitives#1569).
const NONE_VALUE = '__none__'

function Select({
	value,
	onValueChange,
	open: openProp,
	onOpenChange,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
	const [openState, setOpenState] = React.useState(false)
	const open = openProp ?? openState
	const setOpen = onOpenChange ?? setOpenState

	return (
		<SelectPrimitive.Root
			data-slot="select"
			open={open}
			onOpenChange={setOpen}
			value={open && value === undefined ? NONE_VALUE : (value ?? '')}
			onValueChange={onValueChange && ((next) => onValueChange(next === NONE_VALUE ? '' : next))}
			{...props}
		/>
	)
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
	return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
	return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
	className,
	size = 'default',
	children,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
	size?: 'sm' | 'default'
}) {
	return (
		<SelectPrimitive.Trigger
			data-slot="select-trigger"
			data-size={size}
			className={cn(
				"flex w-full items-center justify-between gap-2 rounded-lg border border-border-default bg-surface px-3 py-1 text-base whitespace-nowrap shadow-xs outline-none transition-[color,box-shadow] md:text-sm",
				"data-placeholder:text-ink-faint focus-visible:border-accent-mint focus-visible:ring-[3px] focus-visible:ring-accent-mint/25",
				"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
				"disabled:cursor-not-allowed disabled:opacity-50",
				"data-[size=default]:h-11 md:data-[size=default]:h-10 data-[size=sm]:h-10 md:data-[size=sm]:h-8",
				"*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-n-500 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			{children}
			<SelectPrimitive.Icon asChild>
				<ChevronDownIcon className="size-4 opacity-50" />
			</SelectPrimitive.Icon>
		</SelectPrimitive.Trigger>
	)
}

function SelectContent({
	className,
	children,
	position = 'popper',
	align = 'center',
	withErasingOption = false,
	...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
	withErasingOption?: boolean
}) {
	return (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				data-slot="select-content"
				className={cn(
					'relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg border border-border-default bg-n-0 text-n-700 shadow-md',
					'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
					'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
					position === 'popper' &&
						'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
					className,
				)}
				position={position}
				align={align}
				{...props}
			>
				<SelectScrollUpButton />
				<SelectPrimitive.Viewport
					className={cn(
						'p-1',
						position === 'popper' &&
							'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1',
					)}
				>
					{withErasingOption && (
						<SelectPrimitive.Item
							value={NONE_VALUE}
							className="relative flex w-full cursor-default items-center gap-2 rounded-md px-2 py-3 text-base text-n-400 outline-hidden select-none focus:bg-t-100 focus:text-t-600 md:py-1.5 md:text-sm"
						>
							<SelectPrimitive.ItemText>Limpar seleção</SelectPrimitive.ItemText>
						</SelectPrimitive.Item>
					)}
					{children}
				</SelectPrimitive.Viewport>
				<SelectScrollDownButton />
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	)
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Label>) {
	return <SelectPrimitive.Label data-slot="select-label" className={cn('px-2 py-1.5 text-xs text-n-500', className)} {...props} />
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
	return (
		<SelectPrimitive.Item
			data-slot="select-item"
			className={cn(
				"relative flex w-full cursor-default items-center gap-2 rounded-md py-3 pr-8 pl-2 text-base outline-hidden select-none md:py-1.5 md:text-sm",
				'focus:bg-t-100 focus:text-t-600',
				'data-disabled:pointer-events-none data-disabled:opacity-50',
				"[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='text-'])]:text-n-500 [&_svg:not([class*='size-'])]:size-4",
				'*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
				className,
			)}
			{...props}
		>
			<span data-slot="select-item-indicator" className="absolute right-2 flex size-3.5 items-center justify-center">
				<SelectPrimitive.ItemIndicator>
					<CheckIcon className="size-4" />
				</SelectPrimitive.ItemIndicator>
			</span>
			<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
		</SelectPrimitive.Item>
	)
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Separator>) {
	return <SelectPrimitive.Separator data-slot="select-separator" className={cn('pointer-events-none -mx-1 my-1 h-px bg-n-30', className)} {...props} />
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
	return (
		<SelectPrimitive.ScrollUpButton data-slot="select-scroll-up-button" className={cn('flex cursor-default items-center justify-center py-1', className)} {...props}>
			<ChevronUpIcon className="size-4" />
		</SelectPrimitive.ScrollUpButton>
	)
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
	return (
		<SelectPrimitive.ScrollDownButton data-slot="select-scroll-down-button" className={cn('flex cursor-default items-center justify-center py-1', className)} {...props}>
			<ChevronDownIcon className="size-4" />
		</SelectPrimitive.ScrollDownButton>
	)
}

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
}
