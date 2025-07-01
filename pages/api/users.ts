import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { search } = req.query;
      
      let users;
      if (search && typeof search === 'string') {
        users = await prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: search } },
              { email: { contains: search } }
            ]
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          },
          take: 10
        });
      } else {
        users = await prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          },
          take: 10
        });
      }

      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { userId } = req.query;
      
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'Kullanıcı ID gerekli' });
      }

      // Kullanıcının var olup olmadığını kontrol et
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
      });

      if (!user) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }

      // Admin kendisini silemesin
      if (user.role === 'ADMIN') {
        return res.status(403).json({ error: 'Admin kullanıcıları silinemez' });
      }

      // Kullanıcıyı sil
      await prisma.user.delete({
        where: { id: parseInt(userId) }
      });

      res.status(200).json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Kullanıcı silinirken bir hata oluştu' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).json({ message: 'Method not allowed' });
  }
} 