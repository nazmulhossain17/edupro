import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus,
  Edit,
  Eye,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function InstructorDashboardPage() {
  const stats = [
    { label: 'Total Courses', value: '12', icon: BookOpen, change: '+2 this month' },
    { label: 'Total Students', value: '1,234', icon: Users, change: '+156 this month' },
    { label: 'Total Revenue', value: '$12,450', icon: DollarSign, change: '+$2,340 this month' },
    { label: 'Avg. Rating', value: '4.8', icon: TrendingUp, change: '+0.2 this month' },
  ];

  const courses = [
    {
      id: 1,
      title: 'Complete React Developer Course',
      status: 'published',
      students: 456,
      revenue: '$4,560',
      rating: 4.9,
      lastUpdated: '2 days ago',
    },
    {
      id: 2,
      title: 'Advanced JavaScript Patterns',
      status: 'published',
      students: 342,
      revenue: '$3,420',
      rating: 4.7,
      lastUpdated: '1 week ago',
    },
    {
      id: 3,
      title: 'TypeScript Fundamentals',
      status: 'pending',
      students: 0,
      revenue: '$0',
      rating: 0,
      lastUpdated: '3 hours ago',
    },
    {
      id: 4,
      title: 'Node.js Backend Development',
      status: 'draft',
      students: 0,
      revenue: '$0',
      rating: 0,
      lastUpdated: '1 day ago',
    },
  ];

  const recentStudents = [
    {
      id: 1,
      name: 'Alice Johnson',
      course: 'Complete React Developer Course',
      progress: 75,
      enrolledAt: '2 days ago',
    },
    {
      id: 2,
      name: 'Bob Smith',
      course: 'Advanced JavaScript Patterns',
      progress: 45,
      enrolledAt: '5 days ago',
    },
    {
      id: 3,
      name: 'Carol Williams',
      course: 'Complete React Developer Course',
      progress: 90,
      enrolledAt: '1 week ago',
    },
  ];

  const recentReviews = [
    {
      id: 1,
      student: 'David Lee',
      course: 'Complete React Developer Course',
      rating: 5,
      comment: 'Excellent course! Very detailed and easy to follow.',
      timestamp: '1 hour ago',
    },
    {
      id: 2,
      student: 'Emma Davis',
      course: 'Advanced JavaScript Patterns',
      rating: 4,
      comment: 'Great content, but could use more practical examples.',
      timestamp: '3 hours ago',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default">Published</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Manage your courses and track student progress
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/instructor/courses/new">
                <Plus className="h-5 w-5 mr-2" />
                Create New Course
              </Link>
            </Button>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your Courses</CardTitle>
                  <CardDescription>
                    Manage and monitor your course content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{course.title}</h3>
                            {getStatusBadge(course.status)}
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {course.students} students
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {course.revenue}
                            </span>
                            {course.rating > 0 && (
                              <span className="flex items-center gap-1">
                                ⭐ {course.rating}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Updated {course.lastUpdated}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/instructor/courses/${course.id}`}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          {course.status === 'published' && (
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/courses/${course.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Students</CardTitle>
                  <CardDescription>
                    Track student progress and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{student.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {student.course}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 max-w-xs">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium">{student.progress}%</span>
                              </div>
                              <Progress value={student.progress} />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Enrolled {student.enrolledAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View All Students
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                  <CardDescription>
                    Student feedback on your courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{review.student}</h3>
                            <p className="text-sm text-muted-foreground">
                              {review.course}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm mb-2">{review.comment}</p>
                        <p className="text-xs text-muted-foreground">
                          {review.timestamp}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Enrollment Trends</CardTitle>
                    <CardDescription>
                      Monthly enrollment statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - Integrate with charting library
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Completion Rates</CardTitle>
                    <CardDescription>
                      Average completion by course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - Integrate with charting library
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Analytics</CardTitle>
                    <CardDescription>
                      Monthly revenue breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - Integrate with charting library
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Student Engagement</CardTitle>
                    <CardDescription>
                      Daily active students and watch time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - Integrate with charting library
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
