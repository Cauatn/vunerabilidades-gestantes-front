import { SquareTextIcon } from '@/features/avaliacao/components/icons'
import type { ResumoAplicacao } from '@/features/avaliacao/types/historico'
import { formatarDataBr } from '@/features/core/utils/date'

interface ResumoAplicacaoCardProps {
	resumo: ResumoAplicacao
}

export function ResumoAplicacaoCard({ resumo }: ResumoAplicacaoCardProps) {
	return (
		<div className="flex w-full items-center gap-5 rounded-xl border border-(--b-200) bg-b-50 p-4">
			<div className="flex shrink-0 items-center justify-center rounded-full bg-b-100 p-3">
				<SquareTextIcon className="size-7 text-b-400" />
			</div>
			<div className="grid flex-1 grid-cols-3 gap-x-3 gap-y-3 text-sm text-n-800">
				<p>
					<span className="font-semibold">Data de aplicação:</span> {formatarDataBr(resumo.dataAplicacao)}
				</p>
				<p className="col-span-2">
					<span className="font-semibold">UBS de aplicação:</span> {resumo.ubs}
				</p>
				<p>
					<span className="font-semibold">Aplicador:</span> {resumo.aplicador}
				</p>
				<p>
					<span className="font-semibold">Categoria profissional:</span> {resumo.categoriaProfissional}
				</p>
				<p>
					<span className="font-semibold">CRM/COREN:</span> {resumo.crmCoren}
				</p>
				<p>
					<span className="font-semibold">Email:</span> {resumo.email}
				</p>
			</div>
		</div>
	)
}
