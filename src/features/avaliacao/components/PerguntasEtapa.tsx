import { Divider } from '@/components/ui/divider'
import { RadioGroup } from '@/components/ui/radio-group'
import type { Question } from '@/features/instrumentos/types/questionnaire'

interface PerguntasEtapaProps {
	perguntas: Question[]
	respostas: Record<string, string>
	onResponder: (questionId: string, optionId: string) => void
}

export function PerguntasEtapa({ perguntas, respostas, onResponder }: PerguntasEtapaProps) {
	return (
		<div className="flex flex-col gap-3">
			<Divider text="Perguntas" />

			<div className="flex max-w-[900px] flex-col gap-3">
				{perguntas.map((pergunta, index) => (
					<div key={pergunta.id} className="flex flex-col gap-2">
						<p className="pb-1 text-sm font-semibold tracking-[0.4px] text-n-700">
							{index + 1}. {pergunta.statement}
							{pergunta.required ? <span className="text-r-500"> *</span> : null}
						</p>
						<RadioGroup
							name={pergunta.id}
							options={[...pergunta.options]
								.sort((a, b) => a.order - b.order)
								.map((opcao) => ({ value: opcao.id, label: opcao.label }))}
							value={respostas[pergunta.id]}
							onValueChange={(optionId) => onResponder(pergunta.id, optionId)}
						/>
					</div>
				))}
			</div>
		</div>
	)
}
