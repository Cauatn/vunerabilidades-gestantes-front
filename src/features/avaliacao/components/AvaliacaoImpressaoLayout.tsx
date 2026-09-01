import type { ReactNode } from 'react'

interface AvaliacaoImpressaoLayoutProps {
	avaliacaoId: string
	emitidoEm: string
	emissor: string
	ubs: string
	children: ReactNode
}

export function AvaliacaoImpressaoLayout({ avaliacaoId, emitidoEm, emissor, ubs, children }: AvaliacaoImpressaoLayoutProps) {
	return (
		<div className="mx-auto flex w-full max-w-[1360px] flex-col gap-10 px-10 py-10">
			<p className="text-center text-[44px] font-semibold text-n-900">Logo</p>

			<h1 className="text-heading-1 font-semibold text-n-900">Avaliação #{avaliacaoId}</h1>

			<div className="flex flex-col gap-4">{children}</div>

			<footer className="flex flex-col items-end gap-1 py-10 text-sm text-n-600">
				<p>Emitido em: {emitidoEm}</p>
				<p>Emissor: {emissor}</p>
				<p>UBS: {ubs}</p>
			</footer>
		</div>
	)
}
