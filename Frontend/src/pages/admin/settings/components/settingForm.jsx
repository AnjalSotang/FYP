import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { fetchSetting, updateSetting, createSetting, updateUserSetting, updateMaintainanceMode, setStatus } from "../../../../../store/settingSlice"
// import STATUSES from "../../../../globals/status/statuses"
import { useDispatch, useSelector } from "react-redux"
import { Loader2 } from "lucide-react"

// Define validation schemas for each form
const generalFormSchema = z.object({
  platformName: z.string()
    .min(2, { message: "Platform name must be at least 2 characters" })
    .max(50, { message: "Platform name must be less than 50 characters" }),
  supportEmail: z.string()
    .email({ message: "Please enter a valid email address" }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be less than 500 characters" }),
});

const userFormSchema = z.object({
  allowRegistrations: z.boolean(),
  defaultUserRole: z.enum(["admin", "user"], {
    required_error: "Please select a user role",
  }),

});

const systemFormSchema = z.object({
  maintenanceMode: z.boolean(),
});

export default function SettingsForm() {
  const dispatch = useDispatch();
  const { data: settings, status } = useSelector((state) => state.setting);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [isGeneralLoading, setIsGeneralLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [isSystemLoading, setIsSystemLoading] = useState(false);

  console.log(settings)
  console.log(status)
  // console.log(status.status)

  // Default values for all forms
  const defaultValues = {
    platformName: "FitTrack",
    supportEmail: "support@fittrack.com",
    description: "A fitness tracking platform for workout enthusiasts.",
    allowRegistrations: true,
    defaultUserRole: "user",
    maintenanceMode: false,
  }

  // Create separate form instances
  const generalForm = useForm({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      platformName: defaultValues.platformName,
      supportEmail: defaultValues.supportEmail,
      description: defaultValues.description,
    },
    mode: "onBlur",
  });

  const userForm = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      allowRegistrations: defaultValues.allowRegistrations,
      defaultUserRole: defaultValues.defaultUserRole,
    },
    mode: "onBlur",
  });

  const systemForm = useForm({
    resolver: zodResolver(systemFormSchema),
    defaultValues: {
      maintenanceMode: defaultValues.maintenanceMode,
    },
    mode: "onBlur",
  });

  // Fetch settings when component mounts
  useEffect(() => {
    dispatch(fetchSetting());
    setInitialFetchDone(true);
  }, [dispatch]);

  // Update forms when settings are loaded from API
  useEffect(() => {
    // Only process if the initial fetch is complete
    if (!initialFetchDone) return;

    if (settings) {
      // Existing settings found - populate the forms
      console.log(settings);

      generalForm.reset({
        platformName: settings.platformName || defaultValues.platformName,
        supportEmail: settings.supportEmail || defaultValues.supportEmail,
        description: settings.description || defaultValues.description,
      });

      userForm.reset({
        allowRegistrations: settings.allowRegistrations ?? defaultValues.allowRegistrations,
        defaultUserRole: settings.defaultUserRole || defaultValues.defaultUserRole,
        workoutApproval: settings.workoutApproval ?? defaultValues.workoutApproval,
      });

      systemForm.reset({
        maintenanceMode: settings.maintenanceMode ?? defaultValues.maintenanceMode,
      });
    } else {
      // No settings found - use defaults
      console.log("No settings found, using defaults");
      generalForm.reset({
        platformName: defaultValues.platformName,
        supportEmail: defaultValues.supportEmail,
        description: defaultValues.description,
      });

      userForm.reset({
        allowRegistrations: defaultValues.allowRegistrations,
        defaultUserRole: defaultValues.defaultUserRole,
        workoutApproval: defaultValues.workoutApproval,
      });

      systemForm.reset({
        maintenanceMode: defaultValues.maintenanceMode,
      });
    }
  }, [settings, initialFetchDone]);

  // Submit handler for general form
  async function onSubmitGeneral(data) {
    setIsGeneralLoading(true);
    try {
      const completeData = {
        ...data,
        id: settings ? settings.id : undefined
      };
  
      let response;
      if (settings) {
        response = await dispatch(updateSetting(completeData));
      } else {
        response = await dispatch(createSetting(completeData));
      }

    } 
    catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update general settings");
    } 
    finally {
      setIsGeneralLoading(false);
    }
  }


  async function onSubmitUser(data) {
    setIsUserLoading(true);
    try {
      // Get current values from other forms to include in the update


      const completeData = {

        ...data,

      };

      console.log(completeData)


      if (settings) {
       const response = await dispatch(updateUserSetting(completeData));
           // Add direct toast for debugging
      // toast.success("General settings form submitted");
     
    }
   } catch (error) {
    console.error("Error updating settings:", error);
    toast.error("Failed to update general settings");
    } finally {
      setIsUserLoading(false);
    }
  }



  async function onSubmitSystem(data) {
    setIsSystemLoading(true);
    try {

      const completeData = {
        ...data
      };

      console.log(completeData)

      console.log(completeData)
      if (settings) {
        await dispatch(updateMaintainanceMode(completeData));
          // Assuming the dispatch returns or updates a status object with the response
              // Add direct toast for debugging
        // toast.success("System settings form submitted");
      }
    } catch (error) {
      toast.error("Failed to update general settings");
    } finally {
      setIsSystemLoading(false);
    }
  }


  function onError(errors) {
    console.error("Form errors:", errors);
    toast.error("Please fix the errors in the form before submitting.");

  }


  // Make sure we're properly handling Redux status changes
  useEffect(() => {
    if (status?.status === "success") {
      console.log("Success status detected:", status.message);
      toast.success(status.message);
      dispatch(setStatus(null));
    }
    else if (status?.status === "error") {
      console.log("Error status detected:", status.message);
      toast.error(status.message);
      dispatch(setStatus(null));
    }
  }, [status, dispatch]);

  // Show loading state if initial fetch is not complete
  if (!initialFetchDone) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }


  return (
    <div className="space-y-6">
  {/* Make sure ToastContainer is at the top level with correct z-index */}
  
      <Card>
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
    
      />
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            {settings
              ? "Configure your fitness platform settings."
              : "Create initial settings for your fitness platform."}
          </CardDescription>
        </CardHeader>
        <Form {...generalForm}>
          <form onSubmit={generalForm.handleSubmit(onSubmitGeneral, onError)}>
            <CardContent className="space-y-6">
              <FormField
                control={generalForm.control}
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
                control={generalForm.control}
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
                control={generalForm.control}
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
              <Button type="submit" disabled={isGeneralLoading}>
                {isGeneralLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {settings ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  settings ? "Save General Settings" : "Create Settings"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* User */}
      <Card>
    
        <CardHeader>
          <CardTitle>User Settings</CardTitle>
          <CardDescription>Configure user-related settings for your platform.</CardDescription>
        </CardHeader>
        <Form {...userForm}>
          <form onSubmit={userForm.handleSubmit(onSubmitUser, onError)}>
            <CardContent className="space-y-6">
              <FormField
                control={userForm.control}
                name="allowRegistrations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Allow Registrations</FormLabel>
                      <FormDescription>Enable or disable new user registrations.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} {...field} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="defaultUserRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default User Role</FormLabel>
                    <Select onValueChange={field.onChange} {...field} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>

                      </SelectContent>
                    </Select>
                    <FormDescription>The default role assigned to new users.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isUserLoading}>
                {isUserLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating User Settings...
                  </>
                ) : (
                  "Save User Settings"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>


      {/*Here is the code for the system settings card*/}
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure system-wide settings for your platform.</CardDescription>
        </CardHeader>
        <Form {...systemForm}>
          <form onSubmit={systemForm.handleSubmit(onSubmitSystem, onError)}>
            <CardContent className="space-y-6">
              <FormField
                control={systemForm.control}
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
              <Button type="submit" disabled={isSystemLoading}>
                {isSystemLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating System Settings...
                  </>
                ) : (
                  "Save System Settings"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}