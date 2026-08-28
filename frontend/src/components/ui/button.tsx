import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
				outline: 'border border-n-40 bg-n-0 hover:bg-n-10',
				'outline-danger': 'border border-danger bg-n-0 hover:bg-r-100',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-n-20 hover:text-accent-foreground dark:hover:bg-n-20/50',
				link: 'text-primary underline-offset-4 hover:underline',
				default:
					'border-transparent bg-accent-mint font-bold tracking-[0.2px] text-white shadow-xs hover:bg-brand-hover active:bg-brand-pressed focus-visible:border-transparent focus-visible:ring-accent-mint/40 dark:focus-visible:ring-accent-mint/40 bg-t-500 hover:bg-t-600 active:bg-t-700',
				warning:
					'border-transparent bg-y-400 font-bold tracking-[0.2px] text-white shadow-xs hover:bg-y-600 active:bg-y-700 focus-visible:border-transparent focus-visible:ring-y-400/40',
				danger: 'border-transparent bg-r-500 font-bold tracking-[0.2px] text-white shadow-xs hover:bg-r-600 active:bg-r-700 focus-visible:border-transparent focus-visible:ring-r-500/40',
			},
			size: {
				sm: "h-10 md:h-8 min-h-10 md:min-h-8 gap-2 rounded-md px-4 text-sm md:text-xs font-bold tracking-[0.2px] has-[>svg]:px-3 [&_svg:not([class*='size-'])]:size-3.5",
				default:
					"h-11 md:h-10 min-h-11 md:min-h-10 gap-2 rounded-md px-5 text-base md:text-sm font-bold tracking-[0.2px] has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-4",
				lg: "h-12 min-h-12 gap-2 rounded-md px-6 text-base font-bold tracking-[0.2px] has-[>svg]:px-5 [&_svg:not([class*='size-'])]:size-4",
				icon: 'size-9',
				'icon-sm': 'size-8',
				'icon-lg': 'size-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

interface ButtonProps
	extends React.ComponentProps<'button'>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
	isLoading?: boolean
}

function Button({
	className,
	variant,
	size,
	asChild = false,
	isLoading = false,
	children,
	disabled,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : 'button'

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size }), className)}
			disabled={isLoading || disabled}
			{...props}
		>
			{isLoading ? (
				<>
					<Loader2 className="animate-spin" />
					{children}
				</>
			) : (
				children
			)}
		</Comp>
	)
}

export { Button, buttonVariants }
