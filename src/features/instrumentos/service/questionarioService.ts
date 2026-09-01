import { api } from '@/features/core/service/apiService'

import type { SecaoConfig } from '../types/questionario'

type QuestionnaireVersion = {
	id: string
	questions: Array<{ id: string }>
}

type AnswerOptionPayload = {
	label: string
	score: number
	order: number
}

function questionType(tipo: string): 'YES_NO' | 'MULTIPLE_CHOICE' {
	return tipo === 'dicotomica' ? 'YES_NO' : 'MULTIPLE_CHOICE'
}

function flattenQuestions(secoes: SecaoConfig[]) {
	return secoes.flatMap((secao) =>
		secao.perguntas.map((pergunta, order) => ({
			section: secao.nome.trim(),
			statement: pergunta.enunciado.trim(),
			type: questionType(pergunta.tipo),
			order,
			required: true,
			options: pergunta.opcoes.map<AnswerOptionPayload>((opcao, optionOrder) => ({
				label: opcao.texto.trim(),
				score: opcao.pontuavel ? (opcao.pontuacao ?? 0) : 0,
				order: optionOrder,
			})),
		})),
	)
}

export async function publishQuestionnaire(secoes: SecaoConfig[]): Promise<void> {
	if (secoes.some((secao) => secao.perguntas.some((pergunta) => pergunta.subPerguntas?.length))) {
		throw new Error('Perguntas condicionais ainda não podem ser publicadas. Elas serão incluídas na próxima etapa da HU007.')
	}

	const active = await api.get<QuestionnaireVersion>('/questionnaires/active')
	const draft = await api.post<QuestionnaireVersion>('/questionnaires/versions', {
		cloneFromVersionId: active.data.id,
	})

	await Promise.all(
		draft.data.questions.map((question) =>
			api.delete(`/questionnaires/versions/${draft.data.id}/questions/${question.id}`),
		),
	)

	for (const question of flattenQuestions(secoes)) {
		await api.put(`/questionnaires/versions/${draft.data.id}/questions`, question)
	}

	await api.post(`/questionnaires/versions/${draft.data.id}/publish`, {})
}
