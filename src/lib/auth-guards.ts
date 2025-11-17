import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getSession(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return session;
}

export async function requireAuth(req: NextRequest) {
  const session = await getSession(req);

  if (!session || !session.user) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    return {
      error: NextResponse.json({ error: "User not found" }, { status: 404 }),
      user: null,
    };
  }

  return { error: null, user };
}

export async function requireRole(
  req: NextRequest,
  role: "student" | "instructor" | "admin"
) {
  const { error, user } = await requireAuth(req);

  if (error) {
    return { error, user: null };
  }

  if (user!.role !== role && user!.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      user: null,
    };
  }

  return { error: null, user };
}
