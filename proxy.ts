import { NextRequest, NextResponse } from "next/server"
import { auth } from "./lib/auth"
import { db } from "./db/drizzle"
import { app_users } from "./db/schema"
import { eq } from "drizzle-orm"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Allow all static files, _next, api routes, favicon
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next()
  }

  // 2. Get session (Better Auth way)
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  const isLoggedIn = !!session?.user

  // Public pages (always allowed)
  const publicPaths = ["/", "/signin", "/signup", "/courses", "/courses/", "/testing"]
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  // If not logged in but on public page → allow
  if (!isLoggedIn) {
    return NextResponse.next()
  }

  // 3. Logged in → fetch app_users profile + role
  const userProfile = await db
    .select({
      id: app_users.id,
      role: app_users.role,
    })
    .from(app_users)
    .where(eq(app_users.userId, session.user.id))
    .limit(1)
    .then((rows) => rows[0])

  const hasProfile = !!userProfile
  const isAdmin = userProfile?.role === "admin"

  // 4. Admin-only: Block /admin/* if not admin
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      // Optional: redirect to dashboard or show 403 page
      return NextResponse.redirect(new URL("/dashboard", request.url))
      // Or return a 403:
      // return new NextResponse("Forbidden", { status: 403 })
    }
    // Admin → allow everything under /admin
    return NextResponse.next()
  }

  // 5. Require profile for protected areas
  const requiresProfile = pathname.startsWith("/dashboard") ||
                          pathname.startsWith("/profile") ||
                          pathname.startsWith("/learn")

  if (requiresProfile && !hasProfile) {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // 6. On /onboarding but already has profile → go to dashboard
  if (hasProfile && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // 7. All good → proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Run on all routes except:
     * - api routes
     * - static assets
     * - _next internals
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}