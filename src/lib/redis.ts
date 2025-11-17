import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export const CACHE_KEYS = {
  USER: (userId: string) => `user:${userId}`,
  COURSE: (courseId: string) => `course:${courseId}`,
  COURSES_LIST: 'courses:list',
  ENROLLMENT: (userId: string, courseId: string) => `enrollment:${userId}:${courseId}`,
  USER_ENROLLMENTS: (userId: string) => `enrollments:${userId}`,
  COURSE_ANALYTICS: (courseId: string) => `analytics:course:${courseId}`,
  USER_ACTIVITY: (userId: string) => `activity:${userId}`,
};

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key);
    return cached as T | null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

export async function setCached<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<void> {
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttl });
  } catch (error) {
    console.error('Redis set error:', error);
  }
}

export async function deleteCached(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
}

export async function invalidatePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis invalidate pattern error:', error);
  }
}
