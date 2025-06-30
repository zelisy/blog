import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId, otherUserId } = req.query;

      // Gerekli alan kontrolü
      if (!userId || !otherUserId) {
        return res.status(400).json({ message: 'userId and otherUserId are required' });
      }

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: parseInt(userId as string), receiverId: parseInt(otherUserId as string) },
            { senderId: parseInt(otherUserId as string), receiverId: parseInt(userId as string) }
          ]
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true, role: true }
          },
          receiver: {
            select: { id: true, name: true, email: true, role: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      return res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { senderId, receiverId, content } = req.body;

      if (!senderId || !receiverId || !content) {
        return res.status(400).json({ message: 'content, senderId, and receiverId are required' });
      }

      const message = await prisma.message.create({
        data: {
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId),
          content
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true, role: true }
          },
          receiver: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      });

      return res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Eksik bilgi' });

    await prisma.message.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
