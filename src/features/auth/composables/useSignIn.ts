import { useMutation } from '@tanstack/react-query'

import { handleUserSession } from '@/features/core/service/tokenService'
import { signIn } from '@/features/auth/service/auth'
import type { SignInResponse } from '@/features/auth/types/auth'

export function useSignIn(options?: { onSuccess?: () => void }) {
	return useMutation({
		mutationFn: signIn,
		onSuccess: ({ data }: { data: SignInResponse }) => {
			handleUserSession(data)
			options?.onSuccess?.()
		},
	})
}
