import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Award, 
  Clock,
  TrendingUp,
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const enrolledCourses = [
    {
      id: 1,
      title: 'Complete Cybersecurity Bootcamp',
      slug: 'complete-cybersecurity-bootcamp',
      thumbnail: '/placeholder-course.jpg',
      progress: 45,
      lastAccessed: '2 hours ago',
      instructor: 'John Smith',
      totalLessons: 45,
      completedLessons: 20,
    },
    {
      id: 2,
      title: 'Data Science with Python',
      slug: 'data-science-with-python',
      thumbnail: '/placeholder-course.jpg',
      progress: 78,
      lastAccessed: '1 day ago',
      instructor: 'Sarah Johnson',
      totalLessons: 38,
      completedLessons: 30,
    },
  ];

  const certificates = [
    {
      id: 1,
      courseTitle: 'Full Stack Web Development',
      issuedDate: 'October 2025',
      certificateId: 'EDU-2025-001234',
    },
  ];

  const stats = [
    { label: 'Courses Enrolled', value: '5', icon: BookOpen },
    { label: 'Certificates Earned', value: '2', icon: Award },
    { label: 'Hours Learned', value: '124', icon: Clock },
    { label: 'Completion Rate', value: '68%', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Track your learning progress and achievements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardDescription>{stat.label}</CardDescription>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.id}>
                    <div className="aspect-video relative bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        Course Thumbnail
                      </div>
                      <Badge className="absolute top-4 right-4">
                        {course.progress}% Complete
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <CardDescription>by {course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">
                            {course.completedLessons}/{course.totalLessons} lessons
                          </span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Last accessed {course.lastAccessed}
                        </span>
                      </div>
                      
                      <Button className="w-full" asChild>
                        <Link href={`/courses/${course.slug}/learn`}>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Continue Learning
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <Card key={cert.id}>
                    <CardHeader>
                      <div className="flex items-center justify-center mb-4">
                        <Award className="h-16 w-16 text-primary" />
                      </div>
                      <CardTitle className="text-center line-clamp-2">
                        {cert.courseTitle}
                      </CardTitle>
                      <CardDescription className="text-center">
                        Issued {cert.issuedDate}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          Certificate ID
                        </p>
                        <p className="text-sm font-mono font-medium">
                          {cert.certificateId}
                        </p>
                      </div>
                      <Button className="w-full" variant="outline">
                        Download Certificate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                  <CardDescription>
                    Courses you&apos;re interested in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    Your wishlist is empty. Start adding courses you&apos;re interested in!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
