import * as React from 'react'

import { Description, Heading, type HeadingProps } from '@/components/typography'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

export type PageProps = {
	title: React.ReactNode
	description?: React.ReactNode
	children?: React.ReactNode
	className?: string
	headingSize?: HeadingProps['size']
	withButton?: boolean
	buttonText?: string
	buttonProps?: React.ComponentProps<'button'>
	headerActions?: React.ReactNode
}

export function Page({
	title,
	description,
	children,
	className,
	headingSize = 'page',
	withButton = false,
	buttonText = 'Criar',
	buttonProps = {},
	headerActions,
}: PageProps) {
	return (
		<div className={cn('flex h-full min-w-0 flex-col space-y-8', className)}>
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
				<div className="space-y-2">
					<Heading size={headingSize}>{title}</Heading>
					{description ? <Description>{description}</Description> : null}
				</div>
				{headerActions ?? (withButton ? <Button {...buttonProps}>{buttonText}</Button> : null)}
			</div>
			{children}
		</div>
	)
}
