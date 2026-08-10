import { NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/api-auth';
import { UserService } from '../../../core/services/UserService';

const userService = new UserService();

export async function GET(req: Request) {
  try {
    const user = await requireAuth(req);
    const addresses = await userService.getAddresses(user.id);
    return NextResponse.json({ success: true, user, addresses });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();
    const addressId = await userService.addAddress(user.id, body);
    return NextResponse.json({ success: true, addressId });
  } catch (error: any) {
    const status = error.message === 'Unauthorized' ? 401 : 400;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
