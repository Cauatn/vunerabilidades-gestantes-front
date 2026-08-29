import type { ReactNode } from 'react'

import { Description, Heading } from '@/components/typography'
import { Button } from '@/components/ui/button'

interface InstrumentoLayoutProps {
	versao: string
	titulo: string
	descricao: string
	children: ReactNode
	onCancelar: () => void
	onPublicar: () => void
	publicarLabel?: string
	publicarDisabled?: boolean
}

export function InstrumentoLayout({
	versao,
	titulo,
	descricao,
	children,
	onCancelar,
	onPublicar,
	publicarLabel = 'Publicar alterações',
	publicarDisabled = false,
}: InstrumentoLayoutProps) {
	return (
		<div className="flex min-h-full flex-1 flex-col">
			<div className="flex flex-1 flex-col gap-13 pb-24">
				<div className="flex flex-col gap-2.5">
					<span className="w-fit rounded-full bg-n-20 px-[18px] py-1 text-base font-semibold text-n-600">
						{versao}
					</span>
					<Heading size="display" className="text-n-900">
						{titulo}
					</Heading>
					<Description className="text-n-600">{descricao}</Description>
				</div>

				<div className="flex flex-col gap-12">{children}</div>
			</div>

			<div className="sticky bottom-0 z-10 mt-auto flex items-center justify-end gap-3 border-t border-n-40 bg-n-0 py-4">
				<Button type="button" variant="outline" onClick={onCancelar}>
					Cancelar
				</Button>
				<Button type="button" onClick={onPublicar} disabled={publicarDisabled}>
					{publicarLabel}
				</Button>
			</div>
		</div>
	)
}
