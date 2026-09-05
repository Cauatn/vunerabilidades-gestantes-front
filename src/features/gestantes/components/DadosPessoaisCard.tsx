import { Baby } from "lucide-react";

import { calcularIdade, formatarDataBr } from "@/features/core/utils/date";
import type { Gestante } from "@/features/gestantes/types/gestante";

type Props = {
	gestante: Gestante;
};

export function DadosPessoaisCard({ gestante }: Props) {
	const nascimento = gestante.birthDate.slice(0, 10);
	const fields = [
		{ label: "Nome:", value: gestante.name },
		{ label: "Data de nascimento:", value: formatarDataBr(nascimento) },
		{ label: "Idade:", value: String(calcularIdade(nascimento)) },
		//TODO: corrigir tipagem
		{
			label: "CPF:",
			value: gestante.identifiers.cpf ? gestante.identifiers.cpf : "—",
		},
		{
			label: "CNS:",
			value: gestante.identifiers.cns ? gestante.identifiers.cns : "—",
		},
	];

	return (
		<div className="flex w-full items-center gap-5 rounded-xl border border-p-200 bg-p-50 p-4">
			<div className="flex size-13 shrink-0 items-center justify-center rounded-full bg-p-100">
				<Baby className="size-7 text-p-400" />
			</div>
			<div className="grid flex-1 grid-cols-1 gap-3 text-sm text-n-800 sm:grid-cols-2 lg:grid-cols-3">
				{fields.map((field) => (
					<p key={field.label}>
						<span className="font-semibold">{field.label}</span> {field.value}
					</p>
				))}
			</div>
		</div>
	);
}
