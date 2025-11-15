import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import { getCached, setCached, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';
import { auth0 } from '@/lib/auth';

type CourseWithRelations = Record<string, unknown>;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const level = searchParams.get('level');
    const published = searchParams.get('published');

    const cacheKey = `${CACHE_KEYS.COURSES_LIST}:${category}:${search}:${level}:${published}`;
    const cached = await getCached<CourseWithRelations[]>(cacheKey);
    
    if (cached) {
      return NextResponse.json({ courses: cached, cached: true });
    }

    const conditions = [];
    
    if (published !== 'false') {
      conditions.push(eq(courses.published, true));
    }
    
    if (category) {
      conditions.push(eq(courses.categoryId, parseInt(category)));
    }
    
    if (level && ['beginner', 'intermediate', 'advanced', 'expert'].includes(level)) {
      conditions.push(eq(courses.level, level as 'beginner' | 'intermediate' | 'advanced' | 'expert'));
    }
    
    if (search) {
      conditions.push(
        sql`${courses.title} ILIKE ${`%${search}%`} OR ${courses.description} ILIKE ${`%${search}%`}`
      );
    }

    const allCourses = await db.query.courses.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
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
      orderBy: [desc(courses.createdAt)],
    });

    await setCached(cacheKey, allCourses, CACHE_TTL.MEDIUM);

    return NextResponse.json({ courses: allCourses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
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
    const {
      title,
      slug,
      description,
      thumbnail,
      price,
      level,
      categoryId,
    } = body;

    if (!title || !slug || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [newCourse] = await db.insert(courses).values({
      title,
      slug,
      description,
      thumbnail: thumbnail || null,
      price: price || '0.00',
      level: level || 'Beginner',
      categoryId: categoryId || null,
      instructorId: session.user.sub,
      published: false, // Courses start as unpublished and need admin approval
    }).returning();

    return NextResponse.json({ course: newCourse }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
