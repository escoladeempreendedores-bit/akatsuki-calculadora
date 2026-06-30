// src/services/categoryItemsService.js
import { api } from "./api";

// BUSCAR itens da categoria (filtra no front)
export async function fetchCategoryItems(categoryId) {
  const res = await api.get("/costs"); 
  const all = res.data || [];

  return all.filter(
    (item) => String(item.category_id) === String(categoryId)
  );
}

/** normaliza valores numéricos vindos do form */
function toNumberOrNull(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

/** CRIAR item (linha de custo) */
export async function createCategoryItem(categoryId, payload) {
  const res = await api.post("/costs", {
    description: payload.description,
    initial_quantity: toNumberOrNull(payload.quantity),
    initial_unit_value: toNumberOrNull(payload.unitPrice),
    category_id: Number(categoryId),
  });

  return res.data;
}

/** ATUALIZAR item */
export async function updateCategoryItem(categoryId, itemId, payload) {
  const res = await api.put(`/costs/${itemId}`, {
    description: payload.description,
    initial_quantity: toNumberOrNull(payload.quantity),
    initial_unit_value: toNumberOrNull(payload.unitPrice),
    category_id: Number(categoryId),
  });

  return res.data;
}

/** DELETAR item */
export async function deleteCategoryItem(categoryId, itemId) {
  const res = await api.delete(`/costs/${itemId}`);
  return res.data;
}
