// src/pages/CategoryDetails.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AddItemModal from "../components/AddItemModal";
import CategoryActions from "../components/CategoryActions";
import MissionTabs from "../components/MissionTabs";
import OrangeButton from "../components/OrangeButton";
import PageTitle from "../components/PageTitle";

import { categoriesAPI } from "../services/categoriesService";
import {
  createCategoryItem,
  deleteCategoryItem,
  updateCategoryItem,
} from "../services/categoryItemsService";

import { toggleSelectedCost } from "../services/costsService";

import { formatBRL, rowTotal } from "../utils/currency";

const mapCostToRow = (c) => ({
  id: c.id,
  description: c.description,
  quantity: c.initial_quantity ?? c.quantity ?? 0,
  unitPrice: c.initial_unit_value ?? c.unitPrice ?? 0,
  selected: !!c.selected,
});

export default function CategoryCostsDetails() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const missionId = location.state?.missionId;
  const id = Number(categoryId);

  const [category, setCategory] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // carrega categoria + itens
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (!missionId) {
          throw new Error("missionId não informado");
        }

        const cat = await categoriesAPI.get(missionId, id);

        const costsRaw = Array.isArray(cat.Costs)
          ? cat.Costs
          : cat.Costs
          ? [cat.Costs]
          : [];

        const items = costsRaw.map(mapCostToRow);

        if (mounted) {
          setCategory(cat);
          setRows(items);
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro ao carregar categoria:", err);
        if (mounted) setLoading(false);
        alert("Erro ao carregar categoria");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, missionId]);

  // Total só dos itens selecionados
  const total = rows.reduce(
    (acc, it) => (it.selected ? acc + rowTotal(it) : acc),
    0
  );

  const handleCreate = async (payload) => {
    const createdCost = await createCategoryItem(id, payload);
    const created = mapCostToRow(createdCost);

    setRows((prev) => [...prev, created]);
    setShowModal(false);
  };

  const handleEditStart = (row) => {
    setEditingItem(row);
    setShowModal(true);
  };

  // alternar seleção do checkbox
  const handleToggleSelected = async (costId) => {
    try {
      const updatedCost = await toggleSelectedCost(costId);

      setRows((prev) =>
        prev.map((row) =>
          row.id === updatedCost.id
            ? { ...row, selected: !!updatedCost.selected }
            : row
        )
      );
    } catch (err) {
      console.error("Erro ao alternar seleção do custo:", err);
      alert("Erro ao atualizar seleção do item");
    }
  };

  const handleEditSubmit = async (payload) => {
    const updatedCost = await updateCategoryItem(id, payload.id, {
      description: payload.description,
      quantity: payload.quantity,
      unitPrice: payload.unitPrice,
    });
    const updated = mapCostToRow(updatedCost);

    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDelete = async (row) => {
    const ok = confirm(`Excluir "${row.description}"?`);
    if (!ok) return;
    await deleteCategoryItem(id, row.id);

    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const handleUpsert = (payload) =>
    editingItem ? handleEditSubmit(payload) : handleCreate(payload);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  return (
    <div>
      <main className="w-full">
        {/* Header da página */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 line-clamp-2 text-2xl font-bold text-[#2a3b8f]">
            <PageTitle title={category?.name || "Categoria"} />
          </div>
          <button
            onClick={() => navigate("/costs", { state: { missionId } })}
            className="rounded-xl bg-white cursor-pointer px-6 py-3 font-semibold text-[#2a3b8f] shadow-sm ring-1 ring-black/10 hover:bg-gray-50"
          >
            Voltar
          </button>
        </div>

        <MissionTabs />

        {/* Tabela */}
 <div className="bg-white rounded-md shadow-md mt-4 overflow-hidden">
  <div className="max-h-[410px] overflow-y-auto">
    <table className="w-full table-fixed border-collapse text-center">
      <thead className="bg-[#2a3b8f] text-white sticky top-0 z-10">
        <tr>
          <th className="py-5 w-[15%]">Selecionar</th>
          <th className="py-5 w-[19%]">Descrição</th>
          <th className="py-5 w-[14%]">Quantidade</th>
          <th className="py-5 w-[20%]">Valor Unitário</th>
          <th className="py-5 w-[15%]">Total</th>
          <th className="py-5 w-[17%]">Ações</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan={6} className="py-6 text-gray-500 text-left pl-5">
              Carregando…
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={6} className="py-6 text-gray-500 text-center">
              Nenhuma item encontrado.
            </td>
          </tr>
        ) : (
          rows.map((item) => (
            <tr
              key={item.id}
              className="border-b hover:bg-[#f8f9fe] border-border-color transition-colors"
            >
              <td className="py-5 px-3">
                <input
                  type="checkbox"
                  aria-label={`Selecionar ${item.description}`}
                  checked={item.selected}
                  onChange={() => handleToggleSelected(item.id)}
                  className="h-4 w-4 rounded border-gray-300 text-[#2a3b8f] focus:ring-[#2a3b8f]"
                />
              </td>

              <td className="py-5 px-3 break-words whitespace-normal">
                {item.description}
              </td>

              <td className="py-5 px-3">
                {item.quantity}
              </td>

              <td className="py-5 px-3">
                {formatBRL(item.unitPrice)}
              </td>

              <td className="py-5 px-3 text-[#2a3b8f] font-semibold">
                {formatBRL(rowTotal(item))}
              </td>

              <td className="py-5 px-3">
                <CategoryActions
                  primaryLabel="Editar"
                  secondaryLabel="Excluir"
                  onPrimary={() => handleEditStart(item)}
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


        {/* Total (só dos selecionados) */}
        <div className="flex justify-end mt-6 border-t border-gray-300 pt-4">
          <h2 className="text-xl font-bold text-[#2a3b8f]">
            Total:&nbsp;{formatBRL(total)}
          </h2>
        </div>

        {/* Botão adicionar */}
        <div className="flex justify-center mt-8">
          <OrangeButton
            buttontype="button"
            buttonMessage="+ Adicionar Item"
            onClick={handleOpenCreate}
          />
        </div>
      </main>

      {/* Modal (add/edit) */}
      <AddItemModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleUpsert}
        initialValues={editingItem}
      />
    </div>
  );
}
