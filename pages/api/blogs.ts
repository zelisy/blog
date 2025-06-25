import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { featured } = req.query;
    const where = featured ? { featured: true } : {};
    const blogs = await prisma.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true } } },
    });
    return res.status(200).json(blogs);
  }
  if (req.method === 'POST') {
    const { title, content, featured, authorId } = req.body;
    if (!title || !content || !authorId) return res.status(400).json({ message: 'Eksik bilgi' });
    const blog = await prisma.blog.create({
      data: { title, content, featured: !!featured, authorId },
    });
    return res.status(201).json(blog);
  }
  return res.status(405).json({ message: 'Method not allowed' });
} 