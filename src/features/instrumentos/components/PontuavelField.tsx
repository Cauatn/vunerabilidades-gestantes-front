import { Check } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface PontuavelFieldProps {
	pontuavel: boolean
	pontuacao: number | null
	onTogglePontuavel: (next: boolean) => void
	onPontuacaoChange: (v: number | null) => void
}

export function PontuavelField({
	pontuavel,
	pontuacao,
	onTogglePontuavel,
	onPontuacaoChange,
}: PontuavelFieldProps) {
	return (
		<>
			<button
				type="button"
				onClick={() => onTogglePontuavel(!pontuavel)}
				className="flex shrink-0 items-center gap-2"
			>
				<span
					className={cn(
						'flex size-4 items-center justify-center rounded-[4px] border',
						pontuavel
							? 'border-(--color-t-500) bg-t-400 text-white'
							: 'border-n-200 bg-n-0',
					)}
				>
					{pontuavel ? <Check className="size-3" strokeWidth={3} /> : null}
				</span>
				<span className="text-sm font-semibold text-n-700">Pontuável</span>
			</button>

			{pontuavel ? (
				<Input
					type="number"
					className="w-[88px] shrink-0"
					value={pontuacao ?? ''}
					onChange={(e) =>
						onPontuacaoChange(e.target.value === '' ? null : Number(e.target.value))
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
