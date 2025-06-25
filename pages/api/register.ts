import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Eksik bilgi' });
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email zaten kayıtlı' });
    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { name, email, password: hashed, role: 'USER' } });
    return res.status(201).json({ message: 'Kayıt başarılı' });
  } catch (e) {
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
} 