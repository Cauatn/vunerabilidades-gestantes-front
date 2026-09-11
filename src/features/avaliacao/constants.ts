import type { VulnerabilityBand } from '@/features/instrumentos/types/escala'

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

/**
 * Faixas fixas usadas só pelas telas de impressão/protótipo que ainda rodam
 * sobre dados mock (sem avaliação real por trás, logo sem snapshot de
 * faixas de verdade pra ler cor/limites).
 */
export const SYNTHETIC_VULNERABILITY_BANDS: VulnerabilityBand[] = [
	{ id: 'BAIXA', level: 'Baixa', color: '#4ADE80', minScore: 0, maxScore: 3, order: 0, recommendations: [] },
	{ id: 'MODERADA', level: 'Moderada', color: '#FBBF24', minScore: 3, maxScore: 8, order: 1, recommendations: [] },
	{ id: 'ALTA', level: 'Alta', color: '#F87171', minScore: 8, maxScore: 12, order: 2, recommendations: [] },
]

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
