import React from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Define validation schema
const formSchema = z.object({
  platformName: z.string()
    .min(2, { message: "Platform name must be at least 2 characters" })
    .max(50, { message: "Platform name must be less than 50 characters" }),
  supportEmail: z.string()
    .email({ message: "Please enter a valid email address" }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
  allowRegistrations: z.boolean(),
  defaultUserRole: z.enum(["member", "premium", "trainer"], {
    required_error: "Please select a user role",
  }),
  workoutApproval: z.boolean(),
  maintenanceMode: z.boolean(),
});

export default function SettingsForm() {
  const defaultValues = {
    platformName: "FitTrack",
    supportEmail: "support@fittrack.com",
    description: "A fitness tracking platform for workout enthusiasts.",
    allowRegistrations: true,
    defaultUserRole: "member",
    workoutApproval: false,
    maintenanceMode: false,
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur", // Validate fields when they lose focus
  });

  function onSubmit(data) {
    console.log("Form data:", data);
    toast({
      title: "Settings updated",
      description: "Your platform settings have been updated successfully.",
    });
  }

  function onError(errors) {
    console.error("Form errors:", errors);
    toast({
      title: "Error",
      description: "Please fix the errors in the form before submitting.",
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure your fitness platform settings.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="platformName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name</FormLabel>
                    <FormControl>
                      <Input placeholder="FitTrack" {...field} />
                    </FormControl>
                    <FormDescription>This is the name of your fitness platform.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="supportEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Support Email</FormLabel>
                    <FormControl>
                      <Input placeholder="support@example.com" {...field} />
                    </FormControl>
                    <FormDescription>This email will be used for support inquiries.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about your fitness platform" className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>This will be displayed on your platform's about page.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>Configure user-related settings for your platform.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="allowRegistrations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Allow Registrations</FormLabel>
                      <FormDescription>Enable or disable new user registrations.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultUserRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default User Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="trainer">Trainer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The default role assigned to new users.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workoutApproval"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Require Workout Approval</FormLabel>
                      <FormDescription>Require admin approval for user-created workouts.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure system-wide settings for your platform.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="maintenanceMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Maintenance Mode</FormLabel>
                      <FormDescription>Enable maintenance mode to temporarily disable the platform.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}