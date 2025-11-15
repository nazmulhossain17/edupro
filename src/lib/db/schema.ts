import {
  pgTable,
  serial,
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
  bigserial,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['student', 'instructor', 'admin']);
export const enrollmentStatusEnum = pgEnum('enrollment_status', [
  'active',
  'completed',
  'cancelled',
  'expired',
]);
export const certificateStatusEnum = pgEnum('certificate_status', [
  'issued',
  'revoked',
  'pending',
]);
export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'succeeded',
  'failed',
  'refunded',
]);
export const courseLevelEnum = pgEnum('course_level', [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
]);
export const assignmentStatusEnum = pgEnum('assignment_status', [
  'pending',
  'submitted',
  'graded',
  'late',
]);
export const quizStatusEnum = pgEnum('quiz_status', [
  'not_started',
  'in_progress',
  'completed',
]);


export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }),
    avatar: varchar('avatar', { length: 512 }),
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
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
    isActiveIdx: index('users_is_active_idx').on(table.isActive),
    createdAtIdx: index('users_created_at_idx').on(table.createdAt),
    lastLoginIdx: index('users_last_login_idx').on(table.lastLoginAt),
  })
);

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  icon: varchar('icon', { length: 255 }),
  courseCount: integer('course_count').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  order: integer('order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('categories_slug_idx').on(table.slug),
  isActiveIdx: index('categories_is_active_idx').on(table.isActive),
  orderIdx: index('categories_order_idx').on(table.order),
}));

export const courses = pgTable(
  'courses',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
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
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
    instructorId: varchar('instructor_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
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
    levelIdx: index('courses_level_idx').on(table.level),
    priceIdx: index('courses_price_idx').on(table.price),
    ratingIdx: index('courses_rating_idx').on(table.averageRating),
    enrollmentIdx: index('courses_enrollment_idx').on(table.enrollmentCount),
    createdAtIdx: index('courses_created_at_idx').on(table.createdAt),
  })
);

export const sections = pgTable('sections', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  courseId: bigint('course_id', { mode: 'number' })
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  courseOrderIdx: index('sections_course_order_idx').on(table.courseId, table.order),
}));

export const lessons = pgTable('lessons', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  order: integer('order').notNull(),
  durationSeconds: integer('duration_seconds'),
  videoUrl: varchar('video_url', { length: 512 }),
  videoPlaybackId: varchar('video_playback_id', { length: 255 }),
  content: text('content'),
  isFree: boolean('is_free').default(false).notNull(),
  resources: jsonb('resources'),
  sectionId: bigint('section_id', { mode: 'number' })
    .references(() => sections.id, { onDelete: 'set null' }),
  courseId: bigint('course_id', { mode: 'number' })
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  courseOrderIdx: index('lessons_course_order_idx').on(table.courseId, table.order),
  sectionIdx: index('lessons_section_idx').on(table.sectionId),
  isFreeIdx: index('lessons_is_free_idx').on(table.isFree),
}));

export const enrollments = pgTable(
  'enrollments',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: bigint('course_id', { mode: 'number' })
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    status: enrollmentStatusEnum('status').default('active').notNull(),
    progressPercent: integer('progress_percent').default(0).notNull(),
    lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }),
    enrolledAt: timestamp('enrolled_at', { withTimezone: true }).defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
  },
  (table) => ({
    userCourseUnique: uniqueIndex('enrollments_user_course_idx').on(table.userId, table.courseId),
    userIdx: index('enrollments_user_idx').on(table.userId),
    courseIdx: index('enrollments_course_idx').on(table.courseId),
    statusIdx: index('enrollments_status_idx').on(table.status),
    progressIdx: index('enrollments_progress_idx').on(table.progressPercent),
    lastAccessedIdx: index('enrollments_last_accessed_idx').on(table.lastAccessedAt),
    enrolledAtIdx: index('enrollments_enrolled_at_idx').on(table.enrolledAt),
  })
);

export const lessonProgress = pgTable(
  'lesson_progress',
  {
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: bigint('lesson_id', { mode: 'number' })
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    completed: boolean('completed').default(false).notNull(),
    watchedSeconds: integer('watched_seconds').default(0),
    lastWatchedAt: timestamp('last_watched_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.lessonId] }),
    completedIdx: index('lesson_progress_completed_idx').on(table.completed),
    lastWatchedIdx: index('lesson_progress_last_watched_idx').on(table.lastWatchedAt),
  })
);

