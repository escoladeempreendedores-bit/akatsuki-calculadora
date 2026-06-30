import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icarirLogo from "../assets/icarir_logo.svg";
import { useAuth } from '../context/authProvider';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password}),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Erro ao fazer login");
        return;
      }

      login({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user});

      navigate("/");
    } catch (err) {
      console.error("Erro no login:", err);
    }
  };

  return (
    <main className="grid grid-cols-2 min-h-dvh">
      <div className="bg-white flex justify-center items-center">
        <img src={icarirLogo} alt="Logo da empresa Icarir" />
      </div>

      <div className="bg-[#394C97] rounded-bl-2xl rounded-tl-2xl flex items-center px-10 flex-col justify-center">
        <div className="w-full max-w-[600px]">
          <div className="flex flex-col gap-4 w-full mb-10">
            <h1 className="text-6xl font-bold text-white">Login</h1>
            <p className="text-white text-xl font-medium">
              Acesse sua conta aqui.
            </p>
          </div>
          <form onSubmit={handleLogin} className="w-full max-w-[500px] flex flex-col items-center">
            <div className="flex flex-col gap-3 mb-6 w-full">
              <label htmlFor="email" className="text-xl text-white">
                Email:
              </label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/35 rounded-md px-4 py-3 text-white"
              />
            </div>
            <div className="flex flex-col gap-3 mb-2 w-full">
              <label htmlFor="password" className="text-xl text-white">
                Senha:
              </label>
              <div className="flex">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/35 rounded-md px-4 py-3 text-white flex-1"
                />
                <i className="bi bi-eye"></i>
                <i className="bi bi-eye-slash"></i>
              </div>
            </div>
            <Link to="forgotpassword" className="text-white underline font-semibold text-sm mb-6 w-full cursor-pointer">
              Esqueci minha senha
            </Link>
            <button type="submit" className="bg-[#FE5900] rounded-md px-10 py-2 text-white font-medium border-white border max-w-70 w-full cursor-pointer">
              Acessar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
