import { GripHorizontal, X } from 'lucide-react'

import type { QuestionnaireConfig } from '@/features/instrumentos/composables/useQuestionnaireConfig'
import type { DragHandle } from '@/features/instrumentos/components/SortableItem'
import type { SectionConfig } from '@/features/instrumentos/types/questionnaire'
import { cn } from '@/lib/utils'

interface SectionChipProps {
	section: SectionConfig
	numero: number
	active: boolean
	canRemove: boolean
	config: QuestionnaireConfig
	dragHandle: DragHandle
	onRemover: () => void
}

export function SectionChip({
	section,
	numero,
	active,
	canRemove,
	config,
	dragHandle,
	onRemover,
}: SectionChipProps) {
	return (
		<div
			className={cn(
				'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
				active
					? 'border-(--color-t-300) bg-t-100 font-semibold text-t-600'
					: 'border-n-40 text-n-700',
			)}
		>
			<button
				type="button"
				className="cursor-grab active:cursor-grabbing"
				{...dragHandle.attributes}
				{...dragHandle.listeners}
			>
				<GripHorizontal className="size-4 opacity-60" />
			</button>

			<span className="opacity-60">{numero}.</span>

			{active ? (
				<>
					<input
						value={section.name}
						onChange={(e) =>
							config.renameSection(section.id, e.target.value)
						}
						className="w-[220px] max-w-[38vw] bg-transparent font-semibold outline-none"
					/>
					{canRemove ? (
						<button
							type="button"
							aria-label="Remover seção"
							onClick={onRemover}
							className="opacity-70 hover:opacity-100"
						>
							<X className="size-3.5" />
						</button>
					) : null}
				</>
			) : (
				<button
					type="button"
					onClick={() => config.selectSection(section.id)}
				>
					{section.name || 'Sem nome'}
				</button>
			)}
		</div>
	)
}
