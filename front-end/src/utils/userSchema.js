import { z } from "zod";

export const userSchema = z
  .object({
    name: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
    level_id: z.coerce.number().min(1).max(2),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const userEditSchema = z
  .object({
    name: z.string().min(1, "Nome completo é obrigatório"),
    email: z.string().min(1, "Email é obrigatório").email("Email inválido"),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    level_id: z.coerce.number().min(1).max(2),
  })
  .refine(
    (data) => {
      // Se password foi preenchido, confirmPassword deve ser igual
      if (data.password && data.password.length > 0) {
        if (!data.confirmPassword || data.confirmPassword.length === 0) {
          return false;
        }
        if (data.password.length < 6) {
          return false;
        }
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "As senhas devem coincidir e ter no mínimo 6 caracteres",
      path: ["confirmPassword"],
    }
  );
