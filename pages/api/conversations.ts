import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Kullanıcının gönderdiği ve aldığı mesajlardan benzersiz kullanıcıları bul
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(userId as string) },
          { receiverId: parseInt(userId as string) }
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
      orderBy: { createdAt: 'desc' }
    });

    // Her kullanıcı için en son mesajı bul
    const conversationMap = new Map();
    
    conversations.forEach(message => {
      const currentUserId = parseInt(userId as string);
      const otherUser = message.senderId === currentUserId ? message.receiver : message.sender;
      
      if (!conversationMap.has(otherUser.id)) {
        conversationMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0 // Bu özellik ileride eklenebilir
        });
      }
    });

    const result = Array.from(conversationMap.values());
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 