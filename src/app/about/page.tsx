import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Users, Award, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                About EduPro Learn
              </h1>
              <p className="text-xl text-muted-foreground">
                Empowering learners worldwide with industry-relevant IT education and verifiable certifications
              </p>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="max-w-3xl mx-auto space-y-6 text-lg">
              <p>
                EduPro Learn is a modern, cloud-based e-learning platform designed to deliver 
                industry-relevant IT courses with verifiable digital certificates. Our mission is 
                to make quality IT education accessible to everyone, anywhere, at any time.
              </p>
              <p>
                We serve both academic learners and working professionals seeking to upgrade their 
                skills in Cybersecurity, Data Science, Artificial Intelligence, Networking, Programming, 
                and Digital Technologies.
              </p>
              <p>
                With our platform, you can learn at your own pace, earn industry-recognized certificates, 
                and advance your career with in-demand IT skills.
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Core Values
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Quality Education</CardTitle>
                  <CardDescription>
                    Industry-relevant courses designed by experts
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Accessibility</CardTitle>
                  <CardDescription>
                    24/7 access from anywhere in the world
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Certification</CardTitle>
                  <CardDescription>
                    Verifiable certificates with QR validation
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-primary mb-4" />
                  <CardTitle>Career Growth</CardTitle>
                  <CardDescription>
                    Skills that advance your professional journey
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-primary text-primary-foreground">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl mb-4">
                    Ready to Start Your Learning Journey?
                  </CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-lg">
                    Join thousands of students already learning on EduPro Learn
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pb-8">
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="/courses">Browse Courses</Link>
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
