export type UserRole = 'student' | 'instructor' | 'admin';

export type EnrollmentStatus = 'active' | 'completed' | 'cancelled' | 'expired';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export type CertificateStatus = 'issued' | 'revoked' | 'pending';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: UserRole;
  bio: string | null;
  phone: string | null;
  country: string | null;
  timezone: string | null;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  courseCount: number;
  isActive: boolean;
  order: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  thumbnail: string | null;
  previewVideo: string | null;
  price: string;
  discountPrice: string | null;
  level: CourseLevel;
  durationMinutes: number | null;
  language: string;
  published: boolean;
  featured: boolean;
  categoryId: number | null;
  instructorId: string;
  enrollmentCount: number;
  averageRating: string;
  reviewCount: number;
  completionRate: string;
  requirements: string[] | null;
  learningOutcomes: string[] | null;
  targetAudience: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseWithInstructor extends Course {
  instructor: User;
  category: Category | null;
}

export interface Section {
  id: number;
  title: string;
  description: string | null;
  order: number;
  courseId: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  slug: string;
  order: number;
  durationSeconds: number | null;
  videoUrl: string | null;
  videoPlaybackId: string | null;
  content: string | null;
  isFree: boolean;
  resources: Record<string, unknown> | null;
  sectionId: number | null;
  courseId: number;
}

export interface Enrollment {
  id: number;
  userId: string;
  courseId: number;
  status: EnrollmentStatus;
  progressPercent: number;
  lastAccessedAt: Date | null;
  enrolledAt: Date;
  completedAt: Date | null;
  expiresAt: Date | null;
}

export interface LessonProgress {
  userId: string;
  lessonId: number;
  completed: boolean;
  watchedSeconds: number;
  lastWatchedAt: Date | null;
  completedAt: Date | null;
}

export interface Certificate {
  id: number;
  certificateId: string;
  userId: string;
  courseId: number;
  issuedAt: Date;
  pdfUrl: string | null;
  qrCodeUrl: string | null;
  verificationUrl: string | null;
  status: CertificateStatus;
  metadata: Record<string, unknown> | null;
}

export interface Payment {
  id: number;
  userId: string;
  courseId: number | null;
  stripePaymentIntentId: string;
  stripeCustomerId: string | null;
  amount: string;
  currency: string;
  status: PaymentStatus;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: number;
  userId: string;
  courseId: number;
  rating: number;
  comment: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number;
  courseId: number;
  lessonId: number | null;
}

export interface QuizQuestion {
  id: number;
  quizId: number;
  question: string;
  questionType: string;
  options: Record<string, unknown>;
  correctAnswer: Record<string, unknown>;
  explanation: string | null;
  points: number;
  order: number;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  instructions: string | null;
  maxScore: number;
  dueDate: Date | null;
  courseId: number;
  lessonId: number | null;
}

export interface Notification {
  id: number;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}
