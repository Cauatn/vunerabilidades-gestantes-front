import { GripVertical, Trash2 } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import type { QuestionnaireConfig } from '@/features/instrumentos/composables/useQuestionnaireConfig'
import type { DragHandle } from '@/features/instrumentos/components/SortableItem'
import type { AnswerOption } from '@/features/instrumentos/types/questionnaire'

import { ScorableField } from './ScorableField'

interface AnswerOptionRowProps {
	questionId: string
	option: AnswerOption
	total: number
	config: QuestionnaireConfig
	dragHandle: DragHandle
	onRemover: () => void
}

export function AnswerOptionRow({
	questionId,
	option,
	total,
	config,
	dragHandle,
	onRemover,
}: AnswerOptionRowProps) {
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
				value={option.text}
				placeholder="Opção de resposta"
				onChange={(e) =>
					config.updateOption(questionId, option.id, {
						text: e.target.value,
					})
				}
			/>

			<ScorableField
				scorable={option.scorable}
				score={option.score}
				onToggleScorable={(next) =>
					config.updateOption(questionId, option.id, {
						scorable: next,
						score: next ? option.score : null,
					})
				}
				onScoreChange={(v) =>
					config.updateOption(questionId, option.id, {
						score: v,
					})
				}
			/>

			<IconButton
				icon={Trash2}
				variant="danger"
				tooltipText="Remover opção"
				disabled={total <= 1}
				onClick={onRemover}
			/>
		</div>
	)
}
