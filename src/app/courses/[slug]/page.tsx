import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Clock, 
  Users, 
  Globe, 
  Award,
  PlayCircle,
  FileText,
  CheckCircle,
  Target,
  BookOpen
} from 'lucide-react';

export default function CourseDetailPage() {
  const course = {
    title: 'Complete Cybersecurity Bootcamp',
    description: 'Master ethical hacking, penetration testing, and security fundamentals in this comprehensive bootcamp',
    thumbnail: '/placeholder-course.jpg',
    price: 99.99,
    level: 'Intermediate',
    duration: 240,
    rating: 4.8,
    reviewCount: 342,
    students: 1250,
    language: 'English',
    lastUpdated: 'November 2025',
    instructor: {
      name: 'John Smith',
      title: 'Cybersecurity Expert',
      avatar: '/placeholder-avatar.jpg',
      bio: '15+ years of experience in cybersecurity and ethical hacking',
      students: 5000,
      courses: 8,
    },
    learningOutcomes: [
      'Understand network security fundamentals',
      'Perform penetration testing and vulnerability assessments',
      'Master ethical hacking techniques',
      'Implement security best practices',
      'Prepare for industry certifications',
    ],
    requirements: [
      'Basic understanding of computer networks',
      'Familiarity with Linux command line',
      'No prior cybersecurity experience required',
    ],
    sections: [
      {
        title: 'Introduction to Cybersecurity',
        lessons: 8,
        duration: 45,
      },
      {
        title: 'Network Security Fundamentals',
        lessons: 12,
        duration: 90,
      },
      {
        title: 'Ethical Hacking Techniques',
        lessons: 15,
        duration: 120,
      },
      {
        title: 'Penetration Testing',
        lessons: 10,
        duration: 75,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-12 bg-muted/50">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <Badge className="mb-4">Cybersecurity</Badge>
                  <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                  <p className="text-xl text-muted-foreground mb-6">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-muted-foreground">
                        ({course.reviewCount} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.floor(course.duration / 60)} hours</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span>{course.language}</span>
                    </div>
                  </div>
                </div>

                <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle className="text-3xl">${course.price}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" size="lg">
                      Enroll Now
                    </Button>
                    <Button className="w-full" variant="outline" size="lg">
                      Add to Wishlist
                    </Button>
                    
                    <Separator />
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Level</span>
                        <span className="font-medium">{course.level}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{Math.floor(course.duration / 60)} hours</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Language</span>
                        <span className="font-medium">{course.language}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Certificate</span>
                        <span className="font-medium flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          Yes
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="instructor">Instructor</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          What You&apos;ll Learn
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {course.learningOutcomes.map((outcome, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Requirements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {course.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-muted-foreground">•</span>
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="curriculum" className="space-y-4">
                    {course.sections.map((section, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{section.title}</CardTitle>
                            <div className="text-sm text-muted-foreground">
                              {section.lessons} lessons • {section.duration}min
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="instructor">
                    <Card>
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={course.instructor.avatar} />
                            <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="mb-1">{course.instructor.name}</CardTitle>
                            <CardDescription className="mb-4">
                              {course.instructor.title}
                            </CardDescription>
                            <div className="flex gap-6 text-sm">
                              <div>
                                <div className="font-medium">{course.instructor.students.toLocaleString()}</div>
                                <div className="text-muted-foreground">Students</div>
                              </div>
                              <div>
                                <div className="font-medium">{course.instructor.courses}</div>
                                <div className="text-muted-foreground">Courses</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{course.instructor.bio}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="reviews">
                    <Card>
                      <CardHeader>
                        <CardTitle>Student Reviews</CardTitle>
                        <CardDescription>
                          See what students are saying about this course
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">Reviews will be displayed here</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Course Includes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{Math.floor(course.duration / 60)} hours video content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span>Lifetime access</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
