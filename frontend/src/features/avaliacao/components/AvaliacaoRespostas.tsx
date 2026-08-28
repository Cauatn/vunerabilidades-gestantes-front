import type { CategoriaRespostas } from '@/features/avaliacao/types/historico'

interface AvaliacaoRespostasProps {
	categorias: CategoriaRespostas[]
}

export function AvaliacaoRespostas({ categorias }: AvaliacaoRespostasProps) {
	return (
		<div className="flex w-full max-w-[900px] flex-col gap-4">
			{categorias.map((categoria, index) => (
				<div key={categoria.id} className="flex w-full flex-col gap-3">
					<p className="text-2xl font-semibold text-p-400">
						{index + 1}. {categoria.titulo}
					</p>
					{categoria.respostas.map((resposta, respostaIndex) => (
						<div key={resposta.id} className="flex w-full flex-col">
							<p className="pb-2 text-sm font-semibold text-n-700">
								{respostaIndex + 1}. {resposta.pergunta}
							</p>
							<p className="text-sm text-n-600">
								<span className="font-semibold">Resposta: </span>
								{resposta.resposta}
							</p>
						</div>
					))}
				</div>
			))}
		</div>
	)
}
