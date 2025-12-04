import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, CheckCircle, Facebook, Chrome } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { api } from '../api'; 
import './Login.css';

function Login() {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login); 

  //STATE CHO LOGIN 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // STATE CHO REGISTER 
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Xử lý Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }

    try {
      // Gọi API đăng nhập
      const res = await api.login({ email, password });
      
      // Lưu vào Store & LocalStorage
      loginStore(res.data.token, res.data.user);

      alert('Đăng nhập thành công!');
      navigate('/'); 
    } catch (err) {
      const message = err?.response?.data?.message || 'Đăng nhập thất bại';
      alert(message);
    }
  };

  // Xử lý Register
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!regName || !regEmail || !regPassword) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      // Gọi API đăng ký
      await api.register({
        name: regName,
        email: regEmail,
        password: regPassword,
      });

      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      setIsRightPanelActive(false); // Chuyển về tab login
      
      // Reset form
      setRegName(''); setRegEmail(''); setRegPassword(''); setRegConfirmPassword('');
    } catch (err) {
      const message = err?.response?.data?.message || 'Đăng ký thất bại';
      alert(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-pink-100 to-blue-200">
      <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="container">
        
        {/* FORM ĐĂNG KÝ */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister} className="flex flex-col items-center justify-center h-full px-12 text-center bg-white">
            <h1 className="mb-4 text-3xl font-bold">Đăng ký</h1>
            <span className="mb-4 text-sm text-gray-500">Tạo tài khoản mới</span>
            
            <div className="relative w-full mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input type="text" placeholder="Họ và tên" className="w-full px-10 py-3 bg-gray-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                value={regName} onChange={(e) => setRegName(e.target.value)} />
            </div>

            <div className="relative w-full mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input type="email" placeholder="Email" className="w-full px-10 py-3 bg-gray-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                value={regEmail} onChange={(e) => setRegEmail(e.target.value)} />
            </div>

            <div className="relative w-full mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input type="password" placeholder="Mật khẩu" className="w-full px-10 py-3 bg-gray-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                value={regPassword} onChange={(e) => setRegPassword(e.target.value)} />
            </div>

             <div className="relative w-full mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CheckCircle size={18} className="text-gray-400" />
              </div>
              <input type="password" placeholder="Xác nhận mật khẩu" className="w-full px-10 py-3 bg-gray-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                value={regConfirmPassword} onChange={(e) => setRegConfirmPassword(e.target.value)} />
            </div>

            <button className="px-10 py-3 mt-2 font-bold tracking-wider text-white uppercase transition transform bg-blue-600 rounded-full hover:scale-105 active:scale-95">
              Đăng ký
            </button>
          </form>
        </div>

        {/*FORM ĐĂNG NHẬP*/}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin} className="flex flex-col items-center justify-center h-full px-12 text-center bg-white">
            <h1 className="mb-4 text-3xl font-bold">Đăng nhập</h1>
            <span className="mb-6 text-sm text-gray-500">Chào mừng bạn quay trở lại!</span>
            
            <div className="relative w-full mb-4">
               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input type="email" placeholder="Email" className="w-full px-10 py-3 bg-gray-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="relative w-full mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input type="password" placeholder="Mật khẩu" className="w-full px-10 py-3 bg-gray-100 border-none rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button className="px-10 py-3 font-bold tracking-wider text-white uppercase transition transform bg-blue-600 rounded-full hover:scale-105 active:scale-95">
              Đăng nhập
            </button>
          </form>
        </div>

        {/* OVERLAY */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="mb-4 text-3xl font-bold">Xin chào!</h1>
              <p className="mb-8 text-base leading-6">Đã có tài khoản? Đăng nhập ngay</p>
              <button className="px-10 py-3 font-bold text-white uppercase border border-white rounded-full hover:bg-white hover:text-blue-600" onClick={() => setIsRightPanelActive(false)}>Đăng nhập</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="mb-4 text-3xl font-bold">Chào bạn!</h1>
              <p className="mb-8 text-base leading-6">Chưa có tài khoản? Đăng ký ngay</p>
              <button className="px-10 py-3 font-bold text-white uppercase border border-white rounded-full hover:bg-white hover:text-blue-600" onClick={() => setIsRightPanelActive(true)}>Đăng ký</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;