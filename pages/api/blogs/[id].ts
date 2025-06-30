import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Blog ID gereklidir' });
      }

      const blog = await prisma.blog.findUnique({
        where: {
          id: parseInt(id as string),
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!blog) {
        return res.status(404).json({ error: 'Blog bulunamadı' });
      }

      // Görüntülenme sayısını artır
      await prisma.blog.update({
        where: {
          id: parseInt(id as string),
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      res.status(200).json(blog);
    } catch (error) {
      console.error('Blog getirilirken hata:', error);
      res.status(500).json({ error: 'Blog getirilirken bir hata oluştu' });
    }
  } else if (req.method === 'DELETE') {
    // Admin kontrolü
    const userRole = req.headers['x-user-role'] || req.headers['X-User-Role'];
    if (userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'Sadece adminler blog silebilir.' });
    }
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Blog ID gereklidir' });
    }
    try {
      await prisma.blog.delete({
        where: { id: parseInt(id as string) },
      });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Blog silinirken bir hata oluştu' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 