import { NextResponse } from 'next/server';
import { UserService } from '../../../../core/services/UserService';

const userService = new UserService();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }
    const result = await userService.loginUser(email, password);
    return NextResponse.json({ success: true, user: result.user, token: result.sessionToken });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Login failed' }, { status: 401 });
  }
}
