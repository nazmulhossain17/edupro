import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { deleteCached, CACHE_KEYS } from '@/lib/redis';
import { requireRole } from '@/lib/auth-guards';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { error } = await requireRole(request, 'admin');
    
    if (error) {
      return error;
    }

    const courseId = params.id;
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
