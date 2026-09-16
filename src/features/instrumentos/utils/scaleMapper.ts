import type {
	LevelConfig,
	ScaleLimits,
} from '@/features/instrumentos/types/scale'
import type {
	QuestionnaireVersionApi,
	ReplaceVulnerabilityBandsPayload,
} from '@/features/instrumentos/types/questionnaireApi'

export function toScale(version: QuestionnaireVersionApi): {
	limits: ScaleLimits
	levels: LevelConfig[]
} {
	const bands = [...version.vulnerabilityBands].sort(
		(a, b) => a.order - b.order,
	)

	const levels: LevelConfig[] = bands.map((band) => ({
		id: band.id,
		name: band.level,
		color: band.color,
		min: band.minScore,
		max: band.maxScore,
		recommendations: band.recommendations.map((recommendation) => ({
			id: recommendation.id,
			text: recommendation.text,
		})),
	}))

	const limits: ScaleLimits = {
		min: bands[0]?.minScore ?? 0,
		max: bands[bands.length - 1]?.maxScore ?? 0,
	}

	return { limits, levels }
}

export function toReplaceVulnerabilityBandsPayload(
	levels: LevelConfig[],
): ReplaceVulnerabilityBandsPayload {
	return {
		bands: levels.map((level, order) => ({
			level: level.name.trim(),
			color: level.color,
			minScore: level.min,
			maxScore: level.max,
			order,
			recommendations: level.recommendations.map(
				(recommendation, recommendationOrder) => ({
					text: recommendation.text.trim(),
					order: recommendationOrder,
				}),
			),
		})),
	}
}
