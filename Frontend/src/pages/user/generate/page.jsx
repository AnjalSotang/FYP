import { useState } from "react"
import { Link } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Loader2 } from "lucide-react"
import { GeneratedWorkout } from "./components/generate-workout"
import RootLayout from "../../../components/layout/UserLayout";

export default function GenerateWorkoutPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [workoutGenerated, setWorkoutGenerated] = useState(false)
  const [generatedWorkout, setGeneratedWorkout] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    goal: "",
    experience: "",
    days: 3,
    duration: 45,
    equipment: "full",
    focus: [],
    additionalInfo: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerateWorkout = async () => {
    // Validate form data
    if (!formData.goal) {
      toast.error("Please select your fitness goal", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      return
    }

    if (!formData.experience) {
      toast.error("Please select your experience level", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      return
    }

    setLoading(true)

    // API call commented out for now, but we'll simulate success
    // setTimeout(() => {
    //   setGeneratedWorkout({ 
     
    //   })
    //   setWorkoutGenerated(true)
    //   setLoading(false)
    //   toast.success("Your workout plan has been generated!", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true
    //   })
    // }, 2000)
    
    // Uncomment this section when API is ready
    try {
      // Call the AI workout generation API
      const response = await fetch("http://localhost:3001/api/generate-workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate workout plan")
      }

      const data = await response.json()
      setGeneratedWorkout(data)
      setWorkoutGenerated(true)
      toast.success("Your workout plan has been generated!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    } catch (error) {
      console.error("Error generating workout:", error)
      toast.error("Failed to generate workout plan. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
      setGeneratedWorkout(null)
    } finally {
      setLoading(false)
    }
  }

  if (workoutGenerated) {
    return (
      <GeneratedWorkout formData={formData} workoutData={generatedWorkout} onReset={() => setWorkoutGenerated(false)} />
    )
  }

  return (
    <RootLayout>
  <div className="container mx-auto py-9 px-12">
      <ToastContainer />
      <Link to="/user" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to home
      </Link>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">AI Workout Generator</h1>
        <p className="text-muted-foreground mb-8">
          Answer a few questions and our AI will create a personalized workout plan just for you.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Custom Workout Plan</CardTitle>
            <CardDescription>
              Step {step} of 3:{" "}
              {step === 1 ? "Basic Information" : step === 2 ? "Workout Details" : "Additional Preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="goal">What's your primary fitness goal?</Label>
                  <Select value={formData.goal} onValueChange={(value) => handleInputChange("goal", value)}>
                    <SelectTrigger id="goal">
                      <SelectValue placeholder="Select your goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lose-weight">Lose Weight</SelectItem>
                      <SelectItem value="build-muscle">Build Muscle</SelectItem>
                      <SelectItem value="increase-strength">Increase Strength</SelectItem>
                      <SelectItem value="improve-endurance">Improve Endurance</SelectItem>
                      <SelectItem value="general-fitness">General Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">What's your fitness experience level?</Label>
                  <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-6 months)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (6 months - 2 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (2+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="days">How many days per week can you workout?</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="days"
                      min={1}
                      max={7}
                      step={1}
                      value={[formData.days]}
                      onValueChange={(value) => handleInputChange("days", value[0])}
                      className="flex-1"
                    />
                    <span className="font-medium w-8 text-center">{formData.days}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button onClick={() => {
                    setStep(2)
                    toast.info("Step 1 completed", {
                      position: "top-right",
                      autoClose: 1000,
                      hideProgressBar: true
                    })
                  }}>Next Step</Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">How long can you workout per session? (minutes)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="duration"
                      min={15}
                      max={120}
                      step={5}
                      value={[formData.duration]}
                      onValueChange={(value) => handleInputChange("duration", value[0])}
                      className="flex-1"
                    />
                    <span className="font-medium w-12 text-center">{formData.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment">What equipment do you have access to?</Label>
                  <Select value={formData.equipment} onValueChange={(value) => handleInputChange("equipment", value)}>
                    <SelectTrigger id="equipment">
                      <SelectValue placeholder="Select equipment access" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Equipment (Bodyweight Only)</SelectItem>
                      <SelectItem value="minimal">Minimal (Dumbbells, Resistance Bands)</SelectItem>
                      <SelectItem value="home">Home Gym (Basic Equipment)</SelectItem>
                      <SelectItem value="full">Full Gym Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Which muscle groups would you like to focus on?</Label>
                  <Tabs
                    defaultValue="all"
                    onValueChange={(value) => handleInputChange("focus", value === "all" ? [] : [value])}
                  >
                    <TabsList className="grid grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="upper">Upper Body</TabsTrigger>
                      <TabsTrigger value="lower">Lower Body</TabsTrigger>
                      <TabsTrigger value="core">Core</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Previous
                  </Button>
                  <Button onClick={() => {
                    setStep(3)
                    toast.info("Step 2 completed", {
                      position: "top-right",
                      autoClose: 1000,
                      hideProgressBar: true
                    })
                  }}>Next Step</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Any additional information or preferences?</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="E.g., injuries, specific exercises you enjoy or want to avoid, etc."
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Previous
                  </Button>
                  <Button onClick={handleGenerateWorkout} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Workout Plan"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </RootLayout>
  
  )
}