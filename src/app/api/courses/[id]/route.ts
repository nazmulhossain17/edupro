import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getCached, setCached, deleteCached, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';
import { requireAuth, requireRole } from '@/lib/auth-guards';

type CourseWithDetails = Record<string, unknown>;

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const courseId = params.id;

    const cacheKey = CACHE_KEYS.COURSE(courseId);
    const cached = await getCached<CourseWithDetails>(cacheKey);
    
    if (cached) {
      return NextResponse.json({ course: cached, cached: true });
    }

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
      with: {
        instructor: {
          columns: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
          },
        },
        category: true,
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    await setCached(cacheKey, course, CACHE_TTL.LONG);

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { error, user } = await requireAuth(request);
    
    if (error) {
      return error;
    }

    const courseId = params.id;
    const body = await request.json();

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (course.instructorId !== user!.id && user!.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const [updatedCourse] = await db
      .update(courses)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId))
      .returning();

    await deleteCached(CACHE_KEYS.COURSE(courseId));

    return NextResponse.json({ course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await db.delete(courses).where(eq(courses.id, courseId));

    await deleteCached(CACHE_KEYS.COURSE(courseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
