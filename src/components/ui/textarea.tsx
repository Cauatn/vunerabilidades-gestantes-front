import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				'min-h-24 w-full min-w-0 resize-y rounded-lg border border-border-default bg-surface px-3 py-2 text-base text-ink-secondary shadow-xs outline-none transition-[color,box-shadow] placeholder:text-ink-faint md:text-sm',
				'focus-visible:border-accent-mint focus-visible:ring-[3px] focus-visible:ring-accent-mint/25',
				'aria-invalid:border-destructive aria-invalid:ring-destructive/20',
				'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			{...props}
		/>
	)
}

export { Textarea }
