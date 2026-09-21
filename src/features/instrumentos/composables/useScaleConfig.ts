import { useMemo, useState } from 'react'

import { DEFAULT_LEVEL_COLOR } from '../constants'
import { INITIAL_SCALE_LEVELS } from '../data/mock'
import type {
	LevelConfig,
	RecommendationConfig,
	ScaleLimits,
	ScaleValidation,
} from '../types/scale'
import { reorderById } from '../utils/reorder'

const INITIAL_LIMITS: ScaleLimits = { min: 0, max: 60 }

function newRecommendation(): RecommendationConfig {
	return { id: crypto.randomUUID(), text: '' }
}

function validate(limits: ScaleLimits, levels: LevelConfig[]): ScaleValidation {
	const general: string[] = []
	const byLevel: Record<string, string> = {}
	const sorted = [...levels].sort((a, b) => a.min - b.min)

	sorted.forEach((level, index) => {
		if (level.min > level.max) {
			byLevel[level.id] =
				'A pontuação mínima não pode ser maior que a máxima.'
			return
		}
		if (index === 0) return
		const previous = sorted[index - 1]
		if (level.min <= previous.max) {
			byLevel[level.id] = 'Este intervalo se sobrepõe ao grau anterior.'
		} else if (level.min > previous.max + 1) {
			byLevel[level.id] =
				'Há uma lacuna de pontuação entre este grau e o anterior.'
		}
	})

	if (sorted.length > 0) {
		if (sorted[0].min !== limits.min) {
			general.push(
				'O primeiro grau deve começar na pontuação mínima da escala.',
			)
		}
		if (sorted[sorted.length - 1].max !== limits.max) {
			general.push(
				'O último grau deve terminar na pontuação máxima da escala.',
			)
		}
	}

	if (Object.keys(byLevel).length > 0) {
		general.unshift(
			'Existem intervalos com sobreposição ou lacunas entre os graus de vulnerabilidade.',
		)
	}

	return { general, byLevel }
}

export function useScaleConfig() {
	const [limits, setLimits] = useState<ScaleLimits>(INITIAL_LIMITS)
	const [levels, setLevels] = useState<LevelConfig[]>(INITIAL_SCALE_LEVELS)

	const validation = useMemo(() => validate(limits, levels), [limits, levels])

	function mapLevel(id: string, fn: (level: LevelConfig) => LevelConfig) {
		setLevels((current) =>
			current.map((level) => (level.id === id ? fn(level) : level)),
		)
	}

	return {
		limits,
		levels,
		validation,

		replaceScale(next: { limits: ScaleLimits; levels: LevelConfig[] }) {
			setLimits(next.limits)
			setLevels(next.levels)
		},

		updateLimit(field: keyof ScaleLimits, value: number) {
			setLimits((current) => ({ ...current, [field]: value }))
		},
		useSuggestedScore(value: number) {
			setLimits((current) => ({ ...current, max: value }))
		},

		addLevel() {
			setLevels((current) => [
				...current,
				{
					id: crypto.randomUUID(),
					name: `Novo grau ${current.length + 1}`,
					color: DEFAULT_LEVEL_COLOR,
					min: limits.min,
					max: limits.min,
					recommendations: [],
				},
			])
		},
		removeLevel(id: string) {
			setLevels((current) => current.filter((level) => level.id !== id))
		},
		updateLevel(id: string, patch: Partial<LevelConfig>) {
			mapLevel(id, (level) => ({ ...level, ...patch }))
		},
		reorderLevels(activeId: string, overId: string) {
			setLevels((current) => reorderById(current, activeId, overId))
		},

		addRecommendation(levelId: string) {
			mapLevel(levelId, (level) => ({
				...level,
				recommendations: [
					...level.recommendations,
					newRecommendation(),
				],
			}))
		},
		removeRecommendation(levelId: string, recommendationId: string) {
			mapLevel(levelId, (level) => ({
				...level,
				recommendations: level.recommendations.filter(
					(item) => item.id !== recommendationId,
				),
			}))
		},
		updateRecommendation(
			levelId: string,
			recommendationId: string,
			text: string,
		) {
			mapLevel(levelId, (level) => ({
				...level,
				recommendations: level.recommendations.map((item) =>
					item.id === recommendationId ? { ...item, text } : item,
				),
			}))
		},
		reorderRecommendations(
			levelId: string,
			activeId: string,
			overId: string,
		) {
			mapLevel(levelId, (level) => ({
				...level,
				recommendations: reorderById(
					level.recommendations,
					activeId,
					overId,
				),
			}))
		},
	}
}

export type ScaleConfig = ReturnType<typeof useScaleConfig>
