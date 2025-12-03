import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../api/index';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authApi.register({ name, email, password });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-3xl animate-fade-in-up">
        <h2 className="mb-2 text-3xl font-bold text-center text-gray-800">Đăng ký</h2>
        <p className="mb-8 text-center text-gray-500">Tạo tài khoản mới</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" className="w-full px-4 py-3 border outline-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500" placeholder="Họ tên" value={name} onChange={e => setName(e.target.value)} required />
          <input type="email" className="w-full px-4 py-3 border outline-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" className="w-full px-4 py-3 border outline-none rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full py-3.5 font-bold text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/30">Đăng ký</button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Đã có tài khoản? <Link to="/login" className="font-bold text-blue-600 hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
