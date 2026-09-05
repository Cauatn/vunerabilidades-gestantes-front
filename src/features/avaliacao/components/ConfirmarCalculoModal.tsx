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

interface ConfirmarCalculoModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirmar: () => void;
}

export function ConfirmarCalculoModal({
	open,
	onOpenChange,
	onConfirmar,
}: ConfirmarCalculoModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange} variant="warning">
			<DialogContent
				showCloseButton={false}
				className="max-w-125 gap-0 overflow-hidden p-0"
			>
				<DialogHeader className="gap-3 p-4 text-left">
					<DialogTitle className="text-[25px]">Calcular resultado</DialogTitle>
				</DialogHeader>

				<DialogBody>
					<p className="text-2xl leading-8 font-semibold text-n-800">
						Tem certeza que deseja continuar?
					</p>
					<DialogDescription className="text-justify text-sm text-n-700">
						Ao clicar em calcular as respostas para o formulário serão
						utilizadas para realizar o cálculo da escala. Confirme as respostas
						antes de continuar.
					</DialogDescription>
				</DialogBody>

				<DialogFooter className="pb-4.5">
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button type="button" variant="warning" onClick={onConfirmar}>
						Calcular
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
