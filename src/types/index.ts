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
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  courseCount: number;
  isActive: boolean;
  order: number;
}

export interface Course {
  id: string;
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
  categoryId: string | null;
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
  id: string;
  title: string;
  description: string | null;
  order: number;
  courseId: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  order: number;
  durationSeconds: number | null;
  videoUrl: string | null;
  videoPlaybackId: string | null;
  content: string | null;
  isFree: boolean;
  resources: Record<string, unknown> | null;
  sectionId: string | null;
  courseId: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progressPercent: number;
  lastAccessedAt: Date | null;
  enrolledAt: Date;
  completedAt: Date | null;
  expiresAt: Date | null;
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  completed: boolean;
  watchedSeconds: number;
  lastWatchedAt: Date | null;
  completedAt: Date | null;
}

export interface Certificate {
  id: string;
  certificateId: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  pdfUrl: string | null;
  qrCodeUrl: string | null;
  verificationUrl: string | null;
  status: CertificateStatus;
  metadata: Record<string, unknown> | null;
}

export interface Payment {
  id: string;
  userId: string;
  courseId: string | null;
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
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  passingScore: number;
  timeLimit: number | null;
  maxAttempts: number;
  courseId: string;
  lessonId: string | null;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  questionType: string;
  options: Record<string, unknown>;
  correctAnswer: Record<string, unknown>;
  explanation: string | null;
  points: number;
  order: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  maxScore: number;
  dueDate: Date | null;
  courseId: string;
  lessonId: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}
