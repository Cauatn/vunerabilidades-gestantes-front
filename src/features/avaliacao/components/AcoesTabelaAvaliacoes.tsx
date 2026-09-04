import DialogModal from "@/components/ui/dialogModal";
import { IconButton } from "@/components/ui/icon-button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Info, Printer } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type PrintingOptions = "pregnant_view" | "general_view";

export default function AcoesTabelaAvaliacoes({ id }: { id: string }) {
	const [isPrintAssessmentModalOpen, setIsPrintAssessmentModalOpen] =
		useState(false);
	const [selectedPrintingOption, setSelectedPrintingOption] =
		useState<PrintingOptions>("general_view");
	const navigate = useNavigate();
	const printingOptions = [
		{
			value: "general_view",
			label: "Visão geral",
		},
		{
			value: "pregnant_view",
			label: "Visão da gestante",
		},
	];

	function handlePrintingOption() {
		const baseUrl = `/historico/${id}/imprimir`;
		const printingUrl =
			selectedPrintingOption === "general_view"
				? `${baseUrl}/visao-geral`
				: `${baseUrl}/visao-gestante`;

		setIsPrintAssessmentModalOpen(false);
		setSelectedPrintingOption("general_view");
		window.open(printingUrl, "_blank", "rel=noopener noreferrer");
	}

	function closeModal() {
		setSelectedPrintingOption("general_view");
		setIsPrintAssessmentModalOpen(false);
	}

	return (
		<>
			<div className="flex items-center justify-end gap-1">
				<IconButton
					icon={Info}
					tooltipText="Detalhamento da avaliação"
					onClick={() => navigate(`/historico/${id}`)}
				/>
				<IconButton
					icon={Printer}
					tooltipText="Imprimir avaliação"
					onClick={() => setIsPrintAssessmentModalOpen(true)}
				/>
			</div>

			{isPrintAssessmentModalOpen && (
				<DialogModal
					open={isPrintAssessmentModalOpen}
					onOpenChange={setIsPrintAssessmentModalOpen}
					onOkButtonClick={handlePrintingOption}
					onCancelButtonClick={closeModal}
					title="Imprimir avaliação"
					okButtonText="Imprimir"
				>
					<p className="text-sm text-n-700">
						Selecione qual a visão da avaliação que deseja imprimir. Lembre-se,
						<span className="font-semibold">
							não compartilhe a impressão de visão geral com os pacientes
						</span>
						.
					</p>

					<RadioGroup
						value={selectedPrintingOption}
						onValueChange={(value) =>
							setSelectedPrintingOption(value as PrintingOptions)
						}
						options={printingOptions}
						className="flex-row mt-3"
					/>
				</DialogModal>
			)}
		</>
	);
}
