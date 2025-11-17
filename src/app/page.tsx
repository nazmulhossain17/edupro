import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Award, 
  Users, 
  TrendingUp, 
  Shield, 
  Database, 
  Brain, 
  Network,
  Code,
  Globe
} from 'lucide-react';

export default function HomePage() {
  const categories = [
    { name: 'Cybersecurity', icon: Shield, courses: 45, color: 'text-red-500' },
    { name: 'Data Science', icon: Database, courses: 38, color: 'text-blue-500' },
    { name: 'Artificial Intelligence', icon: Brain, courses: 52, color: 'text-purple-500' },
    { name: 'Networking', icon: Network, courses: 28, color: 'text-green-500' },
    { name: 'Programming', icon: Code, courses: 67, color: 'text-yellow-500' },
    { name: 'Web Development', icon: Globe, courses: 41, color: 'text-pink-500' },
  ];

  const features = [
    {
      icon: BookOpen,
      title: '24/7 Online Access',
      description: 'Learn at your own pace from anywhere in the world',
    },
    {
      icon: Award,
      title: 'Verifiable Certificates',
      description: 'Earn industry-recognized certificates with QR verification',
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with real-world experience',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Advance your career with in-demand IT skills',
    },
  ];

  const stats = [
    { label: 'Active Students', value: '15,000+' },
    { label: 'Expert Instructors', value: '200+' },
    { label: 'Courses Available', value: '500+' },
    { label: 'Certificates Issued', value: '10,000+' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge className="mb-4">Industry-Relevant IT Education</Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Master In-Demand IT Skills with{' '}
                <span className="text-primary">EduPro Learn</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Access world-class courses in Cybersecurity, Data Science, AI, and more. 
                Earn verifiable certificates and advance your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" asChild>
                  <Link href="/courses">Explore Courses</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 border-b">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Popular Course Categories
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our comprehensive range of IT courses designed for both beginners and professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Link key={category.name} href={`/courses?category=${category.name.toLowerCase()}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg bg-muted ${category.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle>{category.name}</CardTitle>
                            <CardDescription>{category.courses} courses</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose EduPro Learn?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We provide everything you need to succeed in your IT career
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title}>
                    <CardHeader>
                      <Icon className="h-10 w-10 text-primary mb-4" />
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl mb-4">
                    Ready to Start Learning?
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-lg">
                    Join thousands of students already learning on EduPro Learn
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/signup">Get Started Free</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
