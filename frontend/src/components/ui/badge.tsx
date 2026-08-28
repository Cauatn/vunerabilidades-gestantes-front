import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
	'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
	{
		variants: {
			variant: {
				default: 'border-transparent bg-(--b-100) text-(--b-600)',
				outline: 'border-(--n-50) bg-(--n-0) text-(--n-700)',
				green: 'border-transparent bg-g-100 text-g-600',
				red: 'border-transparent bg-r-100 text-r-600',
				blue: 'border-transparent bg-b-100 text-b-600',
				yellow: 'border-transparent bg-y-100 text-y-600',
				neutral: 'border-transparent bg-n-20 text-n-600',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

function Badge({
	className,
	variant,
	...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
	return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
