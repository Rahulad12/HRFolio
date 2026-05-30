import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import GoogleLoginButton from './components/GoogleLoginButton'
import WelcomeBackCard from './components/WelcomeBackCard'
import { Divider, Typography } from 'antd'

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const { setCredentials } = useAuth()
  const googleURL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const name = searchParams.get('name')
    const picture = searchParams.get('picture')
    const userId = searchParams.get('Id')

    if (token && email && name) {
      setCredentials({
        token,
        email,
        username: name,
        picture: picture || '',
        Id: userId || '',
      })
      navigate('/dashboard')
    }
  }, [searchParams, setCredentials, navigate])

  const submitHandler = () => {
    setIsLoading(true)
    window.location.href = `${googleURL}auth/google`
  }

  const shouldShowWelcomeBack = localStorage.getItem('googleLogin') === 'true'

  return (
    <div className="w-full space-y-6">
      <div className="space-y-4">
        {shouldShowWelcomeBack ? (
          <WelcomeBackCard submitHandler={submitHandler} loading={isLoading} />
        ) : (
          <GoogleLoginButton onClick={submitHandler} loading={isLoading} />
        )}
      </div>

      <Divider className="text-neutral-400">
        <span className="text-xs uppercase tracking-wider">Secure Sign-In</span>
      </Divider>

      <div className="text-center text-sm text-neutral-400 space-y-4">
        <Typography.Text>
          By signing in, you agree to HRfolio's
          <a href="#" className="mx-1">
            <Typography.Text strong>Terms of Service</Typography.Text>
          </a>
          and
          <a href="#" className="mx-1">
            <Typography.Text strong>Privacy Policy</Typography.Text>
          </a>
        </Typography.Text>

        <Typography.Text>
          Need assistance?{' '}
          <a href="#" className="text-primary-500 hover:text-primary-600">
            <Typography.Text strong>Contact Support</Typography.Text>
          </a>
        </Typography.Text>
      </div>
    </div>
  )
}
