import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const comments = await prisma.comment.findMany({
        include: {
          blog: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json(comments);
    } catch (error) {
      console.error('Yorumlar getirilirken hata:', error);
      res.status(500).json({ error: 'Yorumlar getirilirken bir hata oluştu' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'Yorum ID gereklidir' });
      }

      await prisma.comment.delete({
        where: {
          id: parseInt(id as string),
        },
      });

      res.status(200).json({ message: 'Yorum başarıyla silindi' });
    } catch (error) {
      console.error('Yorum silinirken hata:', error);
      res.status(500).json({ error: 'Yorum silinirken bir hata oluştu' });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const { isApproved } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Yorum ID gereklidir' });
      }

      const comment = await prisma.comment.update({
        where: {
          id: parseInt(id as string),
        },
        data: {
          isApproved,
        },
      });

      res.status(200).json(comment);
    } catch (error) {
      console.error('Yorum güncellenirken hata:', error);
      res.status(500).json({ error: 'Yorum güncellenirken bir hata oluştu' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 