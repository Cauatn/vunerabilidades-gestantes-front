import { api } from '@/features/core/service/apiService'
import type {
	CreateVersionPayload,
	PublishVersionPayload,
	QuestionnaireVersion,
	ReorderQuestionsPayload,
	UpsertBandPayload,
	UpsertBandRecommendationPayload,
	UpsertQuestionPayload,
} from '@/features/instrumentos/types/questionnaire'

export const getActiveQuestionnaire = () =>
	api.get<QuestionnaireVersion>('/questionnaires/active')

export const createQuestionnaireVersion = (payload: CreateVersionPayload) =>
	api.post<QuestionnaireVersion>('/questionnaires/versions', payload)

export const publishQuestionnaireVersion = (versionId: string, payload: PublishVersionPayload) =>
	api.post<QuestionnaireVersion>(`/questionnaires/versions/${versionId}/publish`, payload)

export const upsertQuestion = (versionId: string, payload: UpsertQuestionPayload) =>
	api.put<QuestionnaireVersion>(`/questionnaires/versions/${versionId}/questions`, payload)

export const removeQuestion = (versionId: string, questionId: string) =>
	api.delete<void>(`/questionnaires/versions/${versionId}/questions/${questionId}`)

export const reorderQuestions = (versionId: string, payload: ReorderQuestionsPayload) =>
	api.put<QuestionnaireVersion>(`/questionnaires/versions/${versionId}/questions/order`, payload)

export const upsertBand = (versionId: string, payload: UpsertBandPayload) =>
	api.put<QuestionnaireVersion>(`/questionnaires/versions/${versionId}/bands`, payload)

export const upsertBandRecommendation = (
	versionId: string,
	bandId: string,
	payload: UpsertBandRecommendationPayload,
) =>
	api.put<QuestionnaireVersion>(
		`/questionnaires/versions/${versionId}/bands/${bandId}/recommendations`,
		payload,
	)
