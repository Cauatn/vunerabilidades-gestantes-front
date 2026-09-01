import { api } from '@/features/core/service/apiService'

export type AssessmentQuestion = {
	id: string
	section: string
	statement: string
	required: boolean
	options: Array<{ id: string; label: string; score: number }>
}

export type Assessment = {
	id: string
	patientId: string
	appliedAt: string
	result: {
		totalScore?: number
		vulnerabilityLevel?: string
		props?: { totalScore: number; vulnerabilityLevel: string }
	}
	recommendations: Array<{ id: string; text: string; order: number }>
	answers: Array<{ id: string; questionStatement: string; optionLabel: string; score: number }>
}

export const startAssessment = (payload: { patientId: string; healthUnitId: string }) =>
	api.post<{ questionnaire: { questions: AssessmentQuestion[] } }>('/assessments/start', payload)

export const submitAssessment = (payload: {
	patientId: string
	healthUnitId: string
	answers: Array<{ questionId: string; optionId: string }>
}) => api.post<Assessment>('/assessments', payload)

export const getAssessment = (id: string) => api.get<Assessment>(`/assessments/${id}`)

export const updateAssessmentRecommendations = (
	id: string,
	recommendations: Array<{ id?: string; text: string; order: number }>,
) => api.put<Assessment>(`/assessments/${id}/recommendations`, { recommendations })

export const getPatientAssessments = (patientId: string, params = { page: 1, pageSize: 20 }) =>
	api.get<{ assessments: { items: Assessment[]; total: number; page: number; pageSize: number } }>(
		`/patients/${patientId}/assessments`,
		{ params },
	)

export function assessmentResult(result: Assessment['result']) {
	return result.props ?? result
}
