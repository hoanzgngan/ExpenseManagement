import { useState } from 'react'
import { registerApi } from '../api/authApi'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      await registerApi({ name, email, password })
      alert('Đăng ký thành công, mời đăng nhập')
      navigate('/login') //  CHUYỂN VỀ LOGIN
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng ký thất bại')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input
          type="text"
          placeholder="Tên"
          className="w-full p-2 mb-3 text-black"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 text-black"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-2 mb-3 text-black"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 p-2 rounded hover:bg-green-700"
        >
          Đăng ký
        </button>

        {/* LINK QUA LOGIN */}
        <p className="mt-4 text-center">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-blue-500 underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
