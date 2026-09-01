import type { ReactNode } from 'react'

import { Logo } from '@/components/Logo'
import { Description } from '@/components/typography'

interface AuthLayoutProps {
	illustration: string
	tagline: string
	children: ReactNode
}

/** Layout de duas colunas das telas de autenticação: painel teal com ilustração + conteúdo centralizado. */
export function AuthLayout({ illustration, tagline, children }: AuthLayoutProps) {
	return (
		<div className="flex min-h-svh w-full flex-col lg:flex-row">
			<div className="relative flex shrink-0 items-center justify-center overflow-hidden bg-t-400 p-10 lg:w-[42%]">
				<img src={illustration} alt="" className="h-auto w-full max-w-[520px]" aria-hidden />
			</div>
			<div className="flex flex-1 items-center justify-center bg-n-0 px-6 py-10 sm:px-10">
				<div className="w-full max-w-[440px]">
					<div className="mb-10 flex flex-col items-center gap-2 text-center">
						<Logo className="h-[124px] w-[164px]" />
						<Description className="text-base text-n-600">{tagline}</Description>
					</div>
					{children}
				</div>
			</div>
		</div>
	)
}
