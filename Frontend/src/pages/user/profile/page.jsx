import React, { useRef } from "react"
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from "react"
import { fetchProfile, setData, setStatus } from '../../../../store/authSlice';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Dumbbell, LogOut, User, Edit, Save } from "lucide-react"
import API from '../../../../src/http';
import STATUSES from '../../../../src/globals/status/statuses';


export default function ProfilePage() {

  // Mock user data
  // const [userData, setUserData] = useState({
  //   // name: "Jane Smith",
  //   // email: "jane.smith@example.com",
  //   // height: "5'7\"",
  //   // weight: "145 lbs",
  //   // goals: "Build strength and improve overall fitness",
  //   notifications: true
  // })

  // Mock workout history
  const workoutHistory = [
    {
      id: 1,
      name: "Full Body Workout",
      date: "Mar 20, 2025",
      duration: "60 min",
      calories: "450",
    },
    {
      id: 2,
      name: "Morning Cardio",
      date: "Mar 18, 2025",
      duration: "30 min",
      calories: "320",
    },
    {
      id: 3,
      name: "Core Strength",
      date: "Mar 17, 2025",
      duration: "45 min",
      calories: "380",
    },
    {
      id: 4,
      name: "Leg Day",
      date: "Mar 15, 2025",
      duration: "60 min",
      calories: "520",
    },
    {
      id: 5,
      name: "Upper Body Focus",
      date: "Mar 13, 2025",
      duration: "50 min",
      calories: "410",
    },
  ]

  // Mock achievements
  const achievements = [
    {
      id: 1,
      name: "First Workout",
      description: "Completed your first workout",
      date: "Jan 15, 2025",
      icon: <Dumbbell className="h-4 w-4" />,
    },
    {
      id: 2,
      name: "Workout Streak",
      description: "Completed 5 workouts in a row",
      date: "Feb 10, 2025",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      id: 3,
      name: "Calorie Burner",
      description: "Burned over 1,000 calories in a week",
      date: "Mar 5, 2025",
      icon: <Clock className="h-4 w-4" />,
    },
  ]


  const dispatch = useDispatch();
  const profileData = useSelector((state) => state.auth.data);
  const status = useSelector((state) => state.auth.status);
  const [localProfile, setLocalProfile] = useState(null);

  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef(null);


  useEffect(() => {
    // Fetch profile data when component mounts
    dispatch(fetchProfile());
  }, [dispatch]);


  useEffect(() => {
    // Fetch profile data when component mounts
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    // When profile data is loaded, set it to local state for editing
    if (profileData) {
      setLocalProfile({ ...profileData });
    }
  }, [profileData]);

  if (status === STATUSES.LOADING || !localProfile) {
    return <div className="flex justify-center items-center h-screen text-white">Loading profile...</div>;
  }

  if (status === STATUSES.ERROR) {
    return <div className="flex justify-center items-center h-screen text-red-500">{status.message}</div>;
  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create FormData and append file
    const formData = new FormData();
    formData.append('photo', file);

    try {
      // Call your API endpoint to upload the photo
      const response = await fetch('/api/users/profile-photo', {
        method: 'POST',
        body: formData,
        credentials: 'include', // For cookies if you're using session auth
      });

      if (response.ok) {
        const data = await response.json();
        // Update local state with new photo URL
        setLocalProfile(prev => ({ ...prev, photoUrl: data.photoUrl }));
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleSaveProfile = async () => {
    // Dispatch action to save profile changes
    await dispatch(updateProfile(localProfile));
    setIsEditing(false);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <Button variant="outline" onClick={() => console.log("Logout clicked")}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="history">Workout History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>






        <TabsContent value="profile" className="space-y-4">



          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (isEditing ? handleSaveProfile() : setIsEditing(true))}
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" alt={localProfile.username} />
                    <AvatarFallback>
                      <User className="h-12 w-12" />
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <>
                      <Button variant="outline" size="sm" onClick={handlePhotoClick}>
                        Change Photo
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  )}
                </div>



                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          name="username"
                          value={localProfile.username || ''}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{localProfile.username}</div>
                      )}
                    </div>



                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={localProfile.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{localProfile.email}</div>
                      )}
                    </div>




                    <div className="space-y-2">
                      <Label htmlFor="height">Height</Label>
                      {isEditing ? (
                        <Input
                          id="heightFeet"
                          name="heightFeet"
                          value={localProfile.heightFeet || ''}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{localProfile.heightFeet}</div>
                      )}
                    </div>


                    <div className="space-y-2">
                      <Label htmlFor="heightInches">Height Inches</Label>
                      {isEditing ? (
                        <Input
                          id="heightInches"
                          name="heightInches"
                          value={localProfile.heightInches || ''}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{localProfile.heightInches}</div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      {isEditing ? (
                        <Input
                          id="weight"
                          name="weight"
                          value={localProfile.weight || ''}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className="p-2 border rounded-md">{localProfile.weight}</div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="goals">Fitness Goals</Label>
                    {isEditing ? (
                      <Textarea
                        id="fitnessGoal"
                        name="fitnessGoal"
                        value={localProfile.fitnessGoal || ''}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    ) : (
                      <div className="p-2 border rounded-md min-h-[80px]">{localProfile.fitnessGoal}</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>








          <Card>
            <CardHeader>
              <CardTitle>Fitness Summary</CardTitle>
              <CardDescription>Your fitness journey at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Total Workouts</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">12,450</div>
                  <div className="text-sm text-muted-foreground">Calories Burned</div>
                </div>
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold">840</div>
                  <div className="text-sm text-muted-foreground">Active Minutes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Your completed workouts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workoutHistory.map((workout) => (
                  <div key={workout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Dumbbell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{workout.name}</h4>
                        <div className="text-sm text-muted-foreground">{workout.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">{workout.duration}</div>
                      <div className="text-sm text-muted-foreground">{workout.calories} cal</div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Milestones you've reached in your fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex flex-col items-center p-6 border rounded-lg text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      {achievement.icon}
                    </div>
                    <h4 className="font-medium">{achievement.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    <Badge variant="outline" className="mt-4">
                      {achievement.date}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Change Password</Label>
                <div className="flex space-x-2">
                  <Input id="password" type="password" placeholder="New password" />
                  <Button>Update</Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Email Notifications</Label>
                  <div className="flex items-center space-x-2">
                    {/* <Button variant={userData.notifications ? "default" : "outline"} size="sm">
                      On
                    </Button>
                    <Button variant={!userData.notifications ? "default" : "outline"} size="sm">
                      Off
                    </Button> */}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for workout reminders and achievements
                </p>
              </div>
              <div className="pt-4 border-t">
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

