export interface RecommendationConfig {
	id: string
	text: string
}

export interface LevelConfig {
	id: string
	name: string
	/** cor em hex, escolhida na paleta do color picker */
	color: string
	min: number
	max: number
	recommendations: RecommendationConfig[]
}

export interface ScaleLimits {
	min: number
	max: number
}

export interface ScaleValidation {
	general: string[]
	byLevel: Record<string, string>
}

interface VulnerabilityBandRecommendation {
	id: string
	text: string
	order: number
}

export interface VulnerabilityBand {
	id: string
	level: string
	color: string
	minScore: number
	maxScore: number
	order: number
	recommendations: VulnerabilityBandRecommendation[]
}
