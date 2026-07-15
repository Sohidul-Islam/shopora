import { NextResponse } from 'next/server';
import { UserService } from '../../../../core/services/UserService';

const userService = new UserService();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing name, email, or password' }, { status: 400 });
    }
    const user = await userService.registerUser(name, email, password);
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 400 });
  }
}
