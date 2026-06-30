import { api } from "./api";    

export const getAllMissions = async () => {
    try {
        const response = await api.get('/generalDash/missions');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar todas as missões.", error);
        throw error;
    }
};

export const getAverageMargin = async () => {
    try {
        const response = await api.get('/generalDash/average');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar margem média.", error);
        throw error;
    }
};

export const getMissionCount = async () => {
    try {
        const response = await api.get('/generalDash/count');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar a contagem total das missões.", error);
        throw error;
    }
};

export const getTotalMargin = async () => {
    try {
        const response = await api.get('/generalDash/margin');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o Lucro Bruto total.", error);
        throw error;
    }
};

export const getMissionProfit = async () => {
    try {
        const response = await api.get('/generalDash/profit');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o Faturamento total.", error);
        throw error;
    }
};

export const getMissionParticipants = async () => {
    try {
        const response = await api.get('/generalDash/participants');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar o número total de participantes das missões.");
        throw error;
    }
}