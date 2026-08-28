import { Divider } from '@/components/ui/divider'
import { RadioGroup } from '@/components/ui/radio-group'
import type { Pergunta } from '@/features/avaliacao/types/pergunta'

interface EtapaPerguntasProps {
	perguntas: Pergunta[]
	respostas: Record<string, string>
	onResponder: (perguntaId: string, opcaoId: string) => void
}

export function EtapaPerguntas({ perguntas, respostas, onResponder }: EtapaPerguntasProps) {
	return (
		<div className="flex flex-col gap-3">
			<Divider text="Perguntas" />

			<div className="flex max-w-[900px] flex-col gap-3">
				{perguntas.map((pergunta, index) => (
					<div key={pergunta.id} className="flex flex-col gap-2">
						<p className="pb-1 text-sm font-semibold tracking-[0.4px] text-n-700">
							{index + 1}. {pergunta.texto}
						</p>
						<RadioGroup
							name={pergunta.id}
							options={pergunta.opcoes.map((opcao) => ({ value: opcao.id, label: opcao.texto }))}
							value={respostas[pergunta.id]}
							onValueChange={(opcaoId) => onResponder(pergunta.id, opcaoId)}
						/>
					</div>
				))}
			</div>
		</div>
	)
}
