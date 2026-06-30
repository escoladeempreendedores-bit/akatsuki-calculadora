import { api } from "./api";

const getTaxesByMission = async (missionId) => {
    try {
        const response = await api.get(`/missions/${missionId}/taxes`)
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar taxas da missão.", error);
        throw error;
    }
}

const updateTax = async (missionId, id, payload) => {
    try {
        const response = await api.put(`/missions/${missionId}/taxes/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar a taxa.", error);
        throw error;
    }
}

export default{
    getTaxesByMission,
    updateTax
}