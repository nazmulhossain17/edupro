import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, desc, like, or } from 'drizzle-orm';
import { requireRole } from '@/lib/auth-guards';

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireRole(request, 'admin');
    
    if (error) {
      return error;
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    const conditions = [];
    
    if (role) {
      conditions.push(eq(users.role, role as 'student' | 'instructor' | 'admin'));
    }
    
    if (search) {
      conditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      );
    }

    const allUsers = await db.query.users.findMany({
      where: conditions.length > 0 ? or(...conditions) : undefined,
      orderBy: [desc(users.createdAt)],
    });

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
