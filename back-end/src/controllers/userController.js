const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createUser = async (req, res) => {
  try {
    const { name, email, password, level_id } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email e password são obrigatórios." });
    const hashedPassword = await bcrypt.hash(password, 10);
    const levelId = level_id ?? 1;

    const user = await prisma.users.create({ data: { name, email, password: hashedPassword, level_id: levelId } });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

const getUsers = async (req, res) => {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      level_id: true,
      created_at: true
    }
  });

  res.json(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.users.findUnique({ where: { id: Number(id) }, include: { Missions: true } });
  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
  res.json(user);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, level_id } = req.body;
  try {
    const user = await prisma.users.update({
      where: { id: Number(id) },
      data: { name, email, password, level_id},
    });
    res.json(user);
  } catch {
    res.status(404).json({ error: "Usuário não encontrado." });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({ where: { id: Number(id) } });
    res.json({ message: "Usuário removido com sucesso." });
  } catch {
    res.status(404).json({ error: "Usuário não encontrado." });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};