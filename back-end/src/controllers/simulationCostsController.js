const {
    getCardDebitPercentage,
    getCardCredit1xPercentage,
    getCardCredit2xPercentage,
    getCardCredit3xPercentage,
    getCardCredit4xPercentage,
    getCardCredit5xPercentage,
    getCardCredit6xPercentage,
    getCardCredit7xPercentage,
    getCardCredit8xPercentage,
    getCardCredit9xPercentage,
    getCardCredit10xPercentage,
    getCardCredit11xPercentage,
    getCardCredit12xPercentage,
  } = require("../models/simulationCostsModel");
  
  // GET /:mission_id/card-fees  → retorna todas as taxas de cartão da missão
  const getMissionCardFees = async (req, res) => {
    const missionId = Number(req.params.mission_id);
  
    if (!missionId || Number.isNaN(missionId)) {
      return res.status(400).json({ error: "mission_id inválido" });
    }
  
    try {
      const [
        debit,
        credit1x,
        credit2x,
        credit3x,
        credit4x,
        credit5x,
        credit6x,
        credit7x,
        credit8x,
        credit9x,
        credit10x,
        credit11x,
        credit12x,
      ] = await Promise.all([
        getCardDebitPercentage(missionId),
        getCardCredit1xPercentage(missionId),
        getCardCredit2xPercentage(missionId),
        getCardCredit3xPercentage(missionId),
        getCardCredit4xPercentage(missionId),
        getCardCredit5xPercentage(missionId),
        getCardCredit6xPercentage(missionId),
        getCardCredit7xPercentage(missionId),
        getCardCredit8xPercentage(missionId),
        getCardCredit9xPercentage(missionId),
        getCardCredit10xPercentage(missionId),
        getCardCredit11xPercentage(missionId),
        getCardCredit12xPercentage(missionId),
      ]);
  
      // formato já pronto pro front (parecido com o array fees da tela)
      const fees = [
        { label: "Débito", percent: debit },
        { label: "Crédito 1x", percent: credit1x },
        { label: "Crédito 2x", percent: credit2x },
        { label: "Crédito 3x", percent: credit3x },
        { label: "Crédito 4x", percent: credit4x },
        { label: "Crédito 5x", percent: credit5x },
        { label: "Crédito 6x", percent: credit6x },
        { label: "Crédito 7x", percent: credit7x },
        { label: "Crédito 8x", percent: credit8x },
        { label: "Crédito 9x", percent: credit9x },
        { label: "Crédito 10x", percent: credit10x },
        { label: "Crédito 11x", percent: credit11x },
        { label: "Crédito 12x", percent: credit12x },
      ];
  
      return res.status(200).json(fees);
    } catch (error) {
      console.error("Erro ao buscar taxas de cartão da missão:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar taxas de cartão da missão" });
    }
  };
  
  module.exports = {
    getMissionCardFees,
  };