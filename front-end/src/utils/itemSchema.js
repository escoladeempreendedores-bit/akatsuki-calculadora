import { z } from "zod";

export const itemSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  quantity: z
    .string()
    .regex(/^\d+$/, "Quantidade deve conter apenas números"),
  unitPrice: z.coerce.number().positive("Valor deve ser maior que zero"),
});