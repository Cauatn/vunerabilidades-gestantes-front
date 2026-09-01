export interface Recomendacao {
	id: string
	texto: string
}

export const RECOMENDACOES: Recomendacao[] = [
	{ id: 'prontuario', texto: 'Registrar os resultados no prontuário.' },
	{ id: 'equipe', texto: 'Discutir o caso com a equipe de saúde.' },
	{ id: 'necessidades', texto: 'Avaliar outras necessidades da gestante.' },
	{ id: 'protocolos', texto: 'Definir as condutas conforme os protocolos da unidade.' },
	{ id: 'julgamento', texto: 'O julgamento clínico do profissional deve prevalecer.' },
]

export type Classificacao = 'BAIXA' | 'MODERADA' | 'ALTA'

export const CLASSIFICACAO_LABEL: Record<Classificacao, string> = {
	BAIXA: 'Baixa',
	MODERADA: 'Moderada',
	ALTA: 'Alta',
}

export const CLASSIFICACAO_COR_TEXTO: Record<Classificacao, string> = {
	BAIXA: 'text-g-400',
	MODERADA: 'text-y-400',
	ALTA: 'text-r-500',
}

export const CLASSIFICACAO_COR_BG: Record<Classificacao, string> = {
	BAIXA: 'bg-g-400',
	MODERADA: 'bg-y-400',
	ALTA: 'bg-r-500',
}

// Usa a sintaxe border-(--token) em vez de border-{cor}-{tom}: as cores "y"
// (amarelo) e "r" (vermelho) colidem com os atalhos de lado do Tailwind
// (border-y-*, border-r-*), que interpretam o número como largura da borda
// em vez de tom da cor, gerando bordas gigantes.
export const CLASSIFICACAO_COR_BORDA: Record<Classificacao, string> = {
	BAIXA: 'border-(--g-400)',
	MODERADA: 'border-(--y-400)',
	ALTA: 'border-(--r-500)',
}
