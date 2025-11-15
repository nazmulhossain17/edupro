import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { enrollments, courses } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCached, setCached, deleteCached, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';
import { auth0 } from '@/lib/auth';

type EnrollmentWithCourse = Record<string, unknown>;

export async function GET() {
  try {
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.sub;

    const cacheKey = CACHE_KEYS.USER_ENROLLMENTS(userId);
    const cached = await getCached<EnrollmentWithCourse[]>(cacheKey);
    
    if (cached) {
      return NextResponse.json({ enrollments: cached, cached: true });
    }

    const userEnrollments = await db.query.enrollments.findMany({
      where: eq(enrollments.userId, userId),
      with: {
        course: {
          with: {
            instructor: {
              columns: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            category: true,
          },
        },
      },
      orderBy: (enrollments, { desc }) => [desc(enrollments.enrolledAt)],
    });

    await setCached(cacheKey, userEnrollments, CACHE_TTL.MEDIUM);

    return NextResponse.json({ enrollments: userEnrollments });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    const userId = session.user.sub;

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    if (!course.published) {
      return NextResponse.json(
        { error: 'Course is not available for enrollment' },
        { status: 400 }
      );
    }

    const existingEnrollment = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ),
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    const [newEnrollment] = await db.insert(enrollments).values({
      userId,
      courseId,
      status: 'active',
      progressPercent: 0,
    }).returning();

    await deleteCached(CACHE_KEYS.USER_ENROLLMENTS(userId));

    return NextResponse.json({ enrollment: newEnrollment }, { status: 201 });
  } catch (error) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}
