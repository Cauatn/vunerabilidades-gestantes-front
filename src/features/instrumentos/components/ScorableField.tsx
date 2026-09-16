import { Check } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface ScorableFieldProps {
	scorable: boolean
	score: number | null
	onToggleScorable: (next: boolean) => void
	onScoreChange: (v: number | null) => void
}

export function ScorableField({
	scorable,
	score,
	onToggleScorable,
	onScoreChange,
}: ScorableFieldProps) {
	return (
		<>
			<button
				type="button"
				onClick={() => onToggleScorable(!scorable)}
				className="flex shrink-0 items-center gap-2"
			>
				<span
					className={cn(
						'flex size-4 items-center justify-center rounded-[4px] border',
						scorable
							? 'border-(--color-t-500) bg-t-400 text-white'
							: 'border-n-200 bg-n-0',
					)}
				>
					{scorable ? (
						<Check className="size-3" strokeWidth={3} />
					) : null}
				</span>
				<span className="text-sm font-semibold text-n-700">
					Pontuável
				</span>
			</button>

			{scorable ? (
				<Input
					type="number"
					className="w-[88px] shrink-0"
					value={score ?? ''}
					onChange={(e) =>
						onScoreChange(
							e.target.value === ''
								? null
								: Number(e.target.value),
						)
					}
				/>
			) : (
				<Input
					type="number"
					className="w-[88px] shrink-0"
					disabled
					value=""
					placeholder="Não pontua"
				/>
			)}
		</>
	)
}
