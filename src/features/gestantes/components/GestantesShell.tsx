import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'

type Props = {
	title: string
	subtitle: string
	action?: { label: string; onClick?: () => void }
	children: ReactNode
}

export function GestantesShell({ title, subtitle, action, children }: Props) {
	return (
		<>
			<header className="flex items-start justify-between gap-6">
				<div>
					<h1 className="text-[44px] leading-[44px] font-semibold tracking-[0.15px] text-n-800">
						{title}
					</h1>
					<p className="mt-2 text-lg text-n-600">{subtitle}</p>
				</div>
				{action ? (
					<Button className="shrink-0" onClick={action.onClick}>
						{action.label}
					</Button>
				) : null}
			</header>

			{children}
		</>
	)
}
