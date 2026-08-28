import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Pergunta } from '@/features/avaliacao/types/pergunta'

interface SortablePerguntaCardProps {
	pergunta: Pergunta
	index: number
	onRemove: (perguntaId: string) => void
	onCategoriaChange: (perguntaId: string, categoria: string) => void
	onTextoChange: (perguntaId: string, texto: string) => void
	onAddOpcao: (perguntaId: string) => void
	onRemoveOpcao: (perguntaId: string, opcaoId: string) => void
	onOpcaoTextoChange: (perguntaId: string, opcaoId: string, texto: string) => void
	onOpcaoPontuacaoChange: (perguntaId: string, opcaoId: string, pontuacao: number) => void
}

export function SortablePerguntaCard({
	pergunta,
	index,
	onRemove,
	onCategoriaChange,
	onTextoChange,
	onAddOpcao,
	onRemoveOpcao,
	onOpcaoTextoChange,
	onOpcaoPontuacaoChange,
}: SortablePerguntaCardProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pergunta.id })

	const [categoriaLocal, setCategoriaLocal] = useState(pergunta.categoria)

	useEffect(() => {
		setCategoriaLocal(pergunta.categoria)
	}, [pergunta.categoria])

	return (
		<Card
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn(isDragging && 'z-10 opacity-70 shadow-lg')}
		>
			<CardHeader className="gap-3">
				<div className="flex items-start gap-2">
					<button
						type="button"
						className="mt-6 flex size-9 shrink-0 cursor-grab items-center justify-center text-n-400 hover:text-n-600 active:cursor-grabbing"
						aria-label="Arrastar para reordenar"
						{...attributes}
						{...listeners}
					>
						<GripVertical className="size-4" />
					</button>

					<div className="flex-1 space-y-3">
						<div className="space-y-1.5">
							<Label htmlFor={`categoria-${pergunta.id}`}>Categoria</Label>
							<Input
								id={`categoria-${pergunta.id}`}
								value={categoriaLocal}
								placeholder="Ex.: Condições socioeconômicas"
								onChange={(event) => setCategoriaLocal(event.target.value)}
								onBlur={() => onCategoriaChange(pergunta.id, categoriaLocal)}
							/>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor={`pergunta-${pergunta.id}`}>Pergunta {index + 1}</Label>
							<Input
								id={`pergunta-${pergunta.id}`}
								value={pergunta.texto}
								placeholder="Digite o texto da pergunta"
								onChange={(event) => onTextoChange(pergunta.id, event.target.value)}
							/>
						</div>
					</div>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="mt-6 shrink-0 text-n-500 hover:text-danger"
						aria-label="Remover pergunta"
						onClick={() => onRemove(pergunta.id)}
					>
						<Trash2 className="size-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="space-y-3">
				<Label>Opções de resposta</Label>
				{pergunta.opcoes.map((opcao) => (
					<div key={opcao.id} className="flex items-center gap-3">
						<Input
							value={opcao.texto}
							placeholder="Texto da opção"
							className="flex-1"
							onChange={(event) => onOpcaoTextoChange(pergunta.id, opcao.id, event.target.value)}
						/>
						<Input
							type="number"
							value={opcao.pontuacao}
							placeholder="Pontos"
							className="w-24"
							onChange={(event) => onOpcaoPontuacaoChange(pergunta.id, opcao.id, Number(event.target.value))}
						/>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="shrink-0 text-n-500 hover:text-danger"
							aria-label="Remover opção"
							disabled={pergunta.opcoes.length <= 1}
							onClick={() => onRemoveOpcao(pergunta.id, opcao.id)}
						>
							<Trash2 className="size-4" />
						</Button>
					</div>
				))}
				<Button type="button" variant="outline" size="sm" onClick={() => onAddOpcao(pergunta.id)}>
					<Plus className="size-4" />
					Adicionar opção
				</Button>
			</CardContent>
		</Card>
	)
}
