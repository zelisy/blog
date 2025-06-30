import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const { name, email } = req.body;

      // Basit validasyon
      if (!name || !email) {
        return res.status(400).json({ error: 'Ad ve e-posta alanları zorunludur' });
      }

      // E-posta formatı kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Geçerli bir e-posta adresi giriniz' });
      }

      // Kullanıcı ID'sini request'ten al (gerçek uygulamada JWT token'dan alınır)
      // Şimdilik basit bir örnek için localStorage'dan gelen bilgiyi kullanıyoruz
      const userId = req.body.userId; // Bu gerçek uygulamada JWT'den alınmalı

      if (!userId) {
        return res.status(401).json({ error: 'Kullanıcı kimliği gerekli' });
      }

      // Kullanıcıyı güncelle
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
          name,
          email
        }
      });

      res.status(200).json({
        message: 'Profil başarıyla güncellendi',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          createdAt: updatedUser.createdAt
        }
      });
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      res.status(500).json({ error: 'Profil güncellenirken bir hata oluştu' });
    }
  } else if (req.method === 'GET') {
    const { role } = req.query;
    if (role === 'ADMIN') {
      const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!admin) return res.status(404).json({ error: 'Admin bulunamadı' });
      return res.status(200).json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
    }
    try {
      const userId = req.query.userId as string;

      if (!userId) {
        return res.status(401).json({ error: 'Kullanıcı kimliği gerekli' });
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.error('Profil getirme hatası:', error);
      res.status(500).json({ error: 'Profil bilgileri alınırken bir hata oluştu' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 