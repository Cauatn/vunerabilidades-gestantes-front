import { api } from '@/features/core/service/apiService'

import type { SecaoConfig } from '../types/questionario'

type QuestionnaireVersion = {
	id: string
	questions: Array<{ id: string }>
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
	})

	await Promise.all(
		draft.data.questions.map((question) =>
			api.delete(`/questionnaires/versions/${draft.data.id}/questions/${question.id}`),
		),
	)


	await publishQuestions(draft.data.id, secoes)

	await api.post(`/questionnaires/versions/${draft.data.id}/publish`, {})
}
