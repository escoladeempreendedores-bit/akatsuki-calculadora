import { z } from "zod";

export const missionSchema = z.object({
  name: z.string().min(1, "Nome da missão é obrigatório"),
  description: z.string(),
  number_participants: z
    .string()
    .min(1, "Número de participantes é obrigatório")
    .regex(/^\d+$/, "Deve conter apenas números")
    .refine((val) => {
      const num = Number(val);
      return num >= 1 && num <= 999;
    }, "O número de participantes deve estar entre 1 e 999"),
  number_consolidated_participants: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === "") return true;
      if (!/^\d+$/.test(val)) return false;
      const num = Number(val);
      return num >= 0 && num <= 999;
    }, "O número de participantes consolidados deve estar entre 0 e 999"),
});
