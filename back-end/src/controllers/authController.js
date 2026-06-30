const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const register = async (req, res) => {
  const { name, email, password, level_id } = req.body;

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        level_id: level_id ?? 1,
      },
    });

    res.status(201).json({ message: 'Usuário criado com sucesso', userId: newUser.id });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const accessToken = jwt.sign(
      { userId: user.id,
        email: user.email,
        level: user.level_id
       },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true em produção com HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    });

    res.json({
      message: "Login bem-sucedido",
      accessToken,
      user: { email: user.email, level_id: user.level_id },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }

};


const refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ error: "Token ausente" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: "Refresh token inválido" });
  }
};




module.exports = {
  register,
  login,
  refresh
};