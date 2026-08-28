import type { DraggableAttributes } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type DragHandle = {
	attributes: DraggableAttributes
	listeners: ReturnType<typeof useSortable>['listeners']
}

interface SortableItemProps {
	id: string
	className?: string
	children: (handle: DragHandle) => ReactNode
}

export function SortableItem({ id, className, children }: SortableItemProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn(isDragging && 'relative z-10 opacity-80', className)}
		>
			{children({ attributes, listeners })}
		</div>
	)
}
