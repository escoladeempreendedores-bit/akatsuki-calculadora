import { api } from "./api";


const getAllDefaultTaxes = async () => {
    try {
        const response = await api.get('/defaultTaxes');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar taxas padrões.", error);
        throw error;
    }
}

const updateDefaultTax = async (id, payload) => {
    try {
        const response = await api.put(`/defaultTaxes/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar a taxa.", error);
        throw error;
    }
}

export default {
    getAllDefaultTaxes,
    updateDefaultTax
};