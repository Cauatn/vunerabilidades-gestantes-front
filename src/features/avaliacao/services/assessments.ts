import { api } from '@/features/core/service/apiService'
import type {
	Assessment,
	PatientHistoryParams,
	PatientHistoryResponse,
	StartAssessmentPayload,
	StartAssessmentResponse,
	SubmitAssessmentPayload,
	UpdateRecommendationsPayload,
} from '@/features/avaliacao/types/assessment'

export const startAssessment = (payload: StartAssessmentPayload) =>
	api.post<StartAssessmentResponse>('/assessments/start', payload)

export const submitAssessment = (payload: SubmitAssessmentPayload) =>
	api.post<Assessment>('/assessments', payload)

export const getAssessment = (id: string) => api.get<Assessment>(`/assessments/${id}`)

export const updateAssessmentRecommendations = (id: string, payload: UpdateRecommendationsPayload) =>
	api.put<Assessment>(`/assessments/${id}/recommendations`, payload)

export const getPatientHistory = (patientId: string, params: PatientHistoryParams) =>
	api.get<PatientHistoryResponse>(`/patients/${patientId}/assessments`, { params })
