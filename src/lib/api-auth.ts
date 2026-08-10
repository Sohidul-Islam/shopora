import { UserService } from '../core/services/UserService';

const userService = new UserService();

export async function getSessionUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  let token: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else {
    token = req.headers.get('x-session-token');
  }

  if (!token) {
    return null;
  }

  return userService.validateSession(token);
}

export async function requireAuth(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin(req: Request) {
  const user = await requireAuth(req);
  const roleName = (user as any).role?.name;
  if (roleName !== 'Admin' && roleName !== 'Manager') {
    throw new Error('Forbidden');
  }
  return user;
}
