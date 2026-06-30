const express = require("express");
const { register, login, refresh } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

// Rota protegida
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, created_at: true, },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json( {id: user.id.toString(), email: user.email, created_at: user.created_at});
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
}); 


module.exports = router;