import { api } from "./api";

// ===== MISSIONS =====

// lista todas as missões
export const getMissions = () => api.get("/missions");

// busca missão por id
export const getMissionById = (id) => api.get(`/missions/${id}`);

// cria missão
export const createMission = (data) =>
  api.post("/missions", {
    name: data.name,
    description: data.description,
    number_participants:
      data.number_participants != null
        ? Number(data.number_participants)
        : null,
    number_consolidated_participants:
      data.number_consolidated_participants == null ||
      data.number_consolidated_participants === ""
        ? null
        : Number(data.number_consolidated_participants),
  });

// atualiza missão
export const updateMission = (id, data) =>
  api.put(`/missions/${id}`, {
    name: data.name,
    description: data.description,
    number_participants:
      data.number_participants != null
        ? Number(data.number_participants)
        : null,
    number_consolidated_participants:
      data.number_consolidated_participants == null ||
      data.number_consolidated_participants === ""
        ? null
        : Number(data.number_consolidated_participants),
  });

// remove missão
export const deleteMission = (id) => api.delete(`/missions/${id}`);

// cria cópia da missão
export const cloneMission = (id) => api.post(`/missions/${id}/clone`);
