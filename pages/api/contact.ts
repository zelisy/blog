import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Geçerli bir e-posta adresi giriniz' });
      }

      const contactMessage = await prisma.contactMessage.create({
        data: { name, email, subject, message }
      });

      return res.status(201).json({
        message: 'Mesaj başarıyla gönderildi',
        id: contactMessage.id
      });
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      return res.status(500).json({ error: 'Mesaj gönderilirken bir hata oluştu' });
    }
  }

  if (req.method === 'GET') {
    try {
      const { email } = req.query;

      if (email) {
        const userEmail = (email as string).toLowerCase().trim();

        const messages = await prisma.contactMessage.findMany({
          where: { email: userEmail },
          orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json(messages);
      } else {
        const messages = await prisma.contactMessage.findMany({
          orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json(messages);
      }
    } catch (error) {
      console.error('Mesaj getirme hatası:', error);
      return res.status(500).json({ error: 'Mesajlar alınırken bir hata oluştu' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, isRead, adminReply, repliedBy } = req.body;

      const updatedMessage = await prisma.contactMessage.update({
        where: { id: parseInt(id) },
        data: {
          isRead,
          adminReply: adminReply ?? undefined,
          repliedAt: adminReply ? new Date() : undefined,
          repliedBy: adminReply ? repliedBy : undefined
        }
      });

      // Admin yanıtı varsa, ayrıca mesaj olarak da ekle
      if (adminReply && repliedBy) {
        const user = await prisma.user.findUnique({ where: { email: updatedMessage.email.toLowerCase() } });
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

        if (user && admin) {
          await prisma.message.create({
            data: {
              senderId: admin.id,
              receiverId: user.id,
              content: adminReply
            }
          });
        }
      }

      return res.status(200).json(updatedMessage);
    } catch (error) {
      console.error('Mesaj güncelleme hatası:', error);
      return res.status(500).json({ error: 'Mesaj güncellenirken bir hata oluştu' });
    }
  }

  res.setHeader('Allow', ['POST', 'GET', 'PUT']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
