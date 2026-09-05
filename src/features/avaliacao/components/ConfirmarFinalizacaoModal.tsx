import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface ConfirmarFinalizacaoModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirmar: () => void;
}

export function ConfirmarFinalizacaoModal({
	open,
	onOpenChange,
	onConfirmar,
}: ConfirmarFinalizacaoModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange} variant='warning'>
			<DialogContent
				showCloseButton={false}
				className='max-w-125 gap-0 overflow-hidden p-0'
			>
				<DialogHeader className='gap-3 p-4 text-left'>
					<DialogTitle className='text-[25px]'>Finalizar avaliação</DialogTitle>
				</DialogHeader>

				<DialogBody>
					<p className='text-2xl leading-8 font-semibold text-n-800'>
						Tem certeza que deseja continuar?
					</p>
					<DialogDescription className='text-justify text-sm text-n-700'>
						Ao clicar em finalizar as recomendações sugeridas à gestante não
						poderão mais ser alteradas e o resultado será protocolado. Confirme os
						dados antes de continuar.
					</DialogDescription>
				</DialogBody>

				<DialogFooter className='pb-4.5'>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button type='button' variant='warning' onClick={onConfirmar}>
						Finalizar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

