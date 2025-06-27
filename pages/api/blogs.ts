import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { featured, all, mostViewed } = req.query;
    let where;
    let orderBy = { createdAt: 'desc' };
    if (featured) {
      where = { featured: true, isApproved: true };
    } else if (all) {
      where = { isApproved: false };
    } else if (mostViewed) {
      where = { isApproved: true };
      orderBy = { views: 'desc' };
    } else {
      where = { isApproved: true };
    }
    const blogs = await prisma.blog.findMany({
      where,
      orderBy,
      include: { author: { select: { id: true, name: true } } },
    });
    return res.status(200).json(blogs);
  }
  if (req.method === 'POST') {
    const { title, content, authorName, date } = req.body;
    if (!title || !content || !authorName || !date) return res.status(400).json({ message: 'Eksik bilgi' });
    let user = await prisma.user.findFirst({ where: { name: authorName } });
    if (!user) {
      const random = Math.floor(Math.random() * 1000000);
      user = await prisma.user.create({
        data: {
          name: authorName,
          email: `user${random}@example.com`,
          password: Math.random().toString(36).slice(-8),
        }
      });
    }
    const blog = await prisma.blog.create({
      data: { title, content, authorId: user.id, createdAt: new Date(date) },
    });
    return res.status(201).json(blog);
  }
  if (req.method === 'PUT') {
    const { id, isApproved } = req.body;
    if (!id || typeof isApproved !== 'boolean') return res.status(400).json({ message: 'Eksik bilgi' });
    const updated = await prisma.blog.update({ where: { id }, data: { isApproved } });
    return res.status(200).json(updated);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ message: 'Eksik bilgi' });
    await prisma.blog.delete({ where: { id } });
    return res.status(204).end();
  }
  return res.status(405).json({ message: 'Method not allowed' });
} 