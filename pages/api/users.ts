import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { search } = req.query;
    
    let users;
    if (search && typeof search === 'string') {
      users = await prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        },
        take: 10
      });
    } else {
      users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        },
        take: 10
      });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 