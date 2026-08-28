import { Lock } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface DashboardCardProps extends Omit<React.ComponentProps<'div'>, 'title'> {
	title: React.ReactNode
	subtitle?: React.ReactNode
	footer?: React.ReactNode
	locked?: boolean
	lockedText?: React.ReactNode
}

function DashboardCard({
	title,
	subtitle,
	footer,
	locked = false,
	lockedText = 'Esta métrica ficará disponível em breve.',
	className,
	children,
	...props
}: DashboardCardProps) {
	return (
		<div
			data-slot="dashboard-card"
			className={cn(
				'relative flex w-full flex-col rounded-lg border border-n-30 bg-n-0 p-5',
				className,
			)}
			{...props}
		>
			{locked ? (
				<div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-lg bg-n-0/96 p-4 text-center">
					<Lock className="size-6 text-n-500" />
					<span className="text-[15px] font-semibold text-n-700">Estamos trabalhando nisso...</span>
					<span className="text-caption text-n-500">{lockedText}</span>
				</div>
			) : null}

			<div className="flex flex-col">
				<span className="text-base font-semibold text-n-700">{title}</span>
				{subtitle ? <span className="mb-3 text-caption text-n-500">{subtitle}</span> : null}
			</div>

			<div className="flex flex-1 items-center justify-center gap-4 py-4">{children}</div>

			{footer ? (
				<div className="flex flex-col items-center">
					<div className="mb-3 h-px w-full bg-n-30" />
					{footer}
				</div>
			) : null}
		</div>
	)
}

export { DashboardCard }
