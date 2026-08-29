import loginIllustration from '@/assets/illustrations/login-gestante.svg'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
	return (
		<AuthLayout illustration={loginIllustration} tagline="Ciência e dados a serviço da saúde materna.">
			<LoginForm />
		</AuthLayout>
	)
}
