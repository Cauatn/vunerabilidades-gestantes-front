import { Badge } from "@/components/ui/badge";
import CellSubItem from "@/features/core/components/CellSubItem";
import { calcularIdade, formatarDataBr } from "@/features/core/utils/date";
import type { Gestante } from "@/features/gestantes/types/gestante";
import type { HealthUnit } from "@/features/healthUnits/types/healthUnit";
import {
	CATEGORIA_TO_ROLE,
	type Usuario,
} from "@/features/usuarios/types/usuario";
import type { ColumnDef } from "@tanstack/react-table";
import AcoesTabelaAvaliacoes from "../components/AcoesTabelaAvaliacoes";
import type { Assessment } from "../types/assessment";

export const columns: ColumnDef<Assessment>[] = [
	{
		accessorKey: "id",
		header: "Identificador",
		cell: ({ getValue }) => `#${getValue()}`,
	},
	{
		accessorKey: "appliedAt",
		header: "Data da aplicação",
		cell: ({ getValue }) => formatarDataBr(getValue() as string),
	},
	{
		accessorKey: "snapshot.props",
		header: "Versão do questionário",
		cell: ({ getValue }) => {
			const data = getValue();
			//TODO: corrigir tipagem
			return <Badge variant="neutral">{data.versionNumber}</Badge>;
		},
	},
	{
		accessorKey: "appliedByUser",
		header: "Dados do aplicador",
		cell({ getValue }) {
			const appliedByUser = getValue() as Usuario;
			const professionalRegistrationLabel =
				appliedByUser.role === CATEGORIA_TO_ROLE.medico ? "CRM" : "COREN";

			return (
				<div className="space-y-0">
					<CellSubItem label="Nome" value={appliedByUser.name} />
					<CellSubItem label="Email" value={appliedByUser.email} />
					<CellSubItem
						label="Categoria profissional"
						value={appliedByUser.role}
					/>
					<CellSubItem
						label={professionalRegistrationLabel}
						value={appliedByUser.professionalRegistration as string}
					/>
				</div>
			);
		},
	},
	{
		accessorKey: "healthUnit",
		header: "UBS de aplicação",
		cell({ getValue }) {
			return (getValue() as HealthUnit).name;
		},
	},
	{
		accessorKey: "patient",
		header: "Dados da gestante",
		cell: ({ getValue }) => {
			const patient = getValue() as Gestante;

			return (
				<div className="space-y-0">
					<CellSubItem label="Nome" value={patient.name} />
					<CellSubItem
						label="Idade"
						value={calcularIdade(patient.birthDate).toString()}
					/>
					{/* //TODO: corrigir tipagem da avaliação em types */}
					<CellSubItem
						label="CPF"
						value={patient.identifiers.cpf ?? '--'}
					/>
					<CellSubItem
						label='CNS'
						value={patient.identifiers.cns ?? '--'}
					/>
				</div>
			);
		},
	},
	//! a cor tem que vir da configuração da escala, não da pra hardcodar no front
	{
		accessorKey: "result.props",
		header: "Vulnerabilidade",
		cell: ({ getValue }) => {
			const data = getValue();
			//TODO: corrigir tipagem
			return <Badge variant="neutral">{data.vulnerabilityLevel}</Badge>;
		},
	},
	//! a cor tem que vir da configuração da escala, não da pra hardcodar no front
	{
		accessorKey: "result.props",
		header: "Score",
		cell: ({ getValue }) => {
			const data = getValue();
			//TODO: corrigir tipagem
			return <Badge variant="neutral">{data.totalScore}</Badge>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return <AcoesTabelaAvaliacoes id={row.original.id} />;
		},
	},
];
