import { api } from '@/features/core/service/apiService'
import type { QuestionnaireVersionApi, ReplaceQuestionsPayload } from '@/features/instrumentos/types/questionnaireApi'

export const getActiveQuestionnaire = () => api.get<QuestionnaireVersionApi>('/questionnaires/active')

export const createQuestionnaireDraft = (cloneFromVersionId: string) =>
	api.post<QuestionnaireVersionApi>('/questionnaires/versions', { cloneFromVersionId, reuseOpenDraft: true })

export const replaceQuestions = (versionId: string, payload: ReplaceQuestionsPayload) =>
	api.put<QuestionnaireVersionApi>(`/questionnaires/versions/${versionId}/questions/bulk`, payload)

export const publishQuestionnaireVersion = (versionId: string) =>
	api.post<QuestionnaireVersionApi>(`/questionnaires/versions/${versionId}/publish`, {})
