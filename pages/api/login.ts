import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validasyon
    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre alanları zorunludur' });
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Geçerli bir e-posta adresi giriniz' });
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Şifreyi kontrol et
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Şifre hatalı' });
    }

    // Başarılı giriş
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.' 
    });
  }
} 