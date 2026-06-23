import { PrismaClient } from '@prisma/client';

const url = "postgresql://postgres.clqxzwvaqnhsvupzvykq:wrongpassword@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: url,
    },
  },
});

async function main() {
  try {
    const user = await prisma.user.findFirst();
    console.log("Success aws-0:", user);
  } catch (e) {
    console.error("Error aws-0:", e);
  }
}

main();
