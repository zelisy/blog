import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Eksik bilgi' });
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Şifre hatalı' });
    // Burada JWT veya session eklenebilir
    return res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (e) {
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
} 