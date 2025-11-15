import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Total Users', value: '15,234', icon: Users, change: '+12.5%' },
    { label: 'Total Courses', value: '342', icon: BookOpen, change: '+8.2%' },
    { label: 'Active Enrollments', value: '8,456', icon: TrendingUp, change: '+15.3%' },
    { label: 'Revenue (MTD)', value: '$45,678', icon: DollarSign, change: '+22.1%' },
  ];

  const pendingCourses = [
    {
      id: 1,
      title: 'Advanced React Patterns and Best Practices',
      instructor: 'John Smith',
      submittedAt: '2 hours ago',
      category: 'Web Development',
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals with Python',
      instructor: 'Sarah Johnson',
      submittedAt: '5 hours ago',
      category: 'Data Science',
    },
    {
      id: 3,
      title: 'Cybersecurity Essentials for Developers',
      instructor: 'Mike Chen',
      submittedAt: '1 day ago',
      category: 'Cybersecurity',
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Alice Williams',
      email: 'alice@example.com',
      role: 'student',
      joinedAt: '2 hours ago',
    },
    {
      id: 2,
      name: 'Bob Anderson',
      email: 'bob@example.com',
      role: 'instructor',
      joinedAt: '5 hours ago',
    },
    {
      id: 3,
      name: 'Carol Martinez',
      email: 'carol@example.com',
      role: 'student',
      joinedAt: '1 day ago',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'course_approved',
      description: 'Course "React Hooks Masterclass" was approved',
      timestamp: '10 minutes ago',
    },
    {
      id: 2,
      type: 'user_registered',
      description: 'New user "David Lee" registered as instructor',
      timestamp: '1 hour ago',
    },
    {
      id: 3,
      type: 'course_submitted',
      description: 'Course "Python for Data Analysis" submitted for review',
      timestamp: '2 hours ago',
    },
    {
      id: 4,
      type: 'enrollment',
      description: '50 new enrollments in the last hour',
      timestamp: '1 hour ago',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Manage courses, users, and monitor platform activity
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
                    <p className="text-xs text-green-600 mt-1">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="courses">Pending Courses</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Courses Pending Approval</CardTitle>
                  <CardDescription>
                    Review and approve or reject course submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingCourses.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{course.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>by {course.instructor}</span>
                            <Badge variant="outline">{course.category}</Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {course.submittedAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/courses/${course.id}`}>
                              Review
                            </Link>
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{user.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{user.email}</span>
                            <Badge variant={user.role === 'instructor' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                            <span>Joined {user.joinedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              View Profile
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit Role
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      View All Users
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Monitor platform activity and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        <Activity className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.timestamp}
                          </p>
                        </div>
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
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>
                      User registration trends over time
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
                    <CardTitle>Course Enrollments</CardTitle>
                    <CardDescription>
                      Enrollment trends by category
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
                    <CardTitle>Platform Activity</CardTitle>
                    <CardDescription>
                      Daily active users and engagement
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
