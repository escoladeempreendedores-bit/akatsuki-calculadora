export const formatBRL = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const rowTotal = (item) => Number(item.quantity || 0) * Number(item.unitPrice || 0);
