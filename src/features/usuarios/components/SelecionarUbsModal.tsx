import { Hospital } from 'lucide-react';
import { useState } from 'react';

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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SelecionarUbsModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	ubsOptions: { id: string; name: string }[];
	onConfirmar: (ubsId: string) => void;
	isPending?: boolean;
};

export function SelecionarUbsModal({
	open,
	onOpenChange,
	ubsOptions,
	onConfirmar,
	isPending = false,
}: SelecionarUbsModalProps) {
	const [selecionada, setSelecionada] = useState('');

	return (
		<Dialog open={open} onOpenChange={onOpenChange} headerIcon={Hospital}>
			<DialogContent
				showCloseButton={false}
				className='max-w-125 gap-0 overflow-hidden p-0'
			>
				<DialogHeader className='gap-3 p-4 text-left border-b border-n-200 bg-t-100'>
					<DialogTitle className='text-[25px] tracking-[0.15px]'>
						Selecionar UBS
					</DialogTitle>
				</DialogHeader>

				<DialogBody className='flex flex-col gap-3 p-7'>
					<DialogDescription className='text-left text-sm leading-5 text-n-700'>
						Selecione a UBS que você se encontra atualmente. A partir desse momento
						todas operações que você fizer estarão associadas a UBS selecionada.
						Você pode trocar de UBS na barra lateral do sistema a qualquer momento.
					</DialogDescription>
					<div className='space-y-1.5'>
						<Label>UBS</Label>
						<Select value={selecionada} onValueChange={setSelecionada}>
							<SelectTrigger className='w-full'>
								<SelectValue placeholder='Selecione' />
							</SelectTrigger>
							<SelectContent>
								{ubsOptions.map((ubs) => (
									<SelectItem key={ubs.id} value={ubs.id}>
										{ubs.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</DialogBody>

				<DialogFooter className='pb-4.5'>
					<Button
						type='button'
						variant='outline'
						className='min-w-33.75'
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button
						type='button'
						className='min-w-36.25'
						disabled={!selecionada || isPending}
						onClick={() => onConfirmar(selecionada)}
					>
						Selecionar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

