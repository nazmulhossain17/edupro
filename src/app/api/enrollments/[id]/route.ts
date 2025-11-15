import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { enrollments } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { deleteCached, CACHE_KEYS } from '@/lib/redis';
import { auth0 } from '@/lib/auth';

export async function PATCH(
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

    const enrollmentId = parseInt(params.id);
    const body = await request.json();
    const userId = session.user.sub;

    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.id, enrollmentId),
        eq(enrollments.userId, userId)
      ),
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({
        ...body,
        completedAt: body.progressPercent === 100 ? new Date() : null,
      })
      .where(eq(enrollments.id, enrollmentId))
      .returning();

    await deleteCached(CACHE_KEYS.USER_ENROLLMENTS(userId));
    await deleteCached(CACHE_KEYS.ENROLLMENT(userId, enrollment.courseId));

    return NextResponse.json({ enrollment: updatedEnrollment });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
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

    const enrollmentId = parseInt(params.id);
    const userId = session.user.sub;

    const enrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.id, enrollmentId),
        eq(enrollments.userId, userId)
      ),
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment not found' },
        { status: 404 }
      );
    }

    await db
      .update(enrollments)
      .set({ status: 'cancelled' })
      .where(eq(enrollments.id, enrollmentId));

    await deleteCached(CACHE_KEYS.USER_ENROLLMENTS(userId));
    await deleteCached(CACHE_KEYS.ENROLLMENT(userId, enrollment.courseId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cancelling enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel enrollment' },
      { status: 500 }
    );
  }
}
