import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

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

function Input({
	className,
	type,
	variant,
	...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(inputVariants({ variant }), className)}
			{...props}
		/>
	)
}

export { Input, inputVariants }
