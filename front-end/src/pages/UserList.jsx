import PageTitle from "../components/PageTitle";
import OrangeButton from "../components/OrangeButton";
import { getAllUsers, deleteUser } from "../services/userListService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllUsers();
      setUser(response);
    } catch (err) {
      setError("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (value) => {
    setSearch(value);
  };

  const visibleUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateUser = () => {
    navigate("/user");
  };

  const handleEditUser = (userId) => {
    navigate("/user", { state: { userId } });
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}"?`)) {
      return;
    }

    try {
      await deleteUser(userId);
      alert("Usuário excluído com sucesso!");
      fetchUsers(); // Recarrega a lista
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir usuário");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="w-full">
      <PageTitle title="Usuários" />
      <section className="flex flex-col gap-9 pt-3">
        <div className="flex gap-6">
          <input
            type="search"
            placeholder="Pesquisar Usuarios..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="
                w-[77%] py-3 px-5
                bg-background-white
                border border-border-color
                rounded-2xl
                text-description-gray
                outline-none
                shadow-sm"
          />
          <OrangeButton
            buttontype="button"
            buttonMessage="+ Cadastrar Usuário"
            onClick={handleCreateUser}
          />
        </div>

        <div className="bg-white rounded-md shadow-md mt-4 overflow-hidden">
          <div className="max-h-[455px] overflow-y-auto">
            <table className="w-full table-fixed border-collapse text-center">
              <thead className="bg-[#2a3b8f] text-white sticky top-0 z-10">
                <tr>
                  <th className="py-5 w-[25%]">Nome</th>
                  <th className="py-5 w-[20%]">Nível</th>
                  <th className="py-5 w-[30%]">Email</th>
                  <th className="py-5 w-[25%]">Ações</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-gray-500 text-left pl-5">
                      Carregando...
                    </td>
                  </tr>
                ) : visibleUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-gray-500">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  visibleUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-[#f8f9fe] border-border-color transition-colors"
                    >
                      <td className="py-5 px-3 break-words whitespace-normal">
                        {user.name ?? "-"}
                      </td>

                      <td className="py-5 px-3">
                        {user.level_id === 1 ? "Admin" : "Gestor"}
                      </td>

                      <td className="py-5 px-3 break-words whitespace-normal">
                        {user.email}
                      </td>

                      <td className="py-5 px-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-medium"
                            title="Editar usuário"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
                            title="Excluir usuário"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};

export default UserList;
