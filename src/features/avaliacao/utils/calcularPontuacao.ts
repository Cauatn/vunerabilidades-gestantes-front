import type { Pergunta } from '@/features/avaliacao/types/pergunta'

export function calcularPontuacao(respostas: Record<string, string>, perguntas: Pergunta[]) {
	const entradas = Object.entries(respostas)
	if (entradas.length === 0) return 0

	const soma = entradas.reduce((total, [perguntaId, opcaoId]) => {
		const pergunta = perguntas.find((item) => item.id === perguntaId)
		const opcao = pergunta?.opcoes.find((item) => item.id === opcaoId)
		return total + (opcao?.pontuacao ?? 0)
	}, 0)

	return Math.round(soma / entradas.length)
}

export function classificar(pontuacao: number) {
	if (pontuacao <= 3) return 'BAIXA' as const
	if (pontuacao <= 8) return 'MODERADA' as const
	return 'ALTA' as const
}
