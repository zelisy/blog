import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { content, authorName, authorEmail, blogId } = req.body;

      if (!content || !authorName || !authorEmail || !blogId) {
        return res.status(400).json({ error: 'Tüm alanlar gereklidir' });
      }

      const comment = await prisma.comment.create({
        data: {
          content,
          authorName,
          authorEmail,
          blogId: parseInt(blogId),
        },
      });

      res.status(201).json(comment);
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
      res.status(500).json({ error: 'Yorum eklenirken bir hata oluştu' });
    }
  } else if (req.method === 'GET') {
    try {
      const { blogId } = req.query;

      if (!blogId) {
        return res.status(400).json({ error: 'Blog ID gereklidir' });
      }

      const comments = await prisma.comment.findMany({
        where: {
          blogId: parseInt(blogId as string),
          isApproved: true,
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
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 