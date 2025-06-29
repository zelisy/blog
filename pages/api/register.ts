import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Validasyon
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    // E-posta formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Geçerli bir e-posta adresi giriniz' });
    }

    // Şifre uzunluğu kontrolü
    if (password.length < 6) {
      return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır' });
    }

    // E-posta zaten kayıtlı mı kontrol et
    const existingUser = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase() } 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcıyı oluştur
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'USER'
      }
    });

    return res.status(201).json({ 
      message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ 
      message: 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.' 
    });
  }
} 