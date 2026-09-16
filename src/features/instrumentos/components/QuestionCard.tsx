import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { GripVertical, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { QuestionnaireConfig } from '@/features/instrumentos/composables/useQuestionnaireConfig'
import { DashedAddButton } from '@/features/instrumentos/components/DashedAddButton'
import { FieldLabel } from '@/features/instrumentos/components/FieldLabel'
import {
	SortableItem,
	type DragHandle,
} from '@/features/instrumentos/components/SortableItem'
import {
	CONDITIONAL_QUESTION_TYPE,
	QUESTION_TYPE_LABEL,
	QUESTION_TYPE_OPTIONS,
} from '@/features/instrumentos/constants'
import type {
	QuestionConfig,
	QuestionType,
} from '@/features/instrumentos/types/questionnaire'

import { AnswerOptionRow } from './AnswerOptionRow'

interface QuestionCardProps {
	question: QuestionConfig
	config: QuestionnaireConfig
	conditional?: boolean
	dragHandle?: DragHandle
	onRemoveQuestion: (id: string) => void
	onRemoveOption: (questionId: string, optionId: string) => void
}

export function QuestionCard({
	question,
	config,
	conditional,
	dragHandle,
	onRemoveQuestion,
	onRemoveOption,
}: QuestionCardProps) {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
	)
	const optionIds = question.options.map((option) => option.id)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		config.reorderOptions(question.id, String(active.id), String(over.id))
	}

	return (
		<div className="overflow-hidden rounded-xl border border-n-40 bg-n-0">
			<div className="flex items-center justify-between gap-4 border-b border-n-40 p-4">
				<div className="flex items-center gap-2">
					{dragHandle ? (
						<button
							type="button"
							className="shrink-0 cursor-grab text-n-400 active:cursor-grabbing"
							{...dragHandle.attributes}
							{...dragHandle.listeners}
						>
							<GripVertical className="size-5" />
						</button>
					) : null}
					<span className="line-clamp-1 text-sm text-n-900">
						{question.statement || 'Nova pergunta'}
					</span>
				</div>

				<div className="flex items-center gap-3">
					{conditional ? (
						<Badge variant="orange">Condicional</Badge>
					) : null}
					<Badge variant="blue">
						{QUESTION_TYPE_LABEL[question.type]}
					</Badge>
					<IconButton
						icon={Trash2}
						variant="danger"
						tooltipText="Remover pergunta"
						onClick={() => onRemoveQuestion(question.id)}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2.5 p-4">
				<Divider text="Dados da pergunta" />

				<div>
					<FieldLabel required>Enunciado</FieldLabel>
					<Input
						value={question.statement}
						onChange={(e) =>
							config.updateFields(question.id, {
								statement: e.target.value,
							})
						}
					/>
				</div>

				<div>
					<FieldLabel required>Tipo da pergunta</FieldLabel>
					<Select
						value={question.type}
						onValueChange={(v) =>
							config.updateFields(question.id, {
								type: v as QuestionType,
							})
						}
					>
						<SelectTrigger className="w-full max-w-126">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{QUESTION_TYPE_OPTIONS.map((t) => (
								<SelectItem key={t} value={t}>
									{QUESTION_TYPE_LABEL[t]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Divider text="Opções de resposta" />

				<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext
						items={optionIds}
						strategy={verticalListSortingStrategy}
					>
						<div className="flex flex-col gap-2.5">
							{question.options.map((option) => (
								<SortableItem key={option.id} id={option.id}>
									{(h) => (
										<AnswerOptionRow
											questionId={question.id}
											option={option}
											total={question.options.length}
											config={config}
											dragHandle={h}
											onRemover={() =>
												onRemoveOption(
													question.id,
													option.id,
												)
											}
										/>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DndContext>

				<DashedAddButton
					label="Adicionar opção"
					onClick={() => config.addOption(question.id)}
				/>

				{question.type === CONDITIONAL_QUESTION_TYPE ? (
					<>
						<Divider text="Se sim" />
						<div className="flex gap-3 pl-5">
							<div className="w-0.5 shrink-0 self-stretch rounded bg-o-400" />
							<div className="flex flex-1 flex-col gap-3">
								{(question.subQuestions ?? []).map((sub) => (
									<QuestionCard
										key={sub.id}
										question={sub}
										config={config}
										conditional
										onRemoveQuestion={onRemoveQuestion}
										onRemoveOption={onRemoveOption}
									/>
								))}
								<DashedAddButton
									tone="orange"
									label="Adicionar pergunta"
									onClick={() =>
										config.addSubQuestion(question.id)
									}
								/>
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	)
}
