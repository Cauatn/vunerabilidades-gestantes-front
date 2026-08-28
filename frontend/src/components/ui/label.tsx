import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const labelVariants = cva(
	'flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'text-sm font-semibold leading-tight tracking-[0.4px] text-n-700',
				shadcn: 'text-sm font-medium leading-none text-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

function Label({
	className,
	variant,
	...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>) {
	return (
		<LabelPrimitive.Root
			data-slot="label"
			className={cn(labelVariants({ variant }), className)}
			{...props}
		/>
	)
}

export { Label, labelVariants }
