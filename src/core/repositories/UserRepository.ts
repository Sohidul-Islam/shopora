import { db } from '../../db';
import { users, sessions, roles, oauthAccounts, addresses } from '../../db/schema';
import { eq, and } from 'drizzle-orm';

export class UserRepository {
  async findById(id: string) {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        role: true,
      },
    });
    return result;
  }

  async findByEmail(email: string) {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: {
        role: true,
      },
    });
    return result;
  }

  async createUser(data: typeof users.$inferInsert) {
    const id = data.id || crypto.randomUUID();
    await db.insert(users).values({ ...data, id });
    return this.findById(id);
  }

  async updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    await db.update(users).set(data).where(eq(users.id, id));
    return this.findById(id);
  }

  async createSession(userId: string, sessionToken: string, expiresAt: Date) {
    const id = crypto.randomUUID();
    await db.insert(sessions).values({
      id,
      userId,
      sessionToken,
      expiresAt,
    });
    return sessionToken;
  }

  async getSession(sessionToken: string) {
    return db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, sessionToken),
      with: {
        user: true,
      },
    });
  }

  async deleteSession(sessionToken: string) {
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  }

  async getAddresses(userId: string) {
    return db.select().from(addresses).where(eq(addresses.userId, userId));
  }

  async addAddress(userId: string, data: Omit<typeof addresses.$inferInsert, 'id' | 'userId'>) {
    const id = crypto.randomUUID();
    if (data.isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
    }
    await db.insert(addresses).values({
      ...data,
      id,
      userId,
    });
    return id;
  }
}
