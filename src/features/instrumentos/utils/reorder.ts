import { arrayMove } from '@dnd-kit/sortable'

export function reorderById<T extends { id: string }>(list: T[], activeId: string, overId: string): T[] {
	const from = list.findIndex((item) => item.id === activeId)
	const to = list.findIndex((item) => item.id === overId)
	if (from === -1 || to === -1 || from === to) return list
	return arrayMove(list, from, to)
}