export const quizzes = pgTable('quizzes', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  passingScore: integer('passing_score').default(70).notNull(),
  timeLimit: integer('time_limit'),
  maxAttempts: integer('max_attempts').default(3),
  courseId: bigint('course_id', { mode: 'number' })
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  lessonId: bigint('lesson_id', { mode: 'number' })
    .references(() => lessons.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  courseIdx: index('quizzes_course_idx').on(table.courseId),
  lessonIdx: index('quizzes_lesson_idx').on(table.lessonId),
}));

export const quizQuestions = pgTable('quiz_questions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  quizId: bigint('quiz_id', { mode: 'number' })
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  questionType: varchar('question_type', { length: 50 }).default('multiple_choice'),
  options: jsonb('options').notNull(),
  correctAnswer: jsonb('correct_answer').notNull(),
  explanation: text('explanation'),
  points: integer('points').default(1).notNull(),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  quizOrderIdx: index('quiz_questions_quiz_order_idx').on(table.quizId, table.order),
}));

export const quizAttempts = pgTable('quiz_attempts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  quizId: bigint('quiz_id', { mode: 'number' })
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  score: integer('score'),
  totalPoints: integer('total_points'),
  passed: boolean('passed').default(false),
  answers: jsonb('answers'),
  status: quizStatusEnum('status').default('not_started').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (table) => ({
  userQuizIdx: index('quiz_attempts_user_quiz_idx').on(table.userId, table.quizId),
  statusIdx: index('quiz_attempts_status_idx').on(table.status),
}));

export const assignments = pgTable('assignments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  instructions: text('instructions'),
  maxScore: integer('max_score').default(100).notNull(),
  dueDate: timestamp('due_date', { withTimezone: true }),
  courseId: bigint('course_id', { mode: 'number' })
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  lessonId: bigint('lesson_id', { mode: 'number' })
    .references(() => lessons.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  courseIdx: index('assignments_course_idx').on(table.courseId),
  lessonIdx: index('assignments_lesson_idx').on(table.lessonId),
  dueDateIdx: index('assignments_due_date_idx').on(table.dueDate),
}));

export const assignmentSubmissions = pgTable('assignment_submissions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  assignmentId: bigint('assignment_id', { mode: 'number' })
    .notNull()
    .references(() => assignments.id, { onDelete: 'cascade' }),
  content: text('content'),
  attachments: jsonb('attachments'),
  score: integer('score'),
  feedback: text('feedback'),
  status: assignmentStatusEnum('status').default('pending').notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
  gradedAt: timestamp('graded_at', { withTimezone: true }),
  gradedBy: varchar('graded_by', { length: 255 })
    .references(() => users.id, { onDelete: 'set null' }),
}, (table) => ({
  userAssignmentIdx: index('assignment_submissions_user_assignment_idx').on(table.userId, table.assignmentId),
  statusIdx: index('assignment_submissions_status_idx').on(table.status),
  submittedAtIdx: index('assignment_submissions_submitted_at_idx').on(table.submittedAt),
}));

export const certificates = pgTable(
  'certificates',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    certificateId: varchar('certificate_id', { length: 50 }).notNull().unique(),
    userId: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    courseId: bigint('course_id', { mode: 'number' })
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow(),
    pdfUrl: varchar('pdf_url', { length: 512 }),
    qrCodeUrl: varchar('qr_code_url', { length: 512 }),
    verificationUrl: varchar('verification_url', { length: 512 }),
    status: certificateStatusEnum('status').default('issued').notNull(),
    metadata: jsonb('metadata'),
  },
  (table) => ({
    certIdIdx: uniqueIndex('certificates_cert_id_idx').on(table.certificateId),
    userCourseIdx: uniqueIndex('certificates_user_course_idx').on(table.userId, table.courseId),
    userIdx: index('certificates_user_idx').on(table.userId),
    courseIdx: index('certificates_course_idx').on(table.courseId),
    statusIdx: index('certificates_status_idx').on(table.status),
    issuedAtIdx: index('certificates_issued_at_idx').on(table.issuedAt),
  })
);

