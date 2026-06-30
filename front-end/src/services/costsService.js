// front-end/src/services/costsService.js
import { mockedCosts } from '../mocks/costs.mock';
import { api } from './api';

const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

const mapToUi = (rows) =>
  rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    amount: Number(r.amount ?? 0),
  }));

export async function fetchCosts() {
  if (useMocks) {
    await new Promise((res) => setTimeout(res, 150));
    return mapToUi(mockedCosts);
  }

  const res = await api.get('/costs');
  return mapToUi(res.data);
}

export async function getCategoryById(id) {
  if (useMocks) {
    const row = mockedCosts.find((c) => c.id === id);
    await new Promise((res) => setTimeout(res, 100));
    return row ? { ...row } : null;
  }

  const res = await api.get(`/costs/${id}`);
  return res.data;
}

export async function createCost(payload) {
  if (useMocks) {
    const newItem = {
      id: String(Date.now()),
      name: payload.name,
      type: payload.type,
      amount: 0,
    };
    mockedCosts.push(newItem);
    await new Promise((res) => setTimeout(res, 120));
    return newItem;
  }

  const res = await api.post('/costs', {
    ...payload,
    amount: 0,
  });

  return res.data;
}

export const sumAmounts = (rows) =>
  rows.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0);

// Novo serviço para alternar selected usando axios `api` (Sâmia)
export async function toggleSelectedCost(costId) {
  try {
    const res = await api.patch(`/costs/${costId}/toggle-selected`);
    return res.data;
  } catch (resError) {
    console.error(
      'toggleSelectedCost error',
      resError.response?.status,
      resError.response?.data
    );
    throw new Error('Failed to toggle selected cost');
  }
}
