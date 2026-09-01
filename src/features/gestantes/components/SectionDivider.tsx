type Props = {
	label: string
}

export function SectionDivider({ label }: Props) {
	return (
		<div className="flex w-full items-center gap-2">
			<span className="text-xs font-semibold tracking-[0.15px] whitespace-nowrap text-n-400">
				{label}
			</span>
			<span className="h-px flex-1 rounded-[3px] bg-n-400" />
		</div>
	)
}
