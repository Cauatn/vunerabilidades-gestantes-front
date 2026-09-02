export type QuestionType = 'MULTIPLE_CHOICE' | 'YES_NO'

export type QuestionnaireStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface AnswerOption {
	id: string
	label: string
	score: number
	order: number
}

export interface Question {
	id: string
	section: string
	statement: string
	type: QuestionType
	order: number
	required: boolean
	options: AnswerOption[]
	visibleWhenQuestionId?: string | null
	visibleWhenOptionId?: string | null
}

export interface BandRecommendation {
	id: string
	text: string
	order: number
}

export interface VulnerabilityBand {
	id: string
	level: string
	minScore: number
	maxScore: number
	order: number
	recommendations: BandRecommendation[]
}

export interface QuestionnaireVersion {
	id: string
	versionNumber: number
	status: QuestionnaireStatus
	effectiveFrom: string | null
	createdByUserId: string
	questions: Question[]
	vulnerabilityBands: VulnerabilityBand[]
	createdAt: string
	updatedAt: string
}

export interface CreateVersionPayload {
	cloneFromVersionId?: string
	reuseOpenDraft?: boolean
}

export interface UpsertQuestionPayload {
	questionId?: string
	section: string
	statement: string
	type: QuestionType
	order: number
	required: boolean
	visibleWhenQuestionId?: string
	visibleWhenOptionId?: string
	options: { id?: string; label: string; score: number; order: number }[]
}

export interface ReorderQuestionsPayload {
	questions: { questionId: string; section: string; order: number }[]
}

export interface UpsertBandPayload {
	bandId?: string
	level: string
	minScore: number
	maxScore: number
	order: number
}

export interface UpsertBandRecommendationPayload {
	recommendationId?: string
	text: string
	order: number
}

export interface PublishVersionPayload {
	effectiveFrom?: string
}
