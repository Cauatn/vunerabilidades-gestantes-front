import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { QuestionarioConfig } from '@/features/instrumentos/composables/useQuestionarioConfig'
import { SortableItem } from '@/features/instrumentos/components/SortableItem'

import { SecaoChip } from './SecaoChip'

interface SecaoTabsProps {
	config: QuestionarioConfig
	onRemoverSecao: (id: string) => void
}

export function SecaoTabs({ config, onRemoverSecao }: SecaoTabsProps) {
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const ids = config.secoes.map((secao) => secao.id)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		config.reordenarSecoes(String(active.id), String(over.id))
	}

	return (
		<div className="flex flex-wrap items-center gap-2.5">
			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<SortableContext items={ids} strategy={horizontalListSortingStrategy}>
					{config.secoes.map((s, i) => (
						<SortableItem key={s.id} id={s.id}>
							{(h) => (
								<SecaoChip
									secao={s}
									numero={i + 1}
									ativa={s.id === config.secaoAtivaId}
									podeRemover={config.secoes.length > 1}
									config={config}
									dragHandle={h}
									onRemover={() => onRemoverSecao(s.id)}
								/>
							)}
						</SortableItem>
					))}
				</SortableContext>
			</DndContext>

			<Button type="button" size="sm" onClick={config.addSecao}>
				<Plus />
				Adicionar seção
			</Button>
		</div>
	)
}
