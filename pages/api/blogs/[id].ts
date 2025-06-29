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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 