import { authClient } from "@/lib/auth-client";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type SessionData = Awaited<ReturnType<typeof authClient.getSession>>['data']

export function UserInfo() {
  const [session, setSession] = useState<SessionData>({ user: null });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Fetch session on mount
  useEffect(() => {
    async function fetchSession() {
      try {
        const { data } = await authClient.getSession();
        setSession(data);
      } catch (error) {
        setSession({ user: null });
      } finally {
        setLoading(false);
      }
    }
    fetchSession();
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="hidden lg:block">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!session.user) return null;

  const user = session.user;
  const displayName = user.name || user.email?.split("@")[0] || "User";
  const avatarUrl =
    user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        <div className="relative">
          <Image
            src={avatarUrl}
            alt={displayName}
            width={40}
            height={40}
            className="rounded-full border-2 border-gray-200 dark:border-gray-700 object-cover"
          />
          <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
        </div>

        <div className="hidden lg:flex flex-col items-start text-left">
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {displayName}
          </span>
          {user.email && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </span>
          )}
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900 z-50">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <Image
                src={avatarUrl}
                alt={displayName}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {displayName}
                </p>
                {user.email && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="py-2">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <User className="h-4 w-4" />
                View Profile
              </Link>

              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}