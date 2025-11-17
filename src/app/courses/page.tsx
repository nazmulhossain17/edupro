import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Clock, Users, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      title: 'Complete Cybersecurity Bootcamp',
      slug: 'complete-cybersecurity-bootcamp',
      description: 'Master ethical hacking, penetration testing, and security fundamentals',
      thumbnail: '/placeholder-course.jpg',
      price: 99.99,
      level: 'Intermediate',
      duration: 240,
      rating: 4.8,
      students: 1250,
      instructor: 'John Smith',
      category: 'Cybersecurity',
    },
    {
      id: 2,
      title: 'Data Science with Python',
      slug: 'data-science-with-python',
      description: 'Learn data analysis, visualization, and machine learning with Python',
      thumbnail: '/placeholder-course.jpg',
      price: 89.99,
      level: 'Beginner',
      duration: 180,
      rating: 4.9,
      students: 2100,
      instructor: 'Sarah Johnson',
      category: 'Data Science',
    },
    {
      id: 3,
      title: 'Deep Learning & Neural Networks',
      slug: 'deep-learning-neural-networks',
      description: 'Build and train neural networks using TensorFlow and PyTorch',
      thumbnail: '/placeholder-course.jpg',
      price: 119.99,
      level: 'Advanced',
      duration: 300,
      rating: 4.7,
      students: 890,
      instructor: 'Dr. Michael Chen',
      category: 'Artificial Intelligence',
    },
    {
      id: 4,
      title: 'Full Stack Web Development',
      slug: 'full-stack-web-development',
      description: 'Build modern web applications with React, Node.js, and MongoDB',
      thumbnail: '/placeholder-course.jpg',
      price: 94.99,
      level: 'Intermediate',
      duration: 220,
      rating: 4.8,
      students: 1850,
      instructor: 'Emily Davis',
      category: 'Web Development',
    },
    {
      id: 5,
      title: 'AWS Cloud Practitioner',
      slug: 'aws-cloud-practitioner',
      description: 'Master AWS services and prepare for the Cloud Practitioner certification',
      thumbnail: '/placeholder-course.jpg',
      price: 79.99,
      level: 'Beginner',
      duration: 150,
      rating: 4.6,
      students: 1420,
      instructor: 'Robert Wilson',
      category: 'Cloud Computing',
    },
    {
      id: 6,
      title: 'Network Security Fundamentals',
      slug: 'network-security-fundamentals',
      description: 'Learn network protocols, firewalls, VPNs, and security best practices',
      thumbnail: '/placeholder-course.jpg',
      price: 84.99,
      level: 'Beginner',
      duration: 160,
      rating: 4.7,
      students: 980,
      instructor: 'Lisa Anderson',
      category: 'Networking',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-12 bg-muted/50">
          <div className="container">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
              <p className="text-lg text-muted-foreground">
                Browse through our extensive collection of industry-relevant IT courses
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 border-b">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <div className="aspect-video relative bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        Course Thumbnail
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Badge variant="secondary">{course.category}</Badge>
                        <Badge variant="outline">{course.level}</Badge>
                      </div>
                      <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{Math.floor(course.duration / 60)}h</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {course.instructor}
                          </span>
                          <span className="text-2xl font-bold">
                            ${course.price}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
