import { AuthLayout } from './components/auth-layout'
import { Button } from './components/button'
import { Checkbox, CheckboxField } from './components/checkbox'
import { Field, Label } from './components/fieldset'
import { Heading } from './components/heading'
import { Input } from './components/input'
import { Select } from './components/select'
import { Strong, Text, TextLink } from './components/text'
import Logo from './assets/logo.png'
import { Link } from 'react-router-dom'

function Register() {
  return (
    <AuthLayout>
      <form action="register" method="POST" className="grid w-full max-w-sm grid-cols-1 gap-8">
        <img src={Logo} alt="Logo" className="h-11" />
        <Heading>Create your account</Heading>
        <Field>
          <Label>Email</Label>
          <Input type="email" name="email" />
        </Field>
        <Field>
          <Label>Username</Label>
          <Input name="name" />
        </Field>
        <Field>
          <Label>Password</Label>
          <Input type="password" name="password" autoComplete="new-password" />
        </Field>
        <CheckboxField>
          <Checkbox name="remember" />
          <Label>Get emails about product updates and news.</Label>
        </CheckboxField>
        <Button type="submit" className="w-full">
          Create account
        </Button>
        <Text>
          Already have an account?{' '}
          <TextLink asChild>
            <Link to="/login">
              <Strong>Sign in</Strong>
            </Link>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  )
}
export default Register;
