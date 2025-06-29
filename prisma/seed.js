const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordUser = await bcrypt.hash('user1234', 10);
  const passwordAdmin = await bcrypt.hash('admin1234', 10);

  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Normal User',
      email: 'user@example.com',
      password: passwordUser,
      role: 'USER',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: passwordAdmin,
      role: 'ADMIN',
    },
  });

  // Test mesajları oluştur
  await prisma.contactMessage.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Test Kullanıcı',
      email: 'user@example.com',
      subject: 'Test Mesajı 1',
      message: 'Bu bir test mesajıdır.',
      isRead: true,
      adminReply: 'Bu bir test admin yanıtıdır.',
      repliedAt: new Date(),
      repliedBy: 'Admin'
    },
  });

  await prisma.contactMessage.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Test Kullanıcı',
      email: 'user@example.com',
      subject: 'Test Mesajı 2',
      message: 'Bu ikinci test mesajıdır.',
      isRead: false
    },
  });

  console.log('Seed tamamlandı!');
  console.log('Normal kullanıcı: user@example.com / user1234');
  console.log('Admin kullanıcı: admin@example.com / admin1234');
  console.log('Test mesajları oluşturuldu!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 