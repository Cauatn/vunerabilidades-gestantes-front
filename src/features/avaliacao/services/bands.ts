import { api } from '@/features/core/service/apiService'

export interface Recommendation {
	id: string
	text: string
}

export interface VulnerabilityBand {
	id: string
	slug: string
	level: string
	color: string
	minScore: number
	maxScore: number
	order: number
	recommendations: Recommendation[]
}

export const getVulnerabilityBands = () =>
	api.get<VulnerabilityBand[]>('/questionnaires/bands/history')
