"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
	Info,
	OctagonAlert,
	TriangleAlert,
	XIcon,
	type LucideIcon,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const dialogHeaderVariants = cva(
	"flex items-center gap-2 text-center sm:text-left rounded-t-lg px-5 py-6 text-2xl text-n-800 font-semibold",
	{
		variants: {
			variant: {
				default: "bg-t-100",
				warning: "bg-y-100",
				danger: "bg-r-100",
				info: "bg-b-100",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const dialogHeaderIconVariants = cva("", {
	variants: {
		variant: {
			default: "text-t-400",
			warning: "text-y-400",
			danger: "text-r-500",
			info: "text-b-400",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type DialogContextProps = {
	variant?: VariantProps<typeof dialogHeaderVariants>["variant"];
	headerIcon?: LucideIcon;
};

const DialogContext = React.createContext<DialogContextProps>({
	variant: "default",
	headerIcon: Info,
});

function Dialog({
	variant = "default",
	headerIcon,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Root> & DialogContextProps) {
	const resolvedHeaderIcon =
		headerIcon ??
		(variant === "warning"
			? TriangleAlert
			: variant === "danger"
				? OctagonAlert
				: Info);

	return (
		<DialogContext.Provider value={{ variant, headerIcon: resolvedHeaderIcon }}>
			<DialogPrimitive.Root data-slot="dialog" {...props} />
		</DialogContext.Provider>
	);
}

function DialogTrigger({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
	...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	showCloseButton = false,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean;
}) {
	return (
		<DialogPortal data-slot="dialog-portal">
			<DialogOverlay />
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg border shadow-lg duration-200 outline-none sm:max-w-lg",
					className,
				)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<DialogPrimitive.Close
						data-slot="dialog-close"
						className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
					>
						<XIcon />
						<span className="sr-only">Close</span>
					</DialogPrimitive.Close>
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	const { variant, headerIcon: Icon = Info } = React.useContext(DialogContext);

	return (
		<div
			data-slot="dialog-header"
			className={cn(dialogHeaderVariants({ variant }), className)}
			{...props}
		>
			<Icon
				className={cn(dialogHeaderIconVariants({ variant }))}
				size={28}
				strokeWidth={1.75}
			/>
			<div className="flex flex-col gap-2">{props.children}</div>
		</div>
	);
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div data-slot="dialog-body" className={cn("p-6", className)} {...props} />
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-center pb-4 px-6",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn("text-2xl leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-n-700 text-sm font-normal", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
