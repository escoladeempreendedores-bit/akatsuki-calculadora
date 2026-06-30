// src/pages/Costs.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import AddCostModal from "../components/AddCostModal";
import CategoryActions from "../components/CategoryActions";
import MissionTabs from "../components/MissionTabs";
import OrangeButton from "../components/OrangeButton";
import PageTitle from "../components/PageTitle";

import { categoriesAPI } from "../services/categoriesService";
import { formatBRL } from "../utils/currency";

const Costs = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // missionId vem da navegação (MissionData -> Costs)
  const missionId = location.state?.missionId;

  // carrega categorias do backend
  useEffect(() => {
    if (!missionId) {
      console.error("missionId não encontrado em /costs");
      setLoading(false);

      return;
    }

    let mounted = true;

    (async () => {
      try {
        const data = await categoriesAPI.list(missionId);

        const mapped = data.map((cat) => {
          const costsRaw = Array.isArray(cat.Costs)
            ? cat.Costs
            : cat.Costs
            ? [cat.Costs]
            : [];

          const total = costsRaw.reduce((acc, c) => {
            const q = c.final_quantity ?? c.initial_quantity ?? 0;
            const v = c.final_unit_value ?? c.initial_unit_value ?? 0;

            return acc + q * v;
          }, 0);

          return {
            id: cat.id,
            name: cat.name,
            type: cat.Types?.name ?? "",
            amount: total,
          };
        });

        if (mounted) setRows(mapped);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        if (mounted) alert("Erro ao carregar categorias");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [missionId, navigate]);

  const totalAmount = formatBRL(
    rows.reduce((acc, r) => acc + (r.amount ?? 0), 0)
  );

  // excluir categoria
  const handleDelete = async (row) => {
    const ok = window.confirm(`Excluir a categoria "${row.name}"?`);
    if (!ok) return;

    try {
      await categoriesAPI.remove(missionId, row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      alert("Erro ao excluir categoria");
    }
  };

  // criar categoria
  const handleCreate = async (payload) => {
    try {
      const created = await categoriesAPI.create(missionId, {
        name: payload.name,
        type_id: payload.type ?? null,
      });

      const costsRaw = Array.isArray(created.Costs)
        ? created.Costs
        : created.Costs
        ? [created.Costs]
        : [];

      const total = costsRaw.reduce((acc, c) => {
        const q = c.final_quantity ?? c.initial_quantity ?? 0;
        const v = c.final_unit_value ?? c.initial_unit_value ?? 0;
        return acc + q * v;
      }, 0);

      const row = {
        id: created.id,
        name: created.name,
        type: created.Types?.name ?? "",
        amount: total,
      };

      setRows((prev) => [...prev, row]);
      setShowAddModal(false);
    } catch (err) {
      console.error("Erro ao criar categoria:", err);
      alert("Erro ao criar categoria");
    }
  };

  return (
    <div>
      <main className="w-full">
        <PageTitle title="Custos" />

        <MissionTabs />

        {/* Table */}
        <div className="bg-white rounded-md shadow-md mt-4 overflow-hidden">
          <div className="max-h-[410px] overflow-y-auto">
            <table className="w-full table-fixed border-collapse text-center">
              <thead className="bg-[#2a3b8f] text-white sticky top-0 z-10">
                <tr>
                  <th className="py-5 w-[25%]">Categoria</th>
                  <th className="py-5 w-[25%]">Tipo</th>
                  <th className="py-5 w-[25%]">Total</th>
                  <th className="py-5 w-[25%]">Ações</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-gray-500 text-left pl-5"
                    >
                      Carregando…
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-gray-500 text-center">
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  rows.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-[#f8f9fe] border-border-color transition-colors"
                    >
                      <td className="py-5 px-3">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/costs/${item.id}`, {
                              state: { missionId },
                            })
                          }
                          className="
                    text-[#2a3b8f]
                    font-semibold
                    hover:underline
                    hover:text-[#1f2d6b]
                    transition-colors
                    break-words
                    whitespace-normal
                    max-w-full
                  "
                        >
                          {item.name}
                        </button>
                      </td>

                      <td className="py-5 px-3 break-words whitespace-normal">
                        {item.type}
                      </td>

                      <td className="py-5 px-3 text-[#2a3b8f] font-semibold">
                        {formatBRL(item.amount)}
                      </td>

                      <td className="py-5 px-3">
                        <CategoryActions
                          primaryLabel="Ver"
                          secondaryLabel="Excluir"
                          onPrimary={() =>
                            navigate(`/costs/${item.id}`, {
                              state: { missionId },
                            })
                          }
                          onSecondary={() => handleDelete(item)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end mt-6 border-t border-gray-300 pt-4">
          <h2 className="text-xl font-bold text-[#2a3b8f]">
            Total:&nbsp;{totalAmount}
          </h2>
        </div>

        {/* Add Category */}
        <div className="flex justify-center mt-8">
          <OrangeButton
            buttontype="button"
            buttonMessage="+ Adicionar Categoria"
            onClick={() => setShowAddModal(true)}
          />
        </div>
      </main>

      {/* Modal */}
      <AddCostModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default Costs;
