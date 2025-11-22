import { db } from "@/db/drizzle"
import { app_users } from "@/db/schema"
import { auth } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

// POST - Create profile (onboarding)
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { name, role, bio, phone, country, timezone, avatar } = body

  if (!name || !['student', 'instructor'].includes(role)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  // Prevent duplicate creation
  const existing = await db
    .select({ id: app_users.id })
    .from(app_users)
    .where(eq(app_users.userId, session.user.id))
    .limit(1)

  if (existing[0]) {
    return NextResponse.json({ profile: existing[0] })
  }

  const [profile] = await db
    .insert(app_users)
    .values({
      userId: session.user.id,
      name,
      role: role as 'student' | 'instructor',
      bio: bio || null,
      phone: phone || null,
      country: country || null,
      timezone: timezone || null,
      avatar: avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    })
    .returning()

  return NextResponse.json({ profile }, { status: 201 })
}

