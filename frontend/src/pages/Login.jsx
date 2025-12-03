import { useState } from 'react'
import { loginApi } from '../api/authApi'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await loginApi({ email, password })

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))

      alert('Login thành công')
      navigate('/') // VỀ HOME
    } catch (err) {
      alert(err.response?.data?.message || 'Login thất bại')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-6 rounded w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Đăng nhập</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded"
        >
          Login
        </button>

        {/*  LINK QUA REGISTER */}
        <p className="mt-4 text-center">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-blue-500 underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
