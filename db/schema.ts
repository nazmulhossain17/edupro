import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['student', 'instructor', 'admin']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', ['active', 'completed', 'cancelled', 'expired']);
export const certificateStatusEnum = pgEnum('certificate_status', ['issued', 'revoked', 'pending']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'succeeded', 'failed', 'refunded']);
export const courseLevelEnum = pgEnum('course_level', ['beginner', 'intermediate', 'advanced', 'expert']);
export const assignmentStatusEnum = pgEnum('assignment_status', ['pending', 'submitted', 'graded', 'late']);
export const quizStatusEnum = pgEnum('quiz_status', ['not_started', 'in_progress', 'completed']);

const uuidV4 = () => sql`gen_random_uuid()`;

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const app_users = pgTable(
  'app_users',
  {
    id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
    userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
    name: varchar('name', { length: 255 }),
    avatar: varchar('avatar', { length: 512 }).default('https://cdn-icons-png.flaticon.com/512/149/149071.png'),
    role: roleEnum('role').default('student').notNull(),
    bio: text('bio'),
    phone: varchar('phone', { length: 50 }),
    country: varchar('country', { length: 100 }),
    timezone: varchar('timezone', { length: 100 }),
    isActive: boolean('is_active').default(true).notNull(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    roleIdx: index('users_role_idx').on(table.role),
    isActiveIdx: index('users_is_active_idx').on(table.isActive),
    createdAtIdx: index('users_created_at_idx').on(table.createdAt),
  })
);

// Categories — UUID
export const categories = pgTable('categories', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  courseCount: integer('course_count').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  order: integer('order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('categories_slug_idx').on(table.slug),
  isActiveIdx: index('categories_is_active_idx').on(table.isActive),
}));

// Courses — UUID
export const courses = pgTable(
  'courses',
  {
    id: uuid('id').default(uuidV4()).primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description').notNull(),
    shortDescription: varchar('short_description', { length: 500 }),
    thumbnail: varchar('thumbnail', { length: 512 }),
    previewVideo: varchar('preview_video', { length: 512 }),
    price: decimal('price', { precision: 10, scale: 2 }).default('0.00').notNull(),
    discountPrice: decimal('discount_price', { precision: 10, scale: 2 }),
    level: courseLevelEnum('level').default('beginner').notNull(),
    durationMinutes: integer('duration_minutes'),
    language: varchar('language', { length: 50 }).default('English'),
    published: boolean('published').default(false).notNull(),
    featured: boolean('featured').default(false).notNull(),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    instructorId: uuid('instructor_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
    enrollmentCount: integer('enrollment_count').default(0).notNull(),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0.00'),
    reviewCount: integer('review_count').default(0).notNull(),
    completionRate: decimal('completion_rate', { precision: 5, scale: 2 }).default('0.00'),
    requirements: jsonb('requirements'),
    learningOutcomes: jsonb('learning_outcomes'),
    targetAudience: jsonb('target_audience'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex('courses_slug_idx').on(table.slug),
    instructorIdx: index('courses_instructor_idx').on(table.instructorId),
    publishedIdx: index('courses_published_idx').on(table.published),
    featuredIdx: index('courses_featured_idx').on(table.featured),
    categoryIdx: index('courses_category_idx').on(table.categoryId),
  })
);

// Sections — UUID
export const sections = pgTable('sections', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  courseOrderIdx: index('sections_course_order_idx').on(table.courseId, table.order),
}));

// Lessons — UUID
export const lessons = pgTable('lessons', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  order: integer('order').notNull(),
  durationSeconds: integer('duration_seconds'),
  videoUrl: varchar('video_url', { length: 512 }),
  videoPlaybackId: varchar('video_playback_id', { length: 255 }),
  content: text('content'),
  isFree: boolean('is_free').default(false).notNull(),
  resources: jsonb('resources'),
  sectionId: uuid('section_id').references(() => sections.id, { onDelete: 'set null' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  courseOrderIdx: index('lessons_course_order_idx').on(table.courseId, table.order),
  sectionIdx: index('lessons_section_idx').on(table.sectionId),
}));

// All other tables updated to UUID below...

export const enrollments = pgTable('enrollments', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  status: enrollmentStatusEnum('status').default('active').notNull(),
  progressPercent: integer('progress_percent').default(0).notNull(),
  lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }),
  enrolledAt: timestamp('enrolled_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
}, (table) => ({
  userCourseUnique: uniqueIndex('enrollments_user_course_idx').on(table.appUserId, table.courseId),
}));

