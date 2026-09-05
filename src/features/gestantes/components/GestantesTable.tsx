import { SquarePen, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { calcularIdade, formatarDataBr } from "@/features/core/utils/date";
import type { Gestante } from "@/features/gestantes/types/gestante";

const columns = [
	"Nome",
	"Idade",
	"Data de nascimento",
	"CPF",
	"CNS",
	"Vulnerabilidade",
];

const gridCols = "grid-cols-[200px_repeat(5,minmax(0,1fr))_116px]";

type Props = {
	rows: Gestante[];
	onVerPerfil?: (row: Gestante) => void;
	onEditar?: (row: Gestante) => void;
};

export function GestantesTable({ rows, onVerPerfil, onEditar }: Props) {
	return (
		<div className="w-full overflow-hidden rounded-lg border border-n-30">
			<div className={`grid ${gridCols} bg-n-10`}>
				{columns.map((col) => (
					<div
						key={col}
						className="border-b border-n-30 px-5 py-4 text-[15px] font-semibold text-n-700"
					>
						{col}
					</div>
				))}
				<div className="border-b border-n-30 px-5 py-4" />
			</div>

			{rows.map((row) => {
				const nascimento = row.birthDate.slice(0, 10);
				return (
					<div key={row.id} className={`grid ${gridCols} bg-n-0`}>
						<Cell>{row.name}</Cell>
						<Cell>{calcularIdade(nascimento)}</Cell>
						<Cell>{formatarDataBr(nascimento)}</Cell>
						{/* //TODO: corrigir tipagem da avaliação */}
						<Cell>{row.identifiers.cpf}</Cell>
						<Cell>{row.identifiers.cns}</Cell>
						<Cell>
							<span className="text-n-400">—</span>
						</Cell>
						<div className="flex items-center justify-center gap-2.5 border-b border-n-30 px-5">
							<ActionButton
								label="Ver perfil"
								onClick={() => onVerPerfil?.(row)}
							>
								<UserRound className="size-4" />
							</ActionButton>
							<ActionButton label="Editar" onClick={() => onEditar?.(row)}>
								<SquarePen className="size-4" />
							</ActionButton>
						</div>
					</div>
				);
			})}
		</div>
	);
}

function Cell({ children }: { children: ReactNode }) {
	return (
		<div className="flex items-center border-b border-n-30 px-5 py-4 text-sm text-n-800">
			<span className="truncate">{children}</span>
		</div>
	);
}

function ActionButton({
	label,
	children,
	onClick,
}: {
	label: string;
	children: ReactNode;
	onClick?: () => void;
}) {
	return (
		<button
			type="button"
			aria-label={label}
			onClick={onClick}
			className="flex size-[33px] items-center justify-center rounded-[9px] border border-n-40 bg-n-0 text-n-600 hover:bg-n-10"
		>
			{children}
		</button>
	);
}
