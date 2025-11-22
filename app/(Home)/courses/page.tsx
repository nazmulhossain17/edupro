// 'use client'
// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { notFound } from 'next/navigation'

// // Temporary placeholder functions to replace lib imports
// async function getCourseById(id: string) {
//   return null // Replace with your real logic
// }

// async function getCourseReviews(id: string) {
//   return []
// }

// async function getCourseStats(id: string) {
//   return {
//     enrollmentCount: 0,
//     averageRating: 0,
//     reviewCount: 0,
//   }
// }

// async function getCourseDuration(id: string) {
//   return 0
// }

// export default async function CoursePage({ params }: { params: { id: string } }) {
//   const course = await getCourseById(params.id)

//   if (!course) {
//     notFound()
//   }

//   const [courseReviews, stats, duration] = await Promise.all([
//     getCourseReviews(params.id),
//     getCourseStats(params.id),
//     getCourseDuration(params.id)
//   ])

//   const courseWithStats = {
//     ...course,
//     enrollmentCount: stats.enrollmentCount,
//     averageRating: stats.averageRating.toFixed(1),
//     reviewCount: stats.reviewCount,
//     durationMinutes: duration
//   }

//   return (
//     <div className="min-h-screen">
//       <main>
//         <CourseHero course={courseWithStats} instructor={course.instructor} />
        
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
//             <div className="space-y-12">
//               <CourseContent course={courseWithStats} />
//               <InstructorCard instructor={course.instructor} />
//               <CourseReviews 
//                 reviews={courseReviews} 
//                 courseRating={parseFloat(courseWithStats.averageRating)} 
//                 reviewCount={stats.reviewCount} 
//               />
//             </div>

//             {/* Sidebar */}
//             <aside className="lg:sticky lg:top-24 h-fit">
//               <Card className="overflow-hidden p-6">
//                 <div className="space-y-6">
//                   <div>
//                     <div className="text-3xl font-bold text-foreground">
//                       ${course.discountPrice || course.price}
//                     </div>
//                     {course.discountPrice && course.discountPrice !== course.price && (
//                       <div className="text-lg text-muted-foreground line-through">
//                         ${course.price}
//                       </div>
//                     )}
//                   </div>

//                   <Button size="lg" className="w-full">
//                     Enroll Now
//                   </Button>
//                   <Button size="lg" variant="outline" className="w-full">
//                     Add to Wishlist
//                   </Button>

//                   <div className="space-y-3 border-t border-border pt-4 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Duration</span>
//                       <span className="font-medium">{Math.floor(duration / 60)} hours</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Level</span>
//                       <span className="font-medium capitalize">{course.level}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Students</span>
//                       <span className="font-medium">{stats.enrollmentCount.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Language</span>
//                       <span className="font-medium">{course.language}</span>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             </aside>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }
