import {
	Info,
	OctagonAlert,
	TriangleAlert,
	type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";
import {
	Dialog,
	DialogBody,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./dialog";

type DialogModalVariant = "default" | "warning" | "danger" | "info";

interface DialogModalProps {
	onOpenChange: (open: boolean) => void;
	open: boolean;
	defaultOpen?: boolean;
	variant?: DialogModalVariant;
	title?: string;
	children: ReactNode;
	cancelButtonText?: string;
	okButtonText?: string;
	onOkButtonClick: () => void;
	onCancelButtonClick?: () => void;
	hasCancelButton?: boolean;
	icon?: LucideIcon;
	isOkButtonLoading?: boolean;
	isOkButtonDisabled?: boolean;
}

export default function DialogModal({
	onOpenChange,
	open,
	defaultOpen,
	variant = "default",
	children,
	title = "Você tem certeza disso?",
	cancelButtonText = "Cancelar",
	okButtonText = "Continuar",
	onOkButtonClick,
	onCancelButtonClick,
	hasCancelButton = true,
	icon = Info,
	isOkButtonLoading = false,
	isOkButtonDisabled = false,
}: DialogModalProps) {
	const headerIcon =
		icon ??
		(variant === "warning"
			? TriangleAlert
			: variant === "danger"
				? OctagonAlert
				: Info);

	function handleEscapeKey(e: KeyboardEvent) {
		if (hasCancelButton) {
			return;
		}
		e.preventDefault();
	}

	return (
		<Dialog
			onOpenChange={onOpenChange}
			open={open}
			defaultOpen={defaultOpen}
			variant={variant}
			headerIcon={headerIcon}
		>
			<DialogContent
				onInteractOutside={(e) => e.preventDefault()}
				onEscapeKeyDown={handleEscapeKey}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>

				<DialogBody>{children}</DialogBody>

				<DialogFooter>
					{hasCancelButton && (
						<Button
							onClick={onCancelButtonClick}
							variant="outline"
							disabled={isOkButtonLoading}
						>
							{cancelButtonText}
						</Button>
					)}

					<Button
						onClick={onOkButtonClick}
						variant={variant}
						isLoading={isOkButtonLoading}
						disabled={isOkButtonDisabled}
					>
						{okButtonText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
