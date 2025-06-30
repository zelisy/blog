import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { userId, otherUserId } = req.query;

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
            select: { id: true, name: true, email: true }
          },
          receiver: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: { createdAt: 'asc' }
      });

      res.status(200).json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { content, senderId, receiverId } = req.body;

      if (!content || !senderId || !receiverId) {
        return res.status(400).json({ message: 'content, senderId, and receiverId are required' });
      }

      const message = await prisma.message.create({
        data: {
          content,
          senderId: parseInt(senderId),
          receiverId: parseInt(receiverId)
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true }
          },
          receiver: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 