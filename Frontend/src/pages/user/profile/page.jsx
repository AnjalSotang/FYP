import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from '@/components/ui/checkbox';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  Bell,
  ChevronLeft,
  Dumbbell,
  Globe,
  Lock,
  LogOut,
  Save,
  Settings,
  Smartphone,
  Trophy,
  Upload,
  User,
  Cog
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useDispatch, useSelector } from "react-redux"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { fetchProfile, setStatus, updateProfile } from "../../../../store/authSlice"
import STATUSES from "../../../globals/status/statuses"
import AvatarUpload from './components/avatarUpload';
import ChangePassword from "./components/changePassword";
import ConnectionApps from "./components/connectionApps";
import Achievements from "./components/achievements";
import Notifications from "./components/notifications";
import RootLayout from '../../../components/layout/UserLayout';


export default function ProfilePage() {
  const { data, status } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    gender: "",
    bio: "",
    height: "",
    weight: "",
    age: "",
    fitnessLevel: "",
    fitnessGoals: [],
  })

  useEffect(() => {
    // If we don't have workouts data yet or need to refresh, fetch it
    dispatch(fetchProfile())
  }, [dispatch])

  // Initialize userData from fetched data when it becomes available
  useEffect(() => {
    if (data) {
      setUserData({
        name: data.firstName || "",
        email: data.email || "",
        username: data.username || "",
        gender: data.gender || "",
        bio: data.bio || "",
        height: data.heightFeet || "",
        weight: data.weight || "",
        age: data.age || "",
        fitnessLevel: data.fitnessLevel || "",
        fitnessGoals: data.fitnessGoals || [],
        profileVisibility: data.profileVisibility || ""
      })
    }
  }, [data])

  // 🔥 Handle Status Updates
  useEffect(() => {
    if (status?.status === STATUSES.SUCCESS) {
      toast.success(status.message)
      dispatch(setStatus(null))
    } else if (status?.status === STATUSES.ERROR) {
      toast.error(status.message)
    }
  }, [status, dispatch])

  

  const handleSaveProfile = (e) => {
    e.preventDefault();
    dispatch(updateProfile(userData));
    console.log(userData)
  }
  const handleGoalToggle = (goal) => {
    setUserData(prev => {
      const currentGoals = [...prev.fitnessGoals];
      if (currentGoals.includes(goal)) {
        return { ...prev, fitnessGoals: currentGoals.filter(g => g !== goal) };
      } else {
        return { ...prev, fitnessGoals: [...currentGoals, goal] };
      }
    });
  };

  const fitnessGoalOptions = [
    "Weight Loss",
    "Muscle Gain",
    "Endurance",
    "Flexibility",
    "General Fitness"
  ];

  const fitnessLevelOptions = [
    "Beginner",
    "Intermediate",
    "Advanced"
  ];

  return (
<RootLayout>
<div className="container mx-auto py-9 px-12">
<ToastContainer position="top-right" autoClose={3000} aria-live="assertive" />
      <Link to="/" className="flex items-center text-gray-300 hover:text-white mb-6">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to home
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-white">Profile Settings</h1>
          <p className="text-gray-300">Manage your account and preferences</p>
        </div>

        <Button className="bg-lime-400 hover:bg-lime-500 text-navy-900 gap-2" onClick={handleSaveProfile}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1 bg-navy-800 border-navy-700 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative mb-4">

                <AvatarUpload userData={userData} />


              </div>
              <h2 className="text-xl font-bold text-white">{userData.name}</h2>
              <p className="text-gray-300 text-sm">@{userData.username}</p>
              <Badge className="mt-2 bg-navy-700 text-lime-400">
                {userData.fitnessLevel &&
                  userData.fitnessLevel.charAt(0).toUpperCase() + userData.fitnessLevel.slice(1)}
              </Badge>
            </div>

            <nav className="space-y-1">
              <Link
                to="#personal-info"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-700 transition-colors text-gray-300 hover:text-white"
              >
                <User className="h-5 w-5 text-lime-400" />
                <span>Personal Information</span>
              </Link>
              <Link
                to="#fitness-profile"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-700 transition-colors text-gray-300 hover:text-white"
              >
                <Dumbbell className="h-5 w-5 text-lime-400" />
                <span>Fitness Profile</span>
              </Link>
              <Link
                to="#achievements"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-700 transition-colors text-gray-300 hover:text-white"
              >
                <Trophy className="h-5 w-5 text-lime-400" />
                <span>Achievements</span>
              </Link>
              <Link
                to="#notifications"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-700 transition-colors text-gray-300 hover:text-white"
              >
                <Bell className="h-5 w-5 text-lime-400" />
                <span>Notifications</span>
              </Link>
              <Link
                to="#privacy"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-700 transition-colors text-gray-300 hover:text-white"
              >
                <Lock className="h-5 w-5 text-lime-400" />
                <span>Privacy</span>
              </Link>
              <Link
                to="#connected-apps"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-700 transition-colors text-gray-300 hover:text-white"
              >
                <Smartphone className="h-5 w-5 text-lime-400" />
                <span>Connected Apps</span>
              </Link>
              <Link
                to="#account"
                className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-navy-700 transition-colors text-gray-300 hover:text-white"
              >
                <Settings className="h-5 w-5 text-lime-400" />
                <span>Account Settings</span>
              </Link>
            </nav>

            <Separator className="my-6 bg-navy-700" />

            <Button variant="destructive" className="w-full gap-2 bg-red-600 hover:bg-red-700">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-8">
          <Card id="personal-info" className="bg-navy-800 border-navy-700 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5 text-lime-400" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-300">Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lime-400">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lime-400">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  // className="bg-navy-700 border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-lime-400">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={userData.username}
                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  // className="bg-navy-700 border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-lime-400">
                    Gender
                  </Label>
                  <Select value={userData.gender} onValueChange={(value) => setUserData({ ...userData, gender: value })}>
                    <SelectTrigger id="gender" className="bg-navy-700 border-navy-700 text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-navy-700 border-navy-700 text-white">
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      {/* <SelectItem value="other">Prefer not to say</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-lime-400">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card id="fitness-profile" className="bg-navy-800 border-navy-700 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Dumbbell className="h-5 w-5 text-lime-400" />
                Fitness Profile
              </CardTitle>
              <CardDescription className="text-gray-300">Update your fitness details and goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-lime-400">
                    Height (feet)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={userData.height}
                    onChange={(e) => setUserData({ ...userData, heightFeet: e.target.value })}
                  // className="bg-navy-700 border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-lime-400">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={userData.weight}
                    onChange={(e) => setUserData({ ...userData, weight: e.target.value })}
                  // className="bg-navy-700 border-navy-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-lime-400">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={userData.age}
                    onChange={(e) => setUserData({ ...userData, age: e.target.value })}
                  // className="bg-navy-700 border-navy-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fitness-level" className="text-lime-400">
                  Fitness Level
                </Label>
                <Select value={userData.fitnessLevel} onValueChange={(value) => setUserData({ ...userData, fitnessLevel: value })}>
                  <SelectTrigger id="fitness-level" className="bg-navy-700 border-navy-700 text-white">
                    <SelectValue placeholder="Select fitness level" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-700 border-navy-600 text-white">
                    {fitnessLevelOptions.map(level => (
                      <SelectItem
                        key={level}
                        value={level.toLowerCase()}
                        className="text-white hover:bg-navy-600"
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Fitness Goals Section */}
              <div className="space-y-10">
                <Label className="text-lime-400">Fitness Goals</Label>
                <div className="flex flex-wrap gap-8">
                  {fitnessGoalOptions.map(goal => (
                    <div key={goal} className="flex items-center space-x-2">
                      <Checkbox
                        id={`goal-${goal.toLowerCase().replace(' ', '-')}`}
                        checked={userData.fitnessGoals.includes(goal)}
                        onCheckedChange={() => handleGoalToggle(goal)}
                        className="bg-navy-700 border-lime-400 data-[state=checked]:bg-lime-400"
                      />
                      <Label
                        htmlFor={`goal-${goal.toLowerCase().replace(' ', '-')}`}
                        className="text-white cursor-pointer"
                      >
                        {goal}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Achievements/>

          <Notifications/>

          <Card id="privacy" className="bg-navy-800 border-navy-700 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lock className="h-5 w-5 text-lime-400" />
                Privacy Settings
              </CardTitle>
              <CardDescription className="text-gray-300">Control your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profile-visibility" className="text-lime-400">
                  Profile Visibility
                </Label>
                <Select
                  value={userData.profileVisibility}
                  onValueChange={(value) => setUserData({ ...userData, profileVisibility: value })}
                >
                  <SelectTrigger id="profile-visibility" className="bg-navy-700 border-navy-700 text-white">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent className="bg-navy-700 border-navy-700 text-white">
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-lime-400" />
                        <span>Public - Anyone can view your profile</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="friends">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-lime-400" />
                        <span>Friends Only - Only friends can view your profile</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-lime-400" />
                        <span>Private - Only you can view your profile</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert className="bg-navy-700 border-navy-700 text-gray-300">
                <AlertCircle className="h-4 w-4 text-lime-400" />
                <AlertTitle className="text-white">Privacy Notice</AlertTitle>
                <AlertDescription>
                  Your workout data is used to provide personalized recommendations. We never share your personal
                  information with third parties without your consent.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
          
          <ConnectionApps/>
          <ChangePassword/>
        </div>
      </div>
    </div>
    </RootLayout>
  )
}