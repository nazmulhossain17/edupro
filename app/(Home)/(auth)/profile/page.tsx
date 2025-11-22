'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Upload, Mail, Globe, Clock } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type Profile = {
  name: string
  email: string
  image?: string
  bio?: string | null
  phone?: string | null
  country?: string | null
  timezone?: string | null
  role: "student" | "instructor" | "admin"
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    fetchProfile()
    setTimeout(() => setHasAnimated(true), 100)
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: session } = await authClient.getSession()
      if (!session?.user) throw new Error("Not authenticated")

      const res = await fetch("/api/user/profile")
      if (!res.ok) throw new Error("Failed to load profile")
      const { profile: dbProfile } = await res.json()

      // Merge DB profile + session data
      setProfile({
        ...dbProfile,
        email: session.user.email!, // ← This shows the email
        image: session.user.image || dbProfile.avatar,
      })

      setAvatarPreview(dbProfile.avatar || session.user.image || "")
    } catch (err) {
      toast.error("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const updates = {
      bio: formData.get("bio") as string,
      phone: formData.get("phone") as string,
      avatar: avatarPreview.includes("data:") ? avatarPreview : undefined,
    }

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!res.ok) throw new Error("Failed to update profile")

      toast.success("Profile updated successfully!")
      fetchProfile() // refresh
    } catch (err) {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[60vh] py-10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto py-6 px-4 sm:py-10">
      <div
        className={`mb-8 sm:mb-12 transition-all duration-700 ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        {/* Left: Avatar + Info */}
        <Card
          className={`lg:col-span-1 transition-all duration-700 delay-100 hover:shadow-lg ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <CardContent className="pt-6 sm:pt-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative group mb-6">
                <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Avatar className="h-28 w-28 sm:h-32 sm:w-32 ring-4 ring-background shadow-xl relative z-10 transition-all duration-300 group-hover:scale-105 group-hover:ring-primary/20">
                  <AvatarImage src={avatarPreview || "/placeholder.svg"} className="object-cover" />
                  <AvatarFallback className="text-2xl sm:text-3xl bg-linear-to-br from-primary to-primary/70 text-primary-foreground">
                    {profile?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer z-20 scale-95 group-hover:scale-100">
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-white transform group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-xs text-white/90 font-medium">Upload</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold mb-1 transition-colors hover:text-primary">
                {profile?.name}
              </h2>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium capitalize mb-3 transition-all hover:bg-primary/20">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                {profile?.role}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-[200px]">{profile?.email}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Right: Editable Fields */}
        <Card
          className={`lg:col-span-2 transition-all duration-700 delay-200 hover:shadow-lg ${hasAnimated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl">Edit Profile</CardTitle>
            <CardDescription className="text-sm">
              Update your personal information and make changes to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  defaultValue={profile?.bio || ""}
                  rows={4}
                  className="resize-none transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                />
                <p className="text-xs text-muted-foreground">Brief description for your profile. Max 200 characters.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  defaultValue={profile?.phone || ""}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                />
              </div>

              {/* Read-only info */}
              <div className="space-y-3 pt-6 border-t">
                <h3 className="text-sm font-semibold text-foreground mb-4">Account Information</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-200 hover:bg-muted group">
                    <div className="p-2 rounded-md bg-background shadow-sm group-hover:shadow transition-shadow">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Country</p>
                      <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                        {profile?.country || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-200 hover:bg-muted group">
                    <div className="p-2 rounded-md bg-background shadow-sm group-hover:shadow transition-shadow">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Timezone</p>
                      <p className="text-sm font-medium text-foreground mt-0.5 truncate">
                        {profile?.timezone?.replace(/_/g, " ") || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={saving}
                  className="w-full sm:w-auto min-w-[140px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  {saving ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}