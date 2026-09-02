import { api } from '@/features/core/service/apiService'

import type { PerguntaConfig, SecaoConfig, TipoPergunta } from '../types/questionario'

type QuestionnaireVersion = {
	id: string
	questions: Array<QuestionnaireQuestion>
}

type QuestionnaireQuestion = {
	id: string
	section: string
	statement: string
	type: 'YES_NO' | 'MULTIPLE_CHOICE'
	options: Array<{ id: string; label: string; score: number }>
	visibleWhenQuestionId?: string | null
}

type PublishedQuestion = {
	id: string
	options: Array<{ id: string; label: string }>
}

type AnswerOptionPayload = {
	label: string
	score: number
	order: number
}

function questionType(tipo: string): 'YES_NO' | 'MULTIPLE_CHOICE' {
	return tipo === 'dicotomica' ? 'YES_NO' : 'MULTIPLE_CHOICE'
}

function configQuestionType(question: QuestionnaireQuestion): TipoPergunta {
	return question.type === 'YES_NO' ? 'dicotomica' : 'multipla'
}

function toConfigQuestion(question: QuestionnaireQuestion): PerguntaConfig {
	return {
		id: question.id,
		codigo: '',
		enunciado: question.statement,
		tipo: configQuestionType(question),
		opcoes: question.options.map((option) => ({
			id: option.id,
			texto: option.label,
			pontuavel: option.score !== 0,
			pontuacao: option.score,
		})),
	}
}

export async function getQuestionnaireConfiguration(): Promise<SecaoConfig[]> {
	const { data } = await api.get<QuestionnaireVersion>('/questionnaires/active')
	const questions = new Map(data.questions.map((question) => [question.id, toConfigQuestion(question)]))
	for (const question of data.questions) {
		if (!question.visibleWhenQuestionId) continue
		const parent = questions.get(question.visibleWhenQuestionId)
		const child = questions.get(question.id)
		if (!parent || !child) continue
		parent.tipo = 'dicotomica_complementar'
		parent.subPerguntas = [...(parent.subPerguntas ?? []), child]
	}
	const sections = new Map<string, SecaoConfig>()
	for (const question of data.questions) {
		if (question.visibleWhenQuestionId) continue
		const section = sections.get(question.section) ?? { id: question.section, nome: question.section, perguntas: [] }
		section.perguntas.push(questions.get(question.id)!)
		sections.set(question.section, section)
	}
	return [...sections.values()]
}

async function publishQuestions(versionId: string, secoes: SecaoConfig[]) {
	const published = new Map<string, PublishedQuestion>()
	for (const secao of secoes) {
		for (const [order, pergunta] of secao.perguntas.entries()) {
			await publishQuestion(versionId, secao.nome, pergunta, order, published)
		}
	}
}

async function publishQuestion(
	versionId: string,
	section: string,
	pergunta: SecaoConfig['perguntas'][number],
	order: number,
	published: Map<string, PublishedQuestion>,
	parent?: PublishedQuestion,
) {
	const selectedOption = parent?.options.find((option) => option.label.trim().toLowerCase() === 'sim')
	const { data } = await api.put<PublishedQuestion>(`/questionnaires/versions/${versionId}/questions`, {
		section: section.trim(),
		statement: pergunta.enunciado.trim(),
		type: questionType(pergunta.tipo),
		order,
		required: true,
		visibleWhenQuestionId: parent?.id,
		visibleWhenOptionId: selectedOption?.id,
		options: pergunta.opcoes.map<AnswerOptionPayload>((opcao, optionOrder) => ({
			label: opcao.texto.trim(),
			score: opcao.pontuavel ? (opcao.pontuacao ?? 0) : 0,
			order: optionOrder,
		})),
	})
	published.set(pergunta.id, data)
	for (const [childOrder, child] of (pergunta.subPerguntas ?? []).entries()) {
		await publishQuestion(versionId, section, child, childOrder, published, data)
	}
}

export async function publishQuestionnaire(secoes: SecaoConfig[]): Promise<void> {
	const active = await api.get<QuestionnaireVersion>('/questionnaires/active')
	const draft = await api.post<QuestionnaireVersion>('/questionnaires/versions', {
		cloneFromVersionId: active.data.id,
		reuseOpenDraft: true,
	})

	for (const question of draft.data.questions) {
		await api.delete(`/questionnaires/versions/${draft.data.id}/questions/${question.id}`)
	}


	await publishQuestions(draft.data.id, secoes)

	await api.post(`/questionnaires/versions/${draft.data.id}/publish`, {})
}
