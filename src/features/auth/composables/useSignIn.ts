import { useMutation } from '@tanstack/react-query'

import { handleUserSession } from '@/features/core/service/tokenService'
import { signIn } from '@/features/auth/service/auth'
import type { SignInPayload, SignInResponse } from '@/features/auth/types/auth'

export function useSignIn(options?: { onSuccess?: () => void }) {
	return useMutation({
		mutationFn: async (payload: SignInPayload): Promise<SignInResponse> => {
			const response = await signIn(payload)
			return response.data as SignInResponse
		},
		onSuccess: (data: SignInResponse) => {
			handleUserSession(data)
			options?.onSuccess?.()
		},
	})
}
