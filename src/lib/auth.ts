import { getSession } from '@auth0/nextjs-auth0';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  const session = await getSession();
  
  if (!session || !session.user) {
    return null;
  }

  const auth0User = session.user;
  
  let user = await db.query.users.findFirst({
    where: eq(users.id, auth0User.sub),
  });

  if (!user) {
    const [newUser] = await db.insert(users).values({
      id: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name,
      avatar: auth0User.picture,
      role: 'student',
    }).returning();
    
    user = newUser;
  }

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export async function requireRole(role: 'student' | 'instructor' | 'admin') {
  const user = await requireAuth();
  
  if (user.role !== role && user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  
  return user;
}
