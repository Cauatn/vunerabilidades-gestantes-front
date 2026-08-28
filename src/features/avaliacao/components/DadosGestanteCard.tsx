import { PregnantIcon } from '@/features/avaliacao/components/icons'
import type { DadosGestante } from '@/features/avaliacao/types/historico'
import { formatarDataBr } from '@/features/core/utils/date'

interface DadosGestanteCardProps {
	gestante: DadosGestante
}

export function DadosGestanteCard({ gestante }: DadosGestanteCardProps) {
	return (
		<div className="flex w-full items-center gap-5 rounded-xl border border-p-200 bg-p-50 p-4">
			<div className="flex shrink-0 items-center justify-center rounded-full bg-p-100 p-3">
				<PregnantIcon className="h-7 w-[18px] text-p-400" />
			</div>
			<div className="grid flex-1 grid-cols-3 gap-x-3 gap-y-3 text-sm text-n-800">
				<p>
					<span className="font-semibold">Nome:</span> {gestante.nome}
				</p>
				<p>
					<span className="font-semibold">Data de nascimento:</span> {formatarDataBr(gestante.dataNascimento)}
				</p>
				<p>
					<span className="font-semibold">Idade:</span> {gestante.idade}
				</p>
				<p>
					<span className="font-semibold">CPF:</span> {gestante.cpf}
				</p>
				<p>
					<span className="font-semibold">CNS:</span> {gestante.cns}
				</p>
			</div>
		</div>
	)
}
