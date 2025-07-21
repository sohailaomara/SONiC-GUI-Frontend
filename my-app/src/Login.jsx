import { AuthLayout } from './components/auth-layout'
import { Button } from './components/button'
import { Checkbox, CheckboxField } from './components/checkbox'
import { Field, Label } from './components/fieldset'
import { Heading } from './components/heading'
import { Input } from './components/input'
import { Strong, Text, TextLink } from './components/text'
import Logo from './assets/logo.png'
import { Link } from 'react-router-dom'

function Login() {
  return (
    <AuthLayout>
      <form action="/login" method="POST" className="grid w-full max-w-sm grid-cols-1 gap-8">
        <img src={Logo} alt="Logo" className="h-11" />
        <Heading>Sign in to your account</Heading>
        <Field>
          <Label>Username</Label>
          <Input type="username" name="username" />
        </Field>
        <Field>
          <Label>Password</Label>
          <Input type="password" name="password" />
        </Field>
        <div className="flex items-center justify-between">
          <CheckboxField>
            <Checkbox name="remember" />
            <Label>Remember me</Label>
          </CheckboxField>
          <Text>
            <TextLink href="#">
              <Strong>Forgot password?</Strong>
            </TextLink>
          </Text>
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Text>
          Don’t have an account?{' '}
          <TextLink asChild>
            <Link to="/register">
              <Strong>Register</Strong>
            </Link>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  )
}
export default Login