export const payments = pgTable('payments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  courseId: bigint('course_id', { mode: 'number' })
    .references(() => courses.id, { onDelete: 'set null' }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('usd'),
  status: paymentStatusEnum('status').default('pending').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userIdx: index('payments_user_idx').on(table.userId),
  courseIdx: index('payments_course_idx').on(table.courseId),
  statusIdx: index('payments_status_idx').on(table.status),
  stripeIntentIdx: index('payments_stripe_intent_idx').on(table.stripePaymentIntentId),
  createdAtIdx: index('payments_created_at_idx').on(table.createdAt),
}));

export const reviews = pgTable('reviews', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  courseId: bigint('course_id', { mode: 'number' })
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  isPublished: boolean('is_published').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userCourseUnique: uniqueIndex('reviews_user_course_idx').on(table.userId, table.courseId),
  courseIdx: index('reviews_course_idx').on(table.courseId),
  ratingIdx: index('reviews_rating_idx').on(table.rating),
  isPublishedIdx: index('reviews_is_published_idx').on(table.isPublished),
  createdAtIdx: index('reviews_created_at_idx').on(table.createdAt),
}));

export const notifications = pgTable('notifications', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  link: varchar('link', { length: 512 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userIdx: index('notifications_user_idx').on(table.userId),
  isReadIdx: index('notifications_is_read_idx').on(table.isRead),
  typeIdx: index('notifications_type_idx').on(table.type),
  createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
}));

export const courseAnalytics = pgTable('course_analytics', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  courseId: bigint('course_id', { mode: 'number' })
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  date: timestamp('date', { withTimezone: true }).notNull(),
  views: integer('views').default(0),
  enrollments: integer('enrollments').default(0),
  completions: integer('completions').default(0),
  revenue: decimal('revenue', { precision: 10, scale: 2 }).default('0.00'),
  avgWatchTime: integer('avg_watch_time').default(0),
}, (table) => ({
  courseDateIdx: uniqueIndex('course_analytics_course_date_idx').on(table.courseId, table.date),
  dateIdx: index('course_analytics_date_idx').on(table.date),
}));

export const userActivityLog = pgTable('user_activity_log', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 100 }).notNull(),
  resourceType: varchar('resource_type', { length: 50 }),
  resourceId: varchar('resource_id', { length: 255 }),
  metadata: jsonb('metadata'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  userIdx: index('user_activity_log_user_idx').on(table.userId),
  actionIdx: index('user_activity_log_action_idx').on(table.action),
  resourceIdx: index('user_activity_log_resource_idx').on(table.resourceType, table.resourceId),
  createdAtIdx: index('user_activity_log_created_at_idx').on(table.createdAt),
}));

export const wishlists = pgTable('wishlists', {
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  courseId: bigint('course_id', { mode: 'number' })
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.courseId] }),
  userIdx: index('wishlists_user_idx').on(table.userId),
  courseIdx: index('wishlists_course_idx').on(table.courseId),
}));

export const discussions = pgTable('discussions', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  courseId: bigint('course_id', { mode: 'number' })
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  lessonId: bigint('lesson_id', { mode: 'number' })
    .references(() => lessons.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').default(false),
  isResolved: boolean('is_resolved').default(false),
  replyCount: integer('reply_count').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  courseIdx: index('discussions_course_idx').on(table.courseId),
  lessonIdx: index('discussions_lesson_idx').on(table.lessonId),
  userIdx: index('discussions_user_idx').on(table.userId),
  isPinnedIdx: index('discussions_is_pinned_idx').on(table.isPinned),
  createdAtIdx: index('discussions_created_at_idx').on(table.createdAt),
}));

export const discussionReplies = pgTable('discussion_replies', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  discussionId: bigint('discussion_id', { mode: 'number' })
    .notNull()
    .references(() => discussions.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  isInstructorReply: boolean('is_instructor_reply').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  discussionIdx: index('discussion_replies_discussion_idx').on(table.discussionId),
  userIdx: index('discussion_replies_user_idx').on(table.userId),
  createdAtIdx: index('discussion_replies_created_at_idx').on(table.createdAt),
}));
