import { UserRepository } from '../repositories/UserRepository';
import crypto from 'crypto';

const userRepository = new UserRepository();

export class UserService {
  // Hash password using Node's built-in pbkdf2
  hashPassword(password: string): string {
    const salt = 'shopora_secret_salt_123';
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  async registerUser(name: string, email: string, passwordHash: string) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email is already registered.');
    }

    const hashedPassword = this.hashPassword(passwordHash);
    return userRepository.createUser({
      name,
      email,
      passwordHash: hashedPassword,
    });
  }

  async loginUser(email: string, passwordHash: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password.');
    }

    const hashed = this.hashPassword(passwordHash);
    if (user.passwordHash !== hashed) {
      throw new Error('Invalid email or password.');
    }

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

    await userRepository.createSession(user.id, sessionToken, expiresAt);
    return { user, sessionToken };
  }

  async validateSession(token: string) {
    const session = await userRepository.getSession(token);
    if (!session) return null;

    if (new Date() > session.expiresAt) {
      await userRepository.deleteSession(token);
      return null;
    }
    return session.user;
  }

  async logout(token: string) {
    await userRepository.deleteSession(token);
  }

  async getAddresses(userId: string) {
    return userRepository.getAddresses(userId);
  }

  async addAddress(userId: string, data: any) {
    return userRepository.addAddress(userId, data);
  }
}
