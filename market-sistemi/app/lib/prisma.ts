import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Yeni kural: Bağlantıyı doğrudan değil, bir çevirici (adapter) üzerinden yapıyoruz
const connectionString = (process.env.DATABASE_URL || process.env.DIRECT_URL) as string;
const adapter = new PrismaPg({ connectionString });

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;