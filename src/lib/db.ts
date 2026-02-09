import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let _prisma: PrismaClient | null | undefined = undefined;

function getPrisma(): PrismaClient | null {
  if (_prisma === undefined) {
    const url = process.env.DATABASE_URL?.trim();
    if (!url) {
      _prisma = null;
    } else {
      _prisma = globalForPrisma.prisma ?? new PrismaClient();
      if (process.env.NODE_ENV !== "production") {
        globalForPrisma.prisma = _prisma;
      }
    }
  }
  return _prisma;
}

/** Use this when you need to check for DB availability (e.g. if (!getPrisma()) return). */
export { getPrisma };

/** Lazy-initialized so build can succeed without DATABASE_URL. Use getPrisma() for null checks. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    return (getPrisma() as unknown as Record<string, unknown>)?.[prop as string];
  },
});
