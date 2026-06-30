import icarirLogo from "../assets/icarir_logo.svg";
const ForgotPassword = () => {
  return (
    <main className="grid grid-cols-2 min-h-dvh">
      <div className="bg-white flex justify-center items-center">
        <img src={icarirLogo} alt="Logo da empresa Icarir" />
      </div>

      <div className="bg-[#394C97] rounded-bl-2xl rounded-tl-2xl flex items-center px-10 flex-col justify-center">
        <div className="w-full max-w-[600px]">
          <div className="flex flex-col gap-4 w-full mb-10">
            <h1 className="text-4xl font-bold text-white">
              Altere sua senha
            </h1>
            <p className="text-white text-xl font-medium">
              Use suas antigas credenciais de acesso
            </p>
          </div>
          <form className="w-full max-w-[500px] flex flex-col items-center">
            <div className="flex flex-col gap-3 mb-6 w-full">
              <label htmlFor="userName" className="text-xl text-white">
                usuário:
              </label>
              <input
                type="text"
                name="userName"
                id="userName"
                placeholder="Digite seu usuário"
                className="bg-white/35 rounded-md px-4 py-3 text-white"
              />
            </div>
            <div className="flex flex-col gap-3 mb-6 w-full">
              <label htmlFor="password" className="text-xl text-white">
                Senha Antiga:
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="digite sua antiga senha"
                  className="bg-white/35 rounded-md px-4 py-3 text-white flex-1"
                />
                <i className="bi bi-eye"></i>
                <i className="bi bi-eye-slash"></i>
              </div>
            </div>
            <div className="flex flex-col gap-3 mb-6 w-full">
              <label htmlFor="password" className="text-xl text-white">
                Nova Senha:
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="password"
                  id="password"
                  placeholder="digite sua nova senha"
                  className="bg-white/35 rounded-md px-4 py-3 text-white flex-1"
                />
                <i className="bi bi-eye"></i>
                <i className="bi bi-eye-slash"></i>
              </div>
            </div>
            <button className="bg-[#FE5900] rounded-md px-10 py-2 text-white font-medium border-white border max-w-70 w-full cursor-pointer">
              Acessar
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
