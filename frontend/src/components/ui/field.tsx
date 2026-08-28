import { useMemo } from 'react'

import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot="field-group" className={cn('flex w-full flex-col gap-3', className)} {...props} />
}

function Field({ className, ...props }: React.ComponentProps<'div'>) {
	return <div role="group" data-slot="field" className={cn('flex w-full min-w-0 flex-col gap-2', className)} {...props} />
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot="field-content" className={cn('flex min-w-0 flex-1 flex-col gap-1.5', className)} {...props} />
}

function FieldLabel({
	className,
	required,
	children,
	...props
}: React.ComponentProps<typeof Label> & { required?: boolean }) {
	return (
		<Label data-slot="field-label" className={cn('w-fit text-n-700', className)} {...props}>
			<span className="inline-flex items-center gap-0.5">
				{children}
				{required ? (
					<span className="text-danger" aria-hidden>
						*
					</span>
				) : null}
			</span>
		</Label>
	)
}

function FieldError({
	className,
	children,
	errors,
	...props
}: React.ComponentProps<'div'> & {
	errors?: Array<{ message?: string } | undefined>
}) {
	const content = useMemo(() => {
		if (children) return children
		if (!errors?.length) return null

		const unicos = [...new Map(errors.map((error) => [error?.message, error])).values()]
		if (unicos.length === 1) return unicos[0]?.message

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{unicos.map((error, index) => error?.message && <li key={index}>{error.message}</li>)}
			</ul>
		)
	}, [children, errors])

	if (!content) return null

	return (
		<div role="alert" data-slot="field-error" className={cn('text-sm font-normal text-danger', className)} {...props}>
			{content}
		</div>
	)
}

export { Field, FieldContent, FieldError, FieldGroup, FieldLabel }
