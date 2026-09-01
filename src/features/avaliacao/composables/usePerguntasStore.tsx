import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

import type { Pergunta } from '@/features/avaliacao/types/pergunta'

const PERGUNTAS_INICIAIS: Pergunta[] = [
	{
		id: 'renda',
		categoria: 'Condições socioeconômicas',
		texto: 'A renda familiar é suficiente para atender às necessidades básicas?',
		opcoes: [
			{ id: 'renda-sim', texto: 'Sim', pontuacao: 0 },
			{ id: 'renda-parcialmente', texto: 'Parcialmente', pontuacao: 6 },
			{ id: 'renda-nao', texto: 'Não', pontuacao: 12 },
		],
	},
	{
		id: 'vinculo',
		categoria: 'Condições socioeconômicas',
		texto: 'A gestante possui vínculo empregatício?',
		opcoes: [
			{ id: 'vinculo-sim', texto: 'Sim', pontuacao: 0 },
			{ id: 'vinculo-informal', texto: 'Trabalho informal', pontuacao: 6 },
			{ id: 'vinculo-nao', texto: 'Não', pontuacao: 12 },
		],
	},
]

interface PerguntasContextValue {
	perguntas: Pergunta[]
	addPergunta: (categoria?: string) => void
	removePergunta: (perguntaId: string) => void
	reorderPerguntas: (idsNaNovaOrdem: string[]) => void
	updatePerguntaCategoria: (perguntaId: string, categoria: string) => void
	updatePerguntaTexto: (perguntaId: string, texto: string) => void
	addOpcao: (perguntaId: string) => void
	removeOpcao: (perguntaId: string, opcaoId: string) => void
	updateOpcaoTexto: (perguntaId: string, opcaoId: string, texto: string) => void
	updateOpcaoPontuacao: (perguntaId: string, opcaoId: string, pontuacao: number) => void
}

const PerguntasContext = createContext<PerguntasContextValue | null>(null)

export function PerguntasProvider({ children }: { children: ReactNode }) {
	const [perguntas, setPerguntas] = useState<Pergunta[]>(PERGUNTAS_INICIAIS)

	const value = useMemo<PerguntasContextValue>(
		() => ({
			perguntas,
			addPergunta: (categoria = '') =>
				setPerguntas((atual) => [
					...atual,
					{
						id: crypto.randomUUID(),
						categoria,
						texto: '',
						opcoes: [{ id: crypto.randomUUID(), texto: '', pontuacao: 0 }],
					},
				]),
			removePergunta: (perguntaId) =>
				setPerguntas((atual) => atual.filter((pergunta) => pergunta.id !== perguntaId)),
			reorderPerguntas: (idsNaNovaOrdem) =>
				setPerguntas((atual) => {
					const porId = new Map(atual.map((pergunta) => [pergunta.id, pergunta]))
					const idsAReordenar = new Set(idsNaNovaOrdem)
					let cursor = 0
					return atual.map((pergunta) =>
						idsAReordenar.has(pergunta.id) ? porId.get(idsNaNovaOrdem[cursor++])! : pergunta,
					)
				}),
			updatePerguntaCategoria: (perguntaId, categoria) =>
				setPerguntas((atual) =>
					atual.map((pergunta) => (pergunta.id === perguntaId ? { ...pergunta, categoria } : pergunta)),
				),
			updatePerguntaTexto: (perguntaId, texto) =>
				setPerguntas((atual) =>
					atual.map((pergunta) => (pergunta.id === perguntaId ? { ...pergunta, texto } : pergunta)),
				),
			addOpcao: (perguntaId) =>
				setPerguntas((atual) =>
					atual.map((pergunta) =>
						pergunta.id === perguntaId
							? {
									...pergunta,
									opcoes: [...pergunta.opcoes, { id: crypto.randomUUID(), texto: '', pontuacao: 0 }],
								}
							: pergunta,
					),
				),
			removeOpcao: (perguntaId, opcaoId) =>
				setPerguntas((atual) =>
					atual.map((pergunta) =>
						pergunta.id === perguntaId
							? { ...pergunta, opcoes: pergunta.opcoes.filter((opcao) => opcao.id !== opcaoId) }
							: pergunta,
					),
				),
			updateOpcaoTexto: (perguntaId, opcaoId, texto) =>
				setPerguntas((atual) =>
					atual.map((pergunta) =>
						pergunta.id === perguntaId
							? {
									...pergunta,
									opcoes: pergunta.opcoes.map((opcao) => (opcao.id === opcaoId ? { ...opcao, texto } : opcao)),
								}
							: pergunta,
					),
				),
			updateOpcaoPontuacao: (perguntaId, opcaoId, pontuacao) =>
				setPerguntas((atual) =>
					atual.map((pergunta) =>
						pergunta.id === perguntaId
							? {
									...pergunta,
									opcoes: pergunta.opcoes.map((opcao) =>
										opcao.id === opcaoId ? { ...opcao, pontuacao } : opcao,
									),
								}
							: pergunta,
					),
				),
		}),
		[perguntas],
	)

	return <PerguntasContext.Provider value={value}>{children}</PerguntasContext.Provider>
}

export function usePerguntas() {
	const context = useContext(PerguntasContext)
	if (!context) throw new Error('usePerguntas deve ser usado dentro de um PerguntasProvider')
	return context
}
