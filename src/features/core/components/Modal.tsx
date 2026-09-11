import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

export type ModalVariant = 'danger' | 'warning'

interface ModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	variant?: ModalVariant
	title: string
	description: string
	confirmLabel: string
}

export function Modal({ open, onOpenChange, onConfirm, variant = 'danger', title, description, confirmLabel }: ModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange} variant={variant}>
			<DialogContent showCloseButton={false} className="max-w-125 gap-0 overflow-hidden p-0">
				<DialogHeader className="gap-3 p-4 text-left">
					<DialogTitle className="text-[25px]">{title}</DialogTitle>
				</DialogHeader>

				<DialogBody>
					<p className="text-2xl leading-8 font-semibold text-n-900">Tem certeza que deseja continuar?</p>
					<DialogDescription className="text-justify text-sm text-n-700">{description}</DialogDescription>
				</DialogBody>

				<DialogFooter className="pb-4.5">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button type="button" variant={variant === 'danger' ? 'danger' : 'warning'} onClick={onConfirm}>
						{confirmLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
