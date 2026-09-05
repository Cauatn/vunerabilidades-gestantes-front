import type { ColumnDef } from "@tanstack/react-table";

import { calcularIdade, formatarDataBr } from "@/features/core/utils/date";
import type { Gestante } from "@/features/gestantes/types/gestante";
import { formatCns, formatCpf } from "../../utils/document";
import { GestanteActionsCell } from "./actionsCell";

interface CreateGestantesColumnsParams {
	onVerPerfil: (gestante: Gestante) => void;
	onEditar: (gestante: Gestante) => void;
}

export function createGestantesColumns({
	onVerPerfil,
	onEditar,
}: CreateGestantesColumnsParams): ColumnDef<Gestante>[] {
	return [
		{
			accessorKey: "name",
			header: "Nome",
			cell: ({ getValue }) => (
				<span className="font-medium text-n-700">{getValue() as string}</span>
			),
		},
		{
			id: "idade",
			header: "Idade",
			cell: ({ row }) => calcularIdade(row.original.birthDate.slice(0, 10)),
		},
		{
			id: "dataNascimento",
			header: "Data de nascimento",
			cell: ({ row }) => formatarDataBr(row.original.birthDate.slice(0, 10)),
		},
		{
			id: "cpf",
			header: "CPF",
			cell: ({ row }) => {
				const cpf = row.original.identifiers.cpf;
				return cpf ? formatCpf(cpf) : <span className="text-n-400">—</span>;
			},
		},
		{
			id: "cns",
			header: "CNS",
			cell: ({ row }) => {
				const cns = row.original.identifiers.cns;
				return cns ? formatCns(cns) : <span className="text-n-400">—</span>;
			},
		},
		{
			id: "vulnerabilidade",
			header: "Vulnerabilidade",
			//TODO: listagem não traz o resultado da última avaliação da gestante
			cell: () => <span className="text-n-400">—</span>,
		},
		{
			id: "actions",
			cell: ({ row }) => (
				<GestanteActionsCell
					gestante={row.original}
					onVerPerfil={onVerPerfil}
					onEditar={onEditar}
				/>
			),
		},
	];
}
