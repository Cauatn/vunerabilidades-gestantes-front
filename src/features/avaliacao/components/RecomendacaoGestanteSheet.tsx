import { useEffect, useState, type FormEvent } from 'react'

import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import type { RecomendacaoGestante } from '@/features/avaliacao/types/recomendacaoGestante'

const VALORES_VAZIOS = { titulo: '', observacoes: '' }

interface RecomendacaoGestanteSheetProps {
	recomendacao?: RecomendacaoGestante
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmit: (dados: { titulo: string; observacoes: string }) => void
}

export function RecomendacaoGestanteSheet({ recomendacao, open, onOpenChange, onSubmit }: RecomendacaoGestanteSheetProps) {
	const isEdit = !!recomendacao
	const [dados, setDados] = useState(VALORES_VAZIOS)

	useEffect(() => {
		if (open) setDados(recomendacao ? { titulo: recomendacao.titulo, observacoes: recomendacao.observacoes } : VALORES_VAZIOS)
	}, [open, recomendacao])

	function handleSubmit(event: FormEvent) {
		event.preventDefault()
		onSubmit(dados)
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side="right" className="flex flex-col">
				<SheetHeader className="gap-0 p-0">
					<SheetTitle>{isEdit ? 'Editar recomendação' : 'Nova recomendação'}</SheetTitle>
				</SheetHeader>

				<form id="recomendacao-form" className="flex min-h-0 flex-1 flex-col gap-4" onSubmit={handleSubmit}>
					<Field>
						<FieldLabel htmlFor="recomendacao-titulo" required>
							Recomendação
						</FieldLabel>
						<FieldContent>
							<Input
								id="recomendacao-titulo"
								placeholder="Digite..."
								required
								value={dados.titulo}
								onChange={(event) => setDados((atual) => ({ ...atual, titulo: event.target.value }))}
							/>
						</FieldContent>
					</Field>

					<Field>
						<FieldLabel htmlFor="recomendacao-observacoes">Observações</FieldLabel>
						<FieldContent>
							<Textarea
								id="recomendacao-observacoes"
								placeholder="Digite..."
								value={dados.observacoes}
								onChange={(event) => setDados((atual) => ({ ...atual, observacoes: event.target.value }))}
							/>
						</FieldContent>
					</Field>
				</form>

				<SheetFooter
					className="p-0"
					confirmLabel={isEdit ? 'Salvar' : 'Adicionar'}
					cancelLabel="Cancelar"
					onCancel={() => onOpenChange(false)}
					confirmProps={{ type: 'submit', form: 'recomendacao-form' }}
				/>
			</SheetContent>
		</Sheet>
	)
}
