import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignIn } from '@/features/auth/composables/useSignIn'
import { loginSchema, type LoginFormValues } from '@/features/auth/validation/loginSchema'

export function LoginForm() {
	const navigate = useNavigate()
	const signIn = useSignIn({ onSuccess: () => navigate('/', { replace: true }) })

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', senha: '' },
	})

	function onSubmit(values: LoginFormValues) {
		signIn.mutate({ email: values.email, password: values.senha })
	}

	return (
		<form className="flex w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
			<div className="space-y-1.5">
				<Label htmlFor="login-email">Email</Label>
				<Input
					id="login-email"
					type="email"
					autoComplete="username"
					placeholder="Digite..."
					aria-invalid={!!errors.email}
					{...register('email')}
				/>
				{errors.email ? <p className="text-caption text-danger">{errors.email.message}</p> : null}
			</div>
			<div className="space-y-1.5">
				<Label htmlFor="login-senha">Senha</Label>
				<Input
					id="login-senha"
					type="password"
					autoComplete="current-password"
					placeholder="Digite..."
					aria-invalid={!!errors.senha}
					{...register('senha')}
				/>
				{errors.senha ? <p className="text-caption text-danger">{errors.senha.message}</p> : null}
			</div>
			{signIn.isError ? (
				<p className="text-caption text-danger">
					Não foi possível entrar. Verifique o e-mail e a senha.
				</p>
			) : null}
			<a href="#" className="self-start text-[13px] text-[#2f64c1] underline">
				Esqueceu a senha?
			</a>
			<Button type="submit" size="lg" className="w-full" isLoading={signIn.isPending}>
				Login
			</Button>
		</form>
	)
}
