import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, email, subject, message } = req.body;

      // Validasyon
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
      }

      // E-posta formatı kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Geçerli bir e-posta adresi giriniz' });
      }

      // Mesajı veritabanına kaydet
      const contactMessage = await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject,
          message
        }
      });

      res.status(201).json({
        message: 'Mesaj başarıyla gönderildi',
        id: contactMessage.id
      });
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      res.status(500).json({ error: 'Mesaj gönderilirken bir hata oluştu' });
    }
  } else if (req.method === 'GET') {
    try {
      const { email } = req.query;
      console.log('GET request - email query:', email);

      if (email) {
        // Belirli bir kullanıcının mesajlarını getir
        const userEmail = (email as string).toLowerCase().trim();
        console.log('Kullanıcı mesajları aranıyor (normalized):', userEmail);
        
        const messages = await prisma.contactMessage.findMany({
          where: { 
            email: userEmail
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        console.log('Bulunan mesaj sayısı:', messages.length);
        console.log('Mesajlar:', messages);

        res.status(200).json(messages);
      } else {
        // Tüm mesajları getir (admin için)
        console.log('Tüm mesajlar getiriliyor');
        const messages = await prisma.contactMessage.findMany({
          orderBy: {
            createdAt: 'desc'
          }
        });
        console.log('Toplam mesaj sayısı:', messages.length);

        res.status(200).json(messages);
      }
    } catch (error) {
      console.error('Mesaj getirme hatası:', error);
      res.status(500).json({ error: 'Mesajlar alınırken bir hata oluştu' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, isRead, adminReply, repliedBy } = req.body;
      console.log('PUT request - updating message:', { id, isRead, adminReply, repliedBy });

      // Mesajı güncelle
      const updatedMessage = await prisma.contactMessage.update({
        where: { id: parseInt(id) },
        data: {
          isRead,
          adminReply: adminReply ?? undefined,
          repliedAt: adminReply ? new Date() : undefined,
          repliedBy: adminReply ? repliedBy : undefined
        }
      });

      console.log('Updated message:', updatedMessage);
      res.status(200).json(updatedMessage);
    } catch (error) {
      console.error('Mesaj güncelleme hatası:', error);
      res.status(500).json({ error: 'Mesaj güncellenirken bir hata oluştu' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 