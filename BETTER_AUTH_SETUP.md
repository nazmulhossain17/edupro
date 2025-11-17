# Better Auth Setup Guide

This guide will help you set up Better Auth for the EduPro Learn platform.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- Google OAuth credentials (for Google login)
- Facebook OAuth credentials (for Facebook login)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Social Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database Setup

1. Run the Drizzle migration to create the required tables:

```bash
npm run db:push
```

This will create the following tables:
- `users` - User accounts
- `session` - User sessions
- `account` - OAuth provider accounts
- `verification` - Email verification tokens

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy the Client ID and Client Secret to your `.env.local` file

## Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or select an existing one
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://yourdomain.com/api/auth/callback/facebook` (production)
5. Copy the App ID and App Secret to your `.env.local` file

## Testing Authentication

1. Start the development server:

```bash
npm run dev
```

2. Navigate to `http://localhost:3000`
3. Click "Sign Up" or "Log In"
4. Test the following flows:
   - Email/password registration
   - Email/password login
   - Google OAuth login
   - Facebook OAuth login

## Role-Based Access Control

The platform supports three user roles:

- **Student** (default): Can enroll in courses and track progress
- **Instructor**: Can create and manage courses
- **Admin**: Full access to all features including user management

Roles are automatically assigned during user creation and can be updated by admins through the admin dashboard.

## API Authentication

All API routes are protected using better-auth session management. The following helper functions are available:

- `requireAuth(request)` - Requires any authenticated user
- `requireRole(request, role)` - Requires specific role (student, instructor, or admin)

Example usage:

```typescript
import { requireAuth, requireRole } from '@/lib/auth-guards';

export async function GET(request: NextRequest) {
  const { error, user } = await requireAuth(request);
  
  if (error) {
    return error;
  }
  
  // Your authenticated logic here
}
```

## Troubleshooting

### Session not persisting

Make sure cookies are enabled in your browser and the `BETTER_AUTH_URL` matches your application URL.

### OAuth redirect errors

Verify that your redirect URIs in Google/Facebook console exactly match the URLs configured in your application.

### Database connection errors

Check that your `DATABASE_URL` is correct and the database is accessible from your application.

## Production Deployment

1. Update environment variables with production values
2. Run database migrations: `npm run db:push`
3. Ensure all OAuth redirect URIs are updated with production URLs
4. Set `BETTER_AUTH_SECRET` to a secure random string
5. Deploy your application

## Additional Resources

- [Better Auth Documentation](https://better-auth.com/docs)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
