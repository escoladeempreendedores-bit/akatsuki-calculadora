import { NavLink, useNavigate } from "react-router-dom";
import icarir_logo from "../assets/icarir_logo.svg";
import { useAuth } from "../context/authProvider";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const baseBtn =
    "px-8 py-2 rounded-md text-xl font-bold cursor-pointer transition focus:outline-none";
  const idleBlue =
    "text-[#394C97] hover:text-[#2a3b8f] hover:bg-blue-50 focus:ring-2 focus:ring-blue-200";
  const activeBlue =
    "text-white bg-[#2a3b8f] hover:bg-[#2a3b8f] focus:ring-2 focus:ring-blue-200";

  const linkClass = ({ isActive }) =>
    `${baseBtn} ${isActive ? activeBlue : idleBlue}`;

  return (
    <header className="bg-white border-b border-blue-200 px-10 py-3 mb-4">
      <div className="max-w-6xl w-full m-auto  flex items-center gap-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3"
          aria-label="Início"
        >
          <img
            src={icarir_logo}
            alt="Logo da Icarir"
            className="h-8 md:h-10 lg:h-24 w-auto cursor-pointer"
          />
        </button>

        <nav className="ml-auto flex items-center gap-3">
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/mission" className={linkClass}>
            Missões
          </NavLink>

          <NavLink to="/taxes" className={linkClass}>
            Taxas e Margens
          </NavLink>

          <NavLink to="/userlist" className={linkClass}>
            Lista de Usuários
          </NavLink>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-4 py-2 rounded-md text-xl font-bold cursor-pointer
                     text-secondary-orange hover:text-orange-600
                     hover:bg-orange-50 focus:outline-none focus:ring-2
                     focus:ring-orange-200 transition"
          >
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}
