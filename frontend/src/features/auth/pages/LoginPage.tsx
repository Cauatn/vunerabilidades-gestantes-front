import loginIllustration from '@/assets/illustrations/login-gestante.png'
import { Description, Heading } from '@/components/typography'
import { LoginForm } from '@/features/auth/components/LoginForm'

export function LoginPage() {
	return (
		<div className="flex min-h-svh w-full flex-col lg:flex-row">
			<div
				className="h-56 shrink-0 bg-p-500 bg-cover bg-center bg-no-repeat lg:h-auto lg:w-[42%]"
				style={{ backgroundImage: `url(${loginIllustration})` }}
				aria-hidden
			/>
			<div className="flex flex-1 items-center justify-center bg-n-0 px-6 py-10 sm:px-10">
				<div className="w-full max-w-[420px]">
					<header className="mb-10 text-center">
						<Heading as="h1" size="page" className="text-4xl font-bold text-n-900">
							Pré-Natal
						</Heading>
						<Description className="mt-4">
							Acesse o sistema da Escala Brasileira de Vulnerabilidade Social no Pré-Natal.
						</Description>
					</header>

					<LoginForm />
				</div>
			</div>
		</div>
	)
}
