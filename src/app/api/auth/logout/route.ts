import { NextResponse } from 'next/server';
import { UserService } from '../../../../core/services/UserService';

const userService = new UserService();

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    let token: string | null = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = req.headers.get('x-session-token');
    }

    if (token) {
      await userService.logout(token);
    }

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Logout failed' }, { status: 400 });
  }
}
