import { api } from "./api";

export const getMarginOptions = async () => {
    try {
        const response = await api.get(`/missionDash/margin-options`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar opções de margem.", error);
        throw error;
    }
};

export const getPersonsByMission = async (id) => {
    try {
        const response = await api.get(`/missionDash/${id}/persons`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar número de pessoas da missão.", error);
        throw error;
    }
};

export const getMission = async (id) => {
    try {
        const response = await api.get(`/missionDash/${id}/mission`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar a missão.", error);
        throw error;
    }
};

export const getItemByMission = async (id) => {
    try {
        const response = await api.get(`/missionDash/${id}/items`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar a quantidade de categorias da missão", error);
        throw error;
    }
};

export const getMissionMargin = async (id, marginKey = null) => {
    try {
        const url = marginKey 
            ? `/missionDash/${id}/margin?margin=${marginKey}`
            : `/missionDash/${id}/margin`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o lucro bruto da missão.", error);
        throw error;
    }
};

export const getMissionMarginPercentege = async (id, marginKey = null) => {
    try {
        const url = marginKey 
            ? `/missionDash/${id}/margin-percentege?margin=${marginKey}`
            : `/missionDash/${id}/margin-percentege`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar a porcentagem do lucro bruto da missão.", error);
        throw error;
    }
};

export const getMissionTaxe = async (id, marginKey = null) => {
    try {
        const url = marginKey 
            ? `/missionDash/${id}/taxes?margin=${marginKey}`
            : `/missionDash/${id}/taxes`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o imposto da missão.", error);
        throw error;
    }
};

export const getMissionTaxePercentege = async (id) => {
    try {
        const response = await api.get(`/missionDash/${id}/taxes-percentege`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar a porcentagem do imposto da missão.", error);
        throw error;
    }
};

export const getMissionTotalCosts = async (id) => {
    try {
        const response = await api.get(`/missionDash/${id}/costs-total`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os custos totais da missão.", error);
        throw error;
    }
};

export const getMissionPrice = async (id, marginKey = null) => {
    try {
        const url = marginKey 
            ? `/missionDash/${id}/price?margin=${marginKey}`
            : `/missionDash/${id}/price`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o preço final da missão.", error);
        throw error;
    }
};

export const getMissionPricePerPerson = async (id, marginKey = null) => {
    try {
        const url = marginKey 
            ? `/missionDash/${id}/price-per-person?margin=${marginKey}`
            : `/missionDash/${id}/price-per-person`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o preço por pessoa da missão.", error);
        throw error;
    }
};