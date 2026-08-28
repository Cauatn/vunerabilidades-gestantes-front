import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Divider } from '@/components/ui/divider'
import { IconButton } from '@/components/ui/icon-button'
import { RecomendacaoGestanteSheet } from '@/features/avaliacao/components/RecomendacaoGestanteSheet'
import { CLASSIFICACAO_COR_TEXTO, CLASSIFICACAO_LABEL, type Classificacao } from '@/features/avaliacao/constants'
import type { RecomendacaoGestante } from '@/features/avaliacao/types/recomendacaoGestante'
import { cn } from '@/lib/utils'

interface RecomendacoesGestanteProps {
	classificacao: Classificacao
	recomendacoes: RecomendacaoGestante[]
	onAdd: (dados: { titulo: string; observacoes: string }) => void
	onUpdate: (id: string, dados: { titulo: string; observacoes: string }) => void
	onRemove: (id: string) => void
	className?: string
}

export function RecomendacoesGestante({
	classificacao,
	recomendacoes,
	onAdd,
	onUpdate,
	onRemove,
	className,
}: RecomendacoesGestanteProps) {
	const [sheetAberto, setSheetAberto] = useState(false)
	const [recomendacaoEmEdicao, setRecomendacaoEmEdicao] = useState<RecomendacaoGestante | undefined>(undefined)

	function abrirNova() {
		setRecomendacaoEmEdicao(undefined)
		setSheetAberto(true)
	}

	function abrirEdicao(recomendacao: RecomendacaoGestante) {
		setRecomendacaoEmEdicao(recomendacao)
		setSheetAberto(true)
	}

	function handleSubmit(dados: { titulo: string; observacoes: string }) {
		if (recomendacaoEmEdicao) {
			onUpdate(recomendacaoEmEdicao.id, dados)
		} else {
			onAdd(dados)
		}
		setSheetAberto(false)
	}

	return (
		<div className={cn('flex flex-col gap-3', className)}>
			<Divider text="Recomendações à gestante" />

			<p className="text-sm text-n-900">
				Dado o cenário de vulnerabilidade{' '}
				<span className={cn('font-semibold', CLASSIFICACAO_COR_TEXTO[classificacao])}>
					{CLASSIFICACAO_LABEL[classificacao]}
				</span>{' '}
				da gestante, recomende ações que podem auxiliar na saúde de sua gestação:
			</p>

			<div className="flex flex-col items-center gap-3">
				{recomendacoes.length === 0 && (
					<p className="w-full py-2 text-center text-sm text-n-400">Nenhuma recomendação adicionada ainda.</p>
				)}

				{recomendacoes.map((recomendacao, index) => (
					<div
						key={recomendacao.id}
						className="flex w-full items-center gap-5 rounded-xl border border-n-50 px-8 py-7"
					>
						<p className="text-[28px] font-bold whitespace-nowrap text-p-400">{index + 1}.</p>
						<div className="grid flex-1 grid-cols-1 gap-5 px-6 sm:grid-cols-3">
							<div className="flex flex-col gap-3 text-n-700 sm:col-span-1">
								<p className="text-xl font-semibold whitespace-nowrap">Recomendação</p>
								<p className="text-base">{recomendacao.titulo}</p>
							</div>
							<div className="flex flex-col gap-3 sm:col-span-2">
								<p className="text-xl font-semibold whitespace-nowrap text-n-700">Observações</p>
								<p className="text-[11px] whitespace-pre-wrap text-n-600">{recomendacao.observacoes || '—'}</p>
							</div>
						</div>
						<div className="flex shrink-0 items-center gap-2.5">
							<IconButton icon={Pencil} tooltipText="Editar recomendação" onClick={() => abrirEdicao(recomendacao)} />
							<IconButton
								icon={Trash2}
								tooltipText="Excluir recomendação"
								variant="danger"
								onClick={() => onRemove(recomendacao.id)}
							/>
						</div>
					</div>
				))}

				<button
					type="button"
					onClick={abrirNova}
					className="flex w-full items-center justify-center gap-1 rounded-xl border-2 border-dashed border-p-400 py-2 text-base font-semibold text-p-400 hover:bg-p-50"
				>
					<Plus className="size-6" />
					Nova recomendação
				</button>
			</div>

			<RecomendacaoGestanteSheet
				recomendacao={recomendacaoEmEdicao}
				open={sheetAberto}
				onOpenChange={setSheetAberto}
				onSubmit={handleSubmit}
			/>
		</div>
	)
}
