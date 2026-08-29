import type { ReactNode } from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FieldLabelProps {
	children: ReactNode
	required?: boolean
	htmlFor?: string
	className?: string
}

export function FieldLabel({ children, required, htmlFor, className }: FieldLabelProps) {
	return (
		<Label htmlFor={htmlFor} required={required} className={cn('gap-1', className)}>
			{children}
		</Label>
	)
}
