import { useMutation } from "@tanstack/react-query";

import { acceptInvitation } from "@/features/auth/service/auth";

export function useAcceptInvitation(options?: {
	onSuccess?: () => void;
	onError?: () => void;
}) {
	return useMutation({
		mutationFn: acceptInvitation,
		onSuccess: options?.onSuccess,
		onError: options?.onError,
	});
}
