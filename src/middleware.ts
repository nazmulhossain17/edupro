import type { NextRequest } from 'next/server';
import { auth0 } from './lib/auth';

export async function middleware(request: NextRequest) {
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/instructor/:path*',
    '/admin/:path*',
    '/courses/:path*/learn',
    '/api/enrollments/:path*',
    '/api/admin/:path*',
  ],
};
