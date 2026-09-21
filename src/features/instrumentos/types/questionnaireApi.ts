import type { VulnerabilityBand } from '@/features/instrumentos/types/scale'

export type QuestionApiType = 'YES_NO' | 'MULTIPLE_CHOICE'

export interface AnswerOptionApi {
	id: string
	label: string
	score: number
	order: number
}

export interface QuestionApi {
	id: string
	section: string
	statement: string
	type: QuestionApiType
	order: number
	required: boolean
	options: AnswerOptionApi[]
	visibleWhenQuestionId?: string | null
	visibleWhenOptionId?: string | null
}

export interface QuestionnaireVersionApi {
	id: string
	versionNumber: number
	questions: QuestionApi[]
	vulnerabilityBands: VulnerabilityBand[]
}

export interface ReplaceAnswerOptionPayload {
	optionId?: string
	clientId: string
	label: string
	score: number
	order: number
}

export interface ReplaceQuestionPayload {
	questionId?: string
	clientId: string
	section: string
	statement: string
	type: QuestionApiType
	order: number
	required: boolean
	options: ReplaceAnswerOptionPayload[]
	visibleWhenClientId?: string
	visibleWhenOptionClientId?: string
}

export interface ReplaceQuestionsPayload {
	questions: ReplaceQuestionPayload[]
}

export interface ReplaceRecommendationPayload {
	recommendationId?: string
	text: string
	order: number
}

export interface ReplaceVulnerabilityBandPayload {
	bandId?: string
	level: string
	color: string
	minScore: number
	maxScore: number
	order: number
	recommendations: ReplaceRecommendationPayload[]
}

export interface ReplaceVulnerabilityBandsPayload {
	bands: ReplaceVulnerabilityBandPayload[]
}
