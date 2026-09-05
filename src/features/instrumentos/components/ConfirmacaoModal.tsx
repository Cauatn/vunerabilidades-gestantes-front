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

export type ConfirmacaoTom = 'danger' | 'warning';

interface ConfirmacaoModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirmar: () => void;
	tom?: ConfirmacaoTom;
	titulo: string;
	descricao: string;
	confirmarLabel: string;
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
	return (
		<Dialog open={open} onOpenChange={onOpenChange} variant={tom}>
			<DialogContent
				showCloseButton={false}
				className='max-w-125 gap-0 overflow-hidden p-0'
			>
				<DialogHeader className='gap-3 p-4 text-left'>
					<DialogTitle className='text-[25px]'>{titulo}</DialogTitle>
				</DialogHeader>

				<DialogBody>
					<p className='text-2xl leading-8 font-semibold text-n-900'>
						Tem certeza que deseja continuar?
					</p>
					<DialogDescription className='text-justify text-sm text-n-700'>
						{descricao}
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
					<Button
						type='button'
						variant={tom === 'danger' ? 'danger' : 'warning'}
						onClick={onConfirmar}
					>
						{confirmarLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

