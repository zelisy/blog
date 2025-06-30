import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // İki kullanıcı arasındaki mesajları getir
    const { userId, otherId } = req.query;
    if (!userId || !otherId) return res.status(400).json({ error: 'Eksik bilgi' });
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: Number(userId), receiverId: Number(otherId) },
          { senderId: Number(otherId), receiverId: Number(userId) },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } },
      },
    });
    return res.status(200).json(messages);
  }
  if (req.method === 'POST') {
    // Yeni mesaj gönder
    const { senderId, receiverId, content } = req.body;
    if (!senderId || !receiverId || !content) return res.status(400).json({ error: 'Eksik bilgi' });
    const message = await prisma.message.create({
      data: {
        senderId: Number(senderId),
        receiverId: Number(receiverId),
        content,
      },
    });
    return res.status(201).json(message);
  }
  if (req.method === 'DELETE') {
    // Mesaj sil
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Eksik bilgi' });
    await prisma.message.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  return res.status(405).json({ error: 'Method not allowed' });
} 