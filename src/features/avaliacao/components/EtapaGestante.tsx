import { useState } from 'react'

import { Combobox } from '@/components/ui/combobox'
import { Divider } from '@/components/ui/divider'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { GestanteResumoCard } from '@/features/avaliacao/components/GestanteResumoCard'
import { GestanteSheet } from '@/features/gestantes/components/GestanteSheet'
import { useCreateGestante } from '@/features/gestantes/composables/useCreateGestante'
import type { CreateGestantePayload, Gestante } from '@/features/gestantes/types/gestante'

interface EtapaGestanteProps {
	gestantes: Gestante[]
	gestanteId: string | null
	onGestanteChange: (id: string) => void
}

export function EtapaGestante({ gestantes, gestanteId, onGestanteChange }: EtapaGestanteProps) {
	const [sheetAberto, setSheetAberto] = useState(false)
	const [nomeBuscado, setNomeBuscado] = useState('')

	const criar = useCreateGestante()

	const gestanteSelecionada = gestantes.find((gestante) => gestante.id === gestanteId)

	async function handleCriarGestante(payload: CreateGestantePayload) {
		const { data } = await criar.mutateAsync(payload)
		onGestanteChange((data as Gestante).id)
		setSheetAberto(false)
	}

	return (
		<div className="flex flex-col gap-3">
			<Divider text="Dados da gestante" />

			<Field className="max-w-[534px]">
				<FieldLabel htmlFor="avaliacao-gestante" required>
					Gestante
				</FieldLabel>
				<FieldContent>
					<Combobox
						id="avaliacao-gestante"
						options={gestantes.map((gestante) => ({ value: gestante.id, label: gestante.name }))}
						value={gestanteId ?? undefined}
						onValueChange={onGestanteChange}
						emptyMessage="Nenhuma gestante encontrada."
						createNewLabel="Cadastrar nova gestante"
						onCreateNew={(query) => {
							setNomeBuscado(query)
							setSheetAberto(true)
						}}
					/>
				</FieldContent>
			</Field>

			{gestanteSelecionada && <GestanteResumoCard gestante={gestanteSelecionada} />}

			<GestanteSheet
				open={sheetAberto}
				onOpenChange={setSheetAberto}
				onSubmit={handleCriarGestante}
				isSubmitting={criar.isPending}
				nomeInicial={nomeBuscado}
			/>
		</div>
	)
}
