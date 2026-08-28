import { api } from '@/features/core/service/apiService'
import type { SignInPayload } from '@/features/auth/types/auth'

export const signIn = (payload: SignInPayload) => api.post('/auth/login', payload)
