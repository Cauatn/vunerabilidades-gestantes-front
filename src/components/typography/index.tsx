import * as React from 'react'

import { cn } from '@/lib/utils'

export type HeadingProps = React.ComponentProps<'h1'> & {
	size?: 'display' | 'page' | 'h2' | 'subheading'
	as?: 'h1' | 'h2' | 'h3'
}

function Heading({ size = 'display', as, className, ...props }: HeadingProps) {
	const Tag = (as ?? (size === 'h2' ? 'h2' : size === 'subheading' ? 'h3' : 'h1')) as
		| 'h1'
		| 'h2'
		| 'h3'

	return (
		<Tag
			className={cn(
				'text-n-700',
				size === 'display' && 'text-balance text-heading-1 font-semibold tracking-tight',
				size === 'page' && 'text-balance text-heading-2 font-semibold',
				size === 'h2' && 'text-heading-2 font-semibold',
				size === 'subheading' && 'text-subheading-1 font-normal',
				className,
			)}
			{...props}
		/>
	)
}

function Body({ className, ...props }: React.ComponentProps<'p'>) {
	return <p className={cn('text-body font-normal text-n-700', className)} {...props} />
}

function Description({ className, ...props }: React.ComponentProps<'p'>) {
	return (
		<p className={cn('text-body font-normal text-n-500 text-balance', className)} {...props} />
	)
}

function Caption({ className, ...props }: React.ComponentProps<'span'>) {
	return <span className={cn('text-caption font-normal text-n-700', className)} {...props} />
}

export type TextProps<TAs extends React.ElementType = 'span'> = {
	as?: TAs
	variant?: 'default' | 'link'
	className?: string
} & Omit<React.ComponentPropsWithoutRef<TAs>, 'as' | 'className'>

function Text<TAs extends React.ElementType = 'span'>({
	as,
	variant = 'default',
	className,
	...props
}: TextProps<TAs>) {
	const Tag = (as ?? 'span') as React.ElementType

	return (
		<Tag
			className={cn(
				variant === 'link' &&
					'text-caption tracking-wide text-t-600 underline-offset-4 hover:underline',
				className,
			)}
			{...props}
		/>
	)
}

export { Heading, Body, Description, Caption, Text }
