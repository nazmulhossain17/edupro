import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { deleteCached, CACHE_KEYS } from '@/lib/redis';
import { auth0 } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, session.user.sub),
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const courseId = parseInt(params.id);
    const body = await request.json();
    const { reason } = body;

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const [rejectedCourse] = await db
      .update(courses)
      .set({
        published: false,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))
      .returning();

    await deleteCached(CACHE_KEYS.COURSE(courseId));


    return NextResponse.json({ 
      course: rejectedCourse,
      message: 'Course rejected successfully',
      reason 
    });
  } catch (error) {
    console.error('Error rejecting course:', error);
    return NextResponse.json(
      { error: 'Failed to reject course' },
      { status: 500 }
    );
  }
}
