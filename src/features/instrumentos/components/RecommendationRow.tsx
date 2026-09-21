import { GripVertical, Trash2 } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'

import type { DragHandle } from './SortableItem'
import type { ScaleConfig } from '../composables/useScaleConfig'
import type { RecommendationConfig } from '../types/scale'

interface RecommendationRowProps {
	levelId: string
	recommendation: RecommendationConfig
	config: ScaleConfig
	dragHandle: DragHandle
	onRemover: () => void
}

export function RecommendationRow({
	levelId,
	recommendation,
	config,
	dragHandle,
	onRemover,
}: RecommendationRowProps) {
	return (
		<div className="flex items-center gap-3">
			<button
				type="button"
				className="shrink-0 cursor-grab text-n-400 active:cursor-grabbing"
				{...dragHandle.attributes}
				{...dragHandle.listeners}
			>
				<GripVertical className="size-5" />
			</button>
			<Input
				className="flex-1"
				value={recommendation.text}
				placeholder="Recomendação sugerida"
				onChange={(e) =>
					config.updateRecommendation(
						levelId,
						recommendation.id,
						e.target.value,
					)
				}
			/>
			<IconButton
				icon={Trash2}
				variant="danger"
				tooltipText="Remover recomendação"
				onClick={onRemover}
			/>
		</div>
	)
}
