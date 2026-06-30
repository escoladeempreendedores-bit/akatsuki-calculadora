import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PageTitle from "../components/PageTitle";
import { userSchema, userEditSchema } from "../utils/userSchema";
import { createUser, getUserById, updateUser } from "../services/userListService";

const UserPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId || null;
  const isEditMode = Boolean(userId);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isEditMode ? userEditSchema : userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      level_id: 1,
    },
  });

  useEffect(() => {
    if (!isEditMode) return;

    setLoading(true);
    getUserById(userId)
      .then((data) => {
        reset({
          name: data.name || "",
          email: data.email || "",
          level_id: data.level_id || 1,
        });
      })
      .catch((err) => {
        console.error(err);
        alert("Erro ao carregar dados do usuário");
        navigate("/userlist");
      })
      .finally(() => setLoading(false));
  }, [isEditMode, userId, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        const updatePayload = {
          name: data.name.trim(),
          email: data.email.trim(),
          level_id: Number(data.level_id),
        };
        
        // Só inclui password se foi preenchido
        if (data.password && data.password.trim().length > 0) {
          updatePayload.password = data.password;
        }
        
        await updateUser(userId, updatePayload);
        alert("Usuário atualizado com sucesso!");
        navigate("/userlist");
      } else {
        await createUser({
          name: data.name.trim(),
          email: data.email.trim(),
          password: data.password,
          level_id: Number(data.level_id),
        });
        alert("Usuário cadastrado com sucesso!");
        reset();
      }
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert(`Erro ao ${isEditMode ? "atualizar" : "cadastrar"} usuário`);
    }
  };

  return (
    <div className="w-full">
      <div className="pb-10">
        <PageTitle title={isEditMode ? "Editar Usuário" : "Cadastrar Usuário"} />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-8 relative">
        <div className="absolute left-0 top-0 h-full w-[14px] bg-[#2a3b8f] rounded-l-xl" />

        {loading ? (
          <p className="text-gray-500 mt-10">Carregando...</p>
        ) : (
          <>
            {/* SELECT para escolher level */}
            <div className="absolute top-8 right-8">
              <select
                {...register("level_id")}
                className="bg-[#E1E7FF] text-[#2E3F8F] px-4 py-2 rounded-xl shadow-sm font-medium outline-none cursor-pointer"
              >
                <option value={1}>Administrador</option>
                <option value={2}>Gestor</option>
              </select>
              {errors.level_id && (
                <p className="text-red-500 text-sm mt-1">{errors.level_id.message}</p>
              )}
            </div>

            {/* Form */}
            <form className="space-y-6 mt-10" onSubmit={handleSubmit(onSubmit)}>
              {/* Nome */}
              <div>
                <label className="block text-[#2E3F8F] font-semibold pl-2 text-lg mb-5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full bg-[#F3F5FF] px-4 py-4 rounded-3xl outline-none"
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#2E3F8F] font-semibold pl-2 text-lg mb-5">
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full bg-[#F3F5FF] px-4 py-4 rounded-3xl outline-none"
                  placeholder="seuemail@exemplo.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Senhas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#2E3F8F] font-semibold pl-2 text-lg mb-5">
                    {isEditMode ? "Nova Senha (opcional)" : "Nova Senha"}
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    className="w-full bg-[#F3F5FF] px-4 py-4 rounded-3xl outline-none"
                    placeholder={isEditMode ? "Deixe em branco para manter" : "Digite a nova senha"}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[#2E3F8F] font-semibold pl-2 text-lg mb-5">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    className="w-full bg-[#F3F5FF] px-4 py-4 rounded-3xl outline-none"
                    placeholder="Confirme a nova senha"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Botão */}
              <div className="w-full flex justify-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#FF5A00] text-white px-10 py-3 rounded-lg text-lg cursor-pointer font-semibold shadow hover:bg-[#e65000] transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Salvando..."
                    : isEditMode
                    ? "Atualizar Usuário"
                    : "Cadastrar Usuário"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPage;
