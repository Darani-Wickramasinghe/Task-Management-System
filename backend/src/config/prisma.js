import * as prismaClientPkg from '@prisma/client';
import * as adapterPgPkg from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// This handles the module format differences between local dev and Render
const PrismaClient = prismaClientPkg.PrismaClient || prismaClientPkg.default?.PrismaClient;
const PrismaPg = adapterPgPkg.PrismaPg || adapterPgPkg.default?.PrismaPg;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });