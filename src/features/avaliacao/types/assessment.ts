import type { Gestante } from '@/features/gestantes/types/gestante'
import type { Paginated, PaginationParams } from '@/features/core/types/pagination'
import type {
	QuestionnaireVersion,
	VulnerabilityBand,
} from '@/features/instrumentos/types/questionnaire'

export interface QuestionnaireSnapshot {
	questionnaireVersionId: string
	versionNumber: number
	capturedAt: string
	questions: QuestionnaireVersion['questions']
	vulnerabilityBands: VulnerabilityBand[]
}

export interface AssessmentAnswer {
	id: string
	questionId: string
	questionStatement: string
	optionId: string
	optionLabel: string
	score: number
}

export interface AssessmentResult {
	totalScore: number
	vulnerabilityLevel: string
	vulnerabilityBandId: string
	calculatedAt: string
}

export interface AppliedRecommendation {
	id: string
	text: string
	order: number
	fromSnapshot: boolean
}

export interface Assessment {
	id: string
	patientId: string
	appliedByUserId: string
	healthUnitId: string
	appliedAt: string
	snapshot: QuestionnaireSnapshot
	answers: AssessmentAnswer[]
	result: AssessmentResult
	recommendations: AppliedRecommendation[]
	createdAt: string
	updatedAt: string
}

export interface StartAssessmentPayload {
	patientId: string
	healthUnitId: string
}

export interface StartAssessmentResponse {
	patient: Gestante
	questionnaire: QuestionnaireVersion
}

export interface SubmitAssessmentPayload {
	patientId: string
	healthUnitId: string
	answers: { questionId: string; optionId: string }[]
}

export interface UpdateRecommendationsPayload {
	recommendations: { id?: string; text: string; order: number }[]
}

export type PatientHistoryParams = PaginationParams

export interface PatientHistoryResponse {
	patient: Gestante
	assessments: Paginated<Assessment>
}
