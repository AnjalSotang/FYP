import {Link} from "react-router-dom"
import HeroImage from "../../../../assets/images/h.png";
import { Button } from "@/components/ui/button"
import { Dumbbell, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Your Personal <span className="text-primary">Fitness Journey</span> Starts Here
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-md">
              Create custom workout plans, choose from expert routines, and track your progress all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/generate">
                <Button size="lg" className="gap-2">
                  <Zap className="h-5 w-5" />
                  Generate Workout
                </Button>
              </Link>
              <Link href="/plans">
                <Button size="lg" variant="outline" className="gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Browse Plans
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full z-0"></div>
              <img
                src= {HeroImage}
                alt="Fitness workout"
                className="rounded-lg shadow-lg relative z-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { number: "500+", label: "Exercises" },
            { number: "50+", label: "Workout Plans" },
            { number: "10k+", label: "Active Users" },
            { number: "100%", label: "Satisfaction" },
          ].map((stat, index) => (
            <div key={index} className="bg-background rounded-lg p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

