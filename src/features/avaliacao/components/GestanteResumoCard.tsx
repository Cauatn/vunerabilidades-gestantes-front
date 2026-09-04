import { PregnantIcon } from "@/features/avaliacao/components/icons";
import { calcularIdade, formatarDataBr } from "@/features/core/utils/date";
import type { Gestante } from "@/features/gestantes/types/gestante";
import { cn } from "@/lib/utils";

interface GestanteResumoCardProps {
	gestante: Gestante;
	className?: string;
}

export function GestanteResumoCard({
	gestante,
	className,
}: GestanteResumoCardProps) {
	const nascimento = gestante.birthDate.slice(0, 10);

	return (
		<div
			className={cn(
				"flex items-center gap-5 rounded-xl border border-p-200 bg-p-50 p-4",
				className,
			)}
		>
			<div className="flex shrink-0 items-center justify-center rounded-full bg-p-100 p-3">
				<PregnantIcon className="h-7 w-4.5 text-p-400" />
			</div>
			<div className="grid flex-1 grid-cols-1 gap-x-3 gap-y-3 text-sm text-n-800 sm:grid-cols-3">
				<p>
					<span className="font-semibold">Nome:</span> {gestante.name}
				</p>
				<p>
					<span className="font-semibold">Data de nascimento:</span>{" "}
					{formatarDataBr(gestante.birthDate)}
				</p>
				<p>
					<span className="font-semibold">Idade:</span>{" "}
					{calcularIdade(gestante.birthDate)}
				</p>
				<p>
					<span className="font-semibold">CPF:</span>{" "}
					{gestante.identifier.type === "CPF"
						? gestante.identifier.value
						: "--"}
				</p>
				<p>
					<span className="font-semibold">CNS:</span>{" "}
					{gestante.identifier.type === "SUS_CARD"
						? gestante.identifier.value
						: "--"}
				</p>
			</div>
		</div>
	);
}
