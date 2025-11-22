'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Upload, BookOpen, Briefcase } from 'lucide-react'
import { countries as countriesData, type ICountry } from 'countries-list'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

// Get all countries sorted
const countries = Object.entries(countriesData)
  .map(([code, country]) => ({
    code,
    ...(country as ICountry),
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<'student' | 'instructor'>('student')
  const [avatarPreview, setAvatarPreview] = useState('https://cdn-icons-png.flaticon.com/512/149/149071.png')
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const router = useRouter()

  const selectedCountry = countries.find(c => c.code === selectedCountryCode)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (!phoneNumber) {
      toast.error('Phone number is required')
      return
    }
    
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    const payload = {
      name: formData.get('name') as string,
      role,
      bio: (formData.get('bio') as string) || null,
      phone: phoneNumber,
      country: selectedCountry?.name || null,
      timezone: null,
      avatar: avatarPreview.includes('flaticon') ? null : avatarPreview,
    }

    try {
      const res = await fetch('/api/profile/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Failed to save profile')

      toast.success('Welcome! Your profile is ready')
      router.push('/dashboard')
    } catch (err: any) {
      toast.error(err.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-primary/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Complete Your Profile</h1>
          <p className="text-lg text-muted-foreground mt-3">Let's get started</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-8 bg-card border rounded-3xl p-10 shadow-2xl">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border">
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Upload className="h-10 w-10 text-white" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" placeholder="John Doe" required disabled={loading} className="mt-2 h-12" />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <PhoneInput
                international
                defaultCountry="BD"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value || '')}
                disabled={loading}
                className="mt-2 h-12 flex items-center border border-input rounded-md px-3 bg-background phone-input-custom"
                placeholder="+880 1234 567890"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <Label>I want to join as...</Label>
            <div className="grid grid-cols-2 gap-8 mt-6">
              <button type="button" onClick={() => setRole('student')}
                className={`p-10 rounded-2xl border-2 transition-all ${role === 'student' ? 'border-primary bg-primary/10 shadow-xl' : 'border-border'}`}>
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-primary" />
                <div className="text-2xl font-bold">Student</div>
              </button>
              <button type="button" onClick={() => setRole('instructor')}
                className={`p-10 rounded-2xl border-2 transition-all ${role === 'instructor' ? 'border-primary bg-primary/10 shadow-xl' : 'border-border'}`}>
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-primary" />
                <div className="text-2xl font-bold">Instructor</div>
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea id="bio" name="bio" placeholder="Tell us about yourself..." rows={4} disabled={loading} className="mt-2" />
          </div>

          {/* Country */}
          <div>
            <Label>Country</Label>
            <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
              <SelectTrigger className="mt-2 h-12">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                     {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold" disabled={loading}>
            {loading ? 'Saving...' : 'Start Learning'}
          </Button>
        </form>
      </div>
    </div>
  )
}