export const lessonProgress = pgTable('lesson_progress', {
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  lessonId: uuid('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  completed: boolean('completed').default(false).notNull(),
  watchedSeconds: integer('watched_seconds').default(0),
  lastWatchedAt: timestamp('last_watched_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.appUserId, table.lessonId] }),
}));

export const quizzes = pgTable('quizzes', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  passingScore: integer('passing_score').default(70).notNull(),
  timeLimit: integer('time_limit'),
  maxAttempts: integer('max_attempts').default(3),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  lessonId: uuid('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const quizQuestions = pgTable('quiz_questions', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  quizId: uuid('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  questionType: varchar('question_type', { length: 50 }).default('multiple_choice'),
  options: jsonb('options').notNull(),
  correctAnswer: jsonb('correct_answer').notNull(),
  explanation: text('explanation'),
  points: integer('points').default(1).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  quizId: uuid('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  score: integer('score'),
  totalPoints: integer('total_points'),
  passed: boolean('passed').default(false),
  answers: jsonb('answers'),
  status: quizStatusEnum('status').default('not_started').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const assignments = pgTable('assignments', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  instructions: text('instructions'),
  maxScore: integer('max_score').default(100).notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  lessonId: uuid('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const assignmentSubmissions = pgTable('assignment_submissions', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  assignmentId: uuid('assignment_id').notNull().references(() => assignments.id, { onDelete: 'cascade' }),
  content: text('content'),
  attachments: jsonb('attachments'),
  score: integer('score'),
  feedback: text('feedback'),
  status: assignmentStatusEnum('status').default('pending').notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
  gradedAt: timestamp('graded_at', { withTimezone: true }),
  gradedBy: uuid('graded_by').references(() => app_users.id, { onDelete: 'set null' }),
});

export const certificates = pgTable('certificates', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  certificateId: varchar('certificate_id', { length: 50 }).notNull().unique(),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow(),
  pdfUrl: varchar('pdf_url', { length: 512 }),
  qrCodeUrl: varchar('qr_code_url', { length: 512 }),
  verificationUrl: varchar('verification_url', { length: 512 }),
  status: certificateStatusEnum('status').default('issued').notNull(),
  metadata: jsonb('metadata'),
}, (table) => ({
  certIdIdx: uniqueIndex('certificates_cert_id_idx').on(table.certificateId),
  userCourseIdx: uniqueIndex('certificates_user_course_idx').on(table.appUserId, table.courseId),
}));

export const payments = pgTable('payments', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'set null' }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('usd'),
  status: paymentStatusEnum('status').default('pending').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userCourseUnique: uniqueIndex('reviews_user_course_idx').on(table.appUserId, table.courseId),
}));

export const notifications = pgTable('notifications', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  link: varchar('link', { length: 512 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const courseAnalytics = pgTable('course_analytics', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  date: timestamp('date', { withTimezone: true }).notNull(),
  views: integer('views').default(0),
  enrollments: integer('enrollments').default(0),
  completions: integer('completions').default(0),
  revenue: decimal('revenue', { precision: 10, scale: 2 }).default('0.00'),
  avgWatchTime: integer('avg_watch_time').default(0),
}, (table) => ({
  courseDateIdx: uniqueIndex('course_analytics_course_date_idx').on(table.courseId, table.date),
}));

export const userActivityLog = pgTable('user_activity_log', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 50 }),
  resourceId: varchar('resource_id', { length: 255 }),
  metadata: jsonb('metadata'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const wishlists = pgTable('wishlists', {
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.appUserId, table.courseId] }),
}));

export const discussions = pgTable('discussions', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  courseId: uuid('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  lessonId: uuid('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').default(false),
  isResolved: boolean('is_resolved').default(false),
  replyCount: integer('reply_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const discussionReplies = pgTable('discussion_replies', {
  id: uuid('id').default(uuidV4()).primaryKey(),
  discussionId: uuid('discussion_id').notNull().references(() => discussions.id, { onDelete: 'cascade' }),
  appUserId: uuid('app_user_id').notNull().references(() => app_users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isInstructorReply: boolean('is_instructor_reply').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});


export const schema = {
    user,
    session,
    account,
    verification,
    app_users,
    reviews,
    notifications,
    courseAnalytics,
    userActivityLog,
    wishlists,
    discussions,
    discussionReplies
}