import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();


async function main() {
  const password = 'Admin@1234';
  const password_hash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tms.com' },
    update: {
      password_hash,
      must_reset_password: false,
      is_active: true,
    },
    create: {
      name: 'Admin User',
      email: 'admin@tms.com',
      password_hash,
      role: 'admin',
      must_reset_password: false,
      is_active: true,
    },
  });

  console.log(`Successfully reset admin@tms.com password to: ${password}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
