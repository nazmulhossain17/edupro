import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const auth0 = new Auth0Client();

export async function getCurrentUser() {
  const session = await auth0.getSession();
  
  if (!session || !session.user) {
    return null;
  }

  const auth0User = session.user;
  
  if (!auth0User.sub || !auth0User.email) {
    return null;
  }
  
  let user = await db.query.users.findFirst({
    where: eq(users.id, auth0User.sub),
  });

  if (!user) {
    const [newUser] = await db.insert(users).values({
      id: auth0User.sub,
      email: auth0User.email,
      name: auth0User.name || null,
      avatar: auth0User.picture || null,
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
