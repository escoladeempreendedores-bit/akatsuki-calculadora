const prisma = require("../prisma");

const {
  getTaxByName
} = require("./missionDashModel");

// Funções para buscar porcentagens das taxas de cartão
const getCardDebitPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa de Cartão de Débito");

const getCardCredit1xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 1x");

const getCardCredit2xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 2x");

const getCardCredit3xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 3x");

const getCardCredit4xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 4x");

const getCardCredit5xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 5x");

const getCardCredit6xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 6x");

const getCardCredit7xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 7x");

const getCardCredit8xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 8x");

const getCardCredit9xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 9x");

const getCardCredit10xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 10x");

const getCardCredit11xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 11x");

const getCardCredit12xPercentage = async (missionId) => 
  getTaxByName(missionId, "Taxa do Cartão de Crédito 12x");

module.exports = {
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
  getCardCredit12xPercentage
};