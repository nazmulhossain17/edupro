# EduPro Learn - E-Learning Platform

A modern, cloud-based e-learning platform designed to deliver industry-relevant IT courses with verifiable digital certificates. Built with Next.js, TypeScript, Drizzle ORM, Neon PostgreSQL, and Auth0.

## Features

- **User Authentication**: Secure authentication with Auth0 supporting student, instructor, and admin roles
- **Course Management**: Comprehensive course catalog with categories, filtering, and search
- **Video Learning**: Interactive video lessons with progress tracking
- **Certificates**: Verifiable digital certificates with QR codes
- **Payment Integration**: Stripe integration for course purchases
- **Student Dashboard**: Track enrolled courses, progress, and certificates
- **Instructor Dashboard**: Create and manage courses, track student progress
- **Admin Panel**: Manage users, courses, and platform analytics
- **Responsive Design**: Pixel-perfect UI that works on all devices
- **Scalable Architecture**: Optimized for 15,000+ concurrent users

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Auth0
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)

## Prerequisites

- Node.js 18+ and npm
- Neon PostgreSQL account
- Auth0 account
- Stripe account (for payments)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nazmulhossain17/edupro.git
cd edupro
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Update the following environment variables in `.env.local`:

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Auth0
AUTH0_SECRET=use-openssl-rand-hex-32-to-generate
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=EduPro Learn
```

### 4. Generate Auth0 Secret

Generate a secure secret for Auth0:

```bash
openssl rand -hex 32
```

### 5. Set up the database

Generate and run database migrations:

```bash
npm run db:generate
npm run db:push
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The platform uses a comprehensive database schema optimized for large-scale usage:

- **Users**: Student, instructor, and admin accounts
- **Courses**: Course information, pricing, and metadata
- **Sections & Lessons**: Organized course content
- **Enrollments**: Student course enrollments and progress
- **Certificates**: Verifiable digital certificates
- **Payments**: Stripe payment records
- **Reviews**: Course reviews and ratings
- **Quizzes & Assignments**: Assessments and submissions
- **Discussions**: Course forums and Q&A
- **Analytics**: Course and user analytics

## Project Structure

```
edupro/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── courses/           # Course pages
│   │   ├── dashboard/         # Student dashboard
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # UI components
│   │   ├── layout/           # Layout components
│   │   ├── course/           # Course components
│   │   └── dashboard/        # Dashboard components
│   ├── lib/                   # Utility functions
│   │   ├── db/               # Database configuration
│   │   ├── auth.ts           # Auth utilities
│   │   └── utils.ts          # Helper functions
│   ├── types/                 # TypeScript types
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
├── drizzle/                   # Database migrations
└── drizzle.config.ts         # Drizzle configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

## Authentication Setup

### Auth0 Configuration

1. Create an Auth0 application (Regular Web Application)
2. Configure Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
3. Configure Allowed Logout URLs: `http://localhost:3000`
4. Enable "Password" connection in Authentication > Database
5. Copy your Domain, Client ID, and Client Secret to `.env.local`

### Role-Based Access Control

The platform supports three user roles:

- **Student**: Can enroll in courses, track progress, and earn certificates
- **Instructor**: Can create and manage courses, view analytics
- **Admin**: Full platform access, user management, and analytics

## Payment Integration

### Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe Dashboard
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Add webhook secret to environment variables

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Make sure to update these for production:

- `AUTH0_BASE_URL` - Your production domain
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `DATABASE_URL` - Production database URL
- Use production Stripe keys

## Features Roadmap

### Implemented
- ✅ User authentication with Auth0
- ✅ Course catalog and detail pages
- ✅ Student dashboard
- ✅ Responsive UI with Tailwind CSS
- ✅ Database schema with proper indexes
- ✅ Type-safe database queries with Drizzle ORM

### In Development
- 🚧 Video player with progress tracking
- 🚧 Certificate generation with QR codes
- 🚧 Stripe payment integration
- 🚧 Instructor dashboard
- 🚧 Admin panel
- 🚧 Quiz and assignment system
- 🚧 Discussion forums
- 🚧 Analytics dashboard
- 🚧 Email notifications

## Performance Optimization

The platform is optimized for 15,000+ concurrent users:

- Database indexes on frequently queried columns
- Connection pooling with Neon serverless
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Caching strategies for static content
- CDN integration for media files

## Security

- Secure authentication with Auth0
- Role-based access control
- SQL injection prevention with Drizzle ORM
- CSRF protection
- Rate limiting on API routes
- Secure payment processing with Stripe

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@edupro-learn.com or join our community.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Auth0 for authentication
- Stripe for payment processing
- Neon for serverless PostgreSQL
