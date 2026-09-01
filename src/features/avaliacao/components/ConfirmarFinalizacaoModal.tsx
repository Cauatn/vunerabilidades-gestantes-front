import { TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ConfirmarFinalizacaoModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirmar: () => void
}

export function ConfirmarFinalizacaoModal({ open, onOpenChange, onConfirmar }: ConfirmarFinalizacaoModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="max-w-[500px] gap-0 overflow-hidden p-0">
				<div className="flex items-center gap-3 rounded-t-lg border-b border-(--y-400) bg-y-100 px-5 py-6">
					<TriangleAlert className="size-7 shrink-0 text-y-400" />
					<DialogTitle className="text-[25px]">Finalizar avaliação</DialogTitle>
				</div>

				<DialogHeader className="items-start gap-3 p-4 text-left">
					<p className="text-2xl leading-8 font-semibold text-n-800">Tem certeza que deseja continuar?</p>
					<DialogDescription className="text-justify text-sm text-n-700">
						Ao clicar em finalizar as recomendações sugeridas à gestante não poderão mais ser alteradas e o
						resultado será protocolado. Confirme os dados antes de continuar.
					</DialogDescription>
				</DialogHeader>

				<DialogFooter className="pb-[18px]">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button type="button" variant="warning" onClick={onConfirmar}>
						Finalizar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
