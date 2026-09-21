import { Input } from '@/components/ui/input'

import { FieldLabel } from './FieldLabel'

interface LimitsRangeProps {
	min: number
	max: number
	onMinChange: (value: number) => void
	onMaxChange: (value: number) => void
	idPrefix: string
}

export function LimitsRange({
	min,
	max,
	onMinChange,
	onMaxChange,
	idPrefix,
}: LimitsRangeProps) {
	return (
		<div className="flex items-end gap-2.5">
			<div className="flex-1 space-y-2">
				<FieldLabel htmlFor={`${idPrefix}-min`} required>
					Pontuação mínima
				</FieldLabel>
				<Input
					id={`${idPrefix}-min`}
					type="number"
					value={Number.isNaN(min) ? '' : min}
					onChange={(event) =>
						onMinChange(Number(event.target.value))
					}
				/>
			</div>
			<span className="mb-5 h-0.5 w-5 shrink-0 rounded bg-n-40" />
			<div className="flex-1 space-y-2">
				<FieldLabel htmlFor={`${idPrefix}-max`} required>
					Pontuação máxima
				</FieldLabel>
				<Input
					id={`${idPrefix}-max`}
					type="number"
					value={Number.isNaN(max) ? '' : max}
					onChange={(event) =>
						onMaxChange(Number(event.target.value))
					}
				/>
			</div>
		</div>
	)
}
