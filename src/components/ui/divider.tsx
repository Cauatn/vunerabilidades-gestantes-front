import { Separator } from '@/components/ui/separator'

interface DividerProps {
	text: string
}

export function Divider({ text }: DividerProps) {
	return (
		<div className="flex w-full min-w-0 items-center gap-2 text-xs font-semibold text-n-400">
			<span className="min-w-0 truncate">{text}</span>
			<Separator className="flex-1" />
		</div>
	)
}
