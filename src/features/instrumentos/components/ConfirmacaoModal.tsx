import { CircleAlert, TriangleAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export type ConfirmacaoTom = 'danger' | 'warning'

interface ConfirmacaoModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirmar: () => void
	tom?: ConfirmacaoTom
	titulo: string
	descricao: string
	confirmarLabel: string
}

export function ConfirmacaoModal({
	open,
	onOpenChange,
	onConfirmar,
	tom = 'danger',
	titulo,
	descricao,
	confirmarLabel,
}: ConfirmacaoModalProps) {
	const Icon = tom === 'danger' ? CircleAlert : TriangleAlert

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0">
				<div
					className={cn(
						'flex items-center gap-3 border-b px-5 py-6',
						tom === 'danger' ? 'border-(--color-r-500) bg-r-100' : 'border-(--color-y-400) bg-y-100',
					)}
				>
					<Icon className={cn('size-7 shrink-0', tom === 'danger' ? 'text-r-500' : 'text-y-400')} />
					<DialogTitle className="text-[25px]">{titulo}</DialogTitle>
				</div>

				<DialogHeader className="items-start gap-3 p-4 text-left">
					<p className="text-2xl leading-8 font-semibold text-n-900">Tem certeza que deseja continuar?</p>
					<DialogDescription className="text-justify text-sm text-n-700">{descricao}</DialogDescription>
				</DialogHeader>

				<DialogFooter className="pb-[18px]">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button type="button" variant={tom === 'danger' ? 'danger' : 'warning'} onClick={onConfirmar}>
						{confirmarLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
