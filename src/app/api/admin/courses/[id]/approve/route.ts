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

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const [approvedCourse] = await db
      .update(courses)
      .set({
        published: true,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))
      .returning();

    await deleteCached(CACHE_KEYS.COURSE(courseId));

    return NextResponse.json({ 
      course: approvedCourse,
      message: 'Course approved successfully' 
    });
  } catch (error) {
    console.error('Error approving course:', error);
    return NextResponse.json(
      { error: 'Failed to approve course' },
      { status: 500 }
    );
  }
}
