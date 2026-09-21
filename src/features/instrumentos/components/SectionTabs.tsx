import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import {
	SortableContext,
	horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { QuestionnaireConfig } from '@/features/instrumentos/composables/useQuestionnaireConfig'
import { SortableItem } from '@/features/instrumentos/components/SortableItem'

import { SectionChip } from './SectionChip'

interface SectionTabsProps {
	config: QuestionnaireConfig
	onRemoveSection: (id: string) => void
}

export function SectionTabs({ config, onRemoveSection }: SectionTabsProps) {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
	)
	const ids = config.sections.map((section) => section.id)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		config.reorderSections(String(active.id), String(over.id))
	}

	return (
		<div className="flex flex-wrap items-center gap-2.5">
			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<SortableContext
					items={ids}
					strategy={horizontalListSortingStrategy}
				>
					{config.sections.map((s, i) => (
						<SortableItem key={s.id} id={s.id}>
							{(h) => (
								<SectionChip
									section={s}
									numero={i + 1}
									active={s.id === config.activeSectionId}
									canRemove={config.sections.length > 1}
									config={config}
									dragHandle={h}
									onRemover={() => onRemoveSection(s.id)}
								/>
							)}
						</SortableItem>
					))}
				</SortableContext>
			</DndContext>

			<Button type="button" size="sm" onClick={config.addSection}>
				<Plus />
				Adicionar seção
			</Button>
		</div>
	)
}
