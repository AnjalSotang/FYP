import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bell,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

const notifications = () => {
      // Notification settings
      const [notifications, setNotifications] = useState({
        workoutReminders: true,
        achievementAlerts: true,
        newFeaturesUpdates: true,
        emailDigest: false,
        pushNotifications: true,
      })
    return(
        <Card id="notifications" className="bg-navy-800 border-navy-700 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="h-5 w-5 text-lime-400" />
            Notification Preferences
          </CardTitle>
          <CardDescription className="text-gray-300">Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="workout-reminders" className="text-white">
                  Workout Reminders
                </Label>
                <p className="text-sm text-gray-300">Receive reminders for scheduled workouts</p>
              </div>
              <Switch
                id="workout-reminders"
                checked={notifications.workoutReminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, workoutReminders: checked })}
                className="data-[state=checked]:bg-lime-400 data-[state=checked]:text-navy-900"
              />
            </div>

            <Separator className="bg-navy-700" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="achievement-alerts" className="text-white">
                  Achievement Alerts
                </Label>
                <p className="text-sm text-gray-300">Get notified when you earn achievements</p>
              </div>
              <Switch
                id="achievement-alerts"
                checked={notifications.achievementAlerts}
                onCheckedChange={(checked) => setNotifications({ ...notifications, achievementAlerts: checked })}
                className="data-[state=checked]:bg-lime-400 data-[state=checked]:text-navy-900"
              />
            </div>

            <Separator className="bg-navy-700" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="new-features" className="text-white">
                  New Features & Updates
                </Label>
                <p className="text-sm text-gray-300">Learn about new features and app updates</p>
              </div>
              <Switch
                id="new-features"
                checked={notifications.newFeaturesUpdates}
                onCheckedChange={(checked) => setNotifications({ ...notifications, newFeaturesUpdates: checked })}
                className="data-[state=checked]:bg-lime-400 data-[state=checked]:text-navy-900"
              />
            </div>

            <Separator className="bg-navy-700" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-digest" className="text-white">
                  Weekly Email Digest
                </Label>
                <p className="text-sm text-gray-300">Receive a weekly summary of your progress</p>
              </div>
              <Switch
                id="email-digest"
                checked={notifications.emailDigest}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailDigest: checked })}
                className="data-[state=checked]:bg-lime-400 data-[state=checked]:text-navy-900"
              />
            </div>

            <Separator className="bg-navy-700" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="text-white">
                  Push Notifications
                </Label>
                <p className="text-sm text-gray-300">Enable push notifications on your device</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                className="data-[state=checked]:bg-lime-400 data-[state=checked]:text-navy-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
}

export default notifications;