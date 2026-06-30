// src/services/categoriesService.js
import { api } from "./api";

export const categoriesAPI = {
  // lista categorias da missão
  list: async (missionId) => {
    const res = await api.get(`/missions/${missionId}/categories`);
    return res.data;
  },

  // busca 1 categoria da missão
  get: async (missionId, id) => {
    const res = await api.get(`/missions/${missionId}/categories/${id}`);
    return res.data;
  },

  // cria categoria na missão
  create: async (missionId, payload) => {
    const res = await api.post(`/missions/${missionId}/categories`, {
      name: payload.name,
      // se o back ainda aceitar type_id, mantemos:
      type_id: payload.type_id ?? null,
    });
    return res.data;
  },

  // atualiza categoria da missão
  update: async (missionId, id, payload) => {
    const res = await api.put(`/missions/${missionId}/categories/${id}`, {
      name: payload.name,
      type_id: payload.type_id ?? null,
    });
    return res.data.category ?? res.data;
  },

  // remove categoria da missão
  remove: async (missionId, id) => {
    const res = await api.delete(`/missions/${missionId}/categories/${id}`);
    return res.data;
  },
};
