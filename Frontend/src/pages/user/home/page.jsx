import {Link} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Brain, LineChart, ChevronRight, Calendar } from "lucide-react"
import { FeaturedWorkouts } from "./components/featured-workouts"
import { HeroSection } from "./components/hero-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="flex-1">
        <section className="container mx-auto py-12 px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get Started with Your Fitness Journey</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Workout Generator</CardTitle>
                <CardDescription>
                  Create a personalized workout plan based on your goals, equipment, and time constraints.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span>Tailored to your fitness level</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span>Adapts to available equipment</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span>Optimized for your schedule</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/generate" className="w-full">
                  <Button className="w-full">Generate Workout</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Predefined Plans</CardTitle>
                <CardDescription>
                  Choose from expert-designed workout plans for different goals and experience levels.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span>Strength, cardio, and flexibility</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span>Beginner to advanced options</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span>Proven effective routines</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/plans" className="w-full">
                  <Button className="w-full" variant="outline">
                    Browse Plans
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>Monitor your fitness journey with detailed tracking and analytics.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span>Log workouts and measurements</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span>Visualize your progress</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-4 w-4 mr-2 text-primary mt-0.5" />
                    <span>Set and achieve goals</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full" variant="outline">
                    View Dashboard
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Workout Plans</h2>
                <p className="text-muted-foreground">Popular plans to get you started right away</p>
              </div>
              <Link href="/plans" className="mt-4 md:mt-0">
                <Button variant="outline" className="flex items-center gap-2">
                  View All Plans
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <FeaturedWorkouts />
          </div>
        </section>

        <section className="container mx-auto py-16 px-4">
          <div className="bg-primary/5 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">Ready to start your fitness journey?</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Create your personalized workout plan today and track your progress as you achieve your fitness goals.
              </p>
              <Link href="/generate">
                <Button size="lg" className="gap-2">
                  <Calendar className="h-5 w-5" />
                  Create Your Plan
                </Button>
              </Link>
            </div>
            <div className="w-full md:w-1/3">
              <img
                src="/placeholder.svg?height=300&width=400"
                alt="Fitness journey"
                className="rounded-lg w-full h-auto shadow-lg"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

