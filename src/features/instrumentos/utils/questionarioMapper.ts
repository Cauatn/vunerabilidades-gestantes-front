import type { GrauConfig } from '@/features/instrumentos/types/escala'
import type { OpcaoResposta, PerguntaConfig, SecaoConfig, TipoPergunta } from '@/features/instrumentos/types/questionario'
import type {
	Question,
	QuestionnaireVersion,
	QuestionType,
} from '@/features/instrumentos/types/questionnaire'
import { COR_GRAU_PADRAO } from '@/features/instrumentos/constants'

export function tipoBackendParaConfig(type: QuestionType): TipoPergunta {
	return type === 'YES_NO' ? 'dicotomica' : 'categorica_ordinal'
}

export function tipoConfigParaBackend(tipo: TipoPergunta): QuestionType {
	return tipo === 'dicotomica' || tipo === 'dicotomica_complementar' ? 'YES_NO' : 'MULTIPLE_CHOICE'
}

function opcaoParaConfig(id: string, label: string, score: number): OpcaoResposta {
	return { id, texto: label, pontuavel: score > 0, pontuacao: score }
}

function perguntaParaConfig(question: Question): PerguntaConfig {
	return {
		id: question.id,
		codigo: '',
		enunciado: question.statement,
		tipo: tipoBackendParaConfig(question.type),
		opcoes: [...question.options]
			.sort((a, b) => a.order - b.order)
			.map((opcao) => opcaoParaConfig(opcao.id, opcao.label, opcao.score)),
	}
}

export function versaoParaSecoes(version: QuestionnaireVersion): SecaoConfig[] {
	const ordenadas = [...version.questions].sort((a, b) => a.order - b.order)
	const filhasPorPai = new Map<string, Question[]>()
	for (const question of ordenadas) {
		if (!question.visibleWhenQuestionId) continue
		const lista = filhasPorPai.get(question.visibleWhenQuestionId) ?? []
		lista.push(question)
		filhasPorPai.set(question.visibleWhenQuestionId, lista)
	}

	const secoes: SecaoConfig[] = []
	for (const question of ordenadas) {
		if (question.visibleWhenQuestionId) continue

		let secao = secoes.find((item) => item.nome === question.section)
		if (!secao) {
			secao = { id: crypto.randomUUID(), nome: question.section, perguntas: [] }
			secoes.push(secao)
		}

		const pergunta = perguntaParaConfig(question)
		const filhas = filhasPorPai.get(question.id)
		if (filhas?.length) pergunta.subPerguntas = filhas.map(perguntaParaConfig)
		secao.perguntas.push(pergunta)
	}

	return secoes
}

export function versaoParaGraus(version: QuestionnaireVersion): GrauConfig[] {
	return [...version.vulnerabilityBands]
		.sort((a, b) => a.minScore - b.minScore)
		.map((banda) => ({
			id: banda.id,
			nome: banda.level,
			cor: COR_GRAU_PADRAO,
			min: banda.minScore,
			max: banda.maxScore,
			recomendacoes: [...banda.recommendations]
				.sort((a, b) => a.order - b.order)
				.map((rec) => ({ id: rec.id, texto: rec.text })),
		}))
}

export function pontuacaoMaxima(secoes: SecaoConfig[]): number {
	const somaPergunta = (pergunta: PerguntaConfig) =>
		Math.max(0, ...pergunta.opcoes.map((opcao) => (opcao.pontuavel ? (opcao.pontuacao ?? 0) : 0)))

	let total = 0
	for (const secao of secoes) {
		for (const pergunta of secao.perguntas) {
			total += somaPergunta(pergunta)
			for (const sub of pergunta.subPerguntas ?? []) total += somaPergunta(sub)
		}
	}
	return total
}
