import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Cog, Eye, EyeOff } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { changeProfilePassword, deleteAccount } from "../../../../../store/authSlice" // Adjust this path to match your project structure
import { Alert, AlertDescription } from "@/components/ui/alert"
import STATUSES from "../../../../globals/status/statuses" // Adjust path as needed

const ChangePassword = () => {
  const dispatch = useDispatch()
  const { status } = useSelector((state) => state.auth)
  
  const isLoading = status === STATUSES.LOADING
  const isSuccess = status?.status === STATUSES.SUCCESS
  const isError = status?.status === STATUSES.ERROR
  const errorMessage = status?.message
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [formErrors, setFormErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [showSuccess, setShowSuccess] = useState(false)
  
  // State to control password visibility
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  // Show success message when status changes to success
  useEffect(() => {
    if (isSuccess) {
      setShowSuccess(true)
      
      // Reset form after successful update
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }
  }, [isSuccess])

  const handleChange = (e) => {
    const { id, value } = e.target
    
    // Map the input IDs directly to state properties
    const fieldMapping = {
      'current-password': 'currentPassword',
      'new-password': 'newPassword',
      'confirm-password': 'confirmPassword'
    }
    
    // Use the mapping to get the correct field name
    const fieldName = fieldMapping[id] || id
    
    setFormData({ ...formData, [fieldName]: value })
    
    // Clear errors when user types
    if (formErrors[fieldName]) {
      setFormErrors({ ...formErrors, [fieldName]: "" })
    }
  }
  
  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field]
    })
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...formErrors }

    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
      isValid = false
    }

    // Validate new password
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
      isValid = false
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
      isValid = false
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
      isValid = false
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setFormErrors(newErrors)
    return isValid
  }

  const handleUpdatePassword = async () => {
    if (!validateForm()) return

    // Prepare data for API - match the structure expected by your API
    const passwordData = {
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword
    }

    // Dispatch to your existing action
    dispatch(changeProfilePassword(passwordData))
  }

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // You can add delete account action here
      dispatch(deleteAccount())
    }
  }

  return ( 
    <Card id="account" >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 ">
          <Cog className="h-5 w-5 text-lime-400" />
          Account Settings
        </CardTitle>
        <CardDescription>Manage your account settings and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password" className="text-lime-400">
            Change Password
          </Label>
          
          {showSuccess && (
            <Alert className="bg-green-100 border-green-400 text-green-800 mb-4">
              <AlertDescription>Password updated successfully!</AlertDescription>
            </Alert>
          )}
          
          {isError && (
            <Alert className="bg-red-100 border-red-400 text-red-800 mb-4">
              <AlertDescription>{errorMessage || "Failed to update password"}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-4 mb-2">
              {/* Current Password Field with Toggle */}
              <div className="relative">
                <Input
                  id="current-password"
                  type={passwordVisibility.currentPassword ? "text" : "password"}
                  placeholder="Current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                >
                  {passwordVisibility.currentPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
                {formErrors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.currentPassword}</p>
                )}
              </div>
              
              {/* New Password Field with Toggle */}
              <div className="relative">
                <Input
                  id="new-password"
                  type={passwordVisibility.newPassword ? "text" : "password"}
                  placeholder="New password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility('newPassword')}
                >
                  {passwordVisibility.newPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
                {formErrors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>
                )}
              </div>
              
              {/* Confirm Password Field with Toggle */}
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={passwordVisibility.confirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {passwordVisibility.confirmPassword ? 
                    <EyeOff className="h-5 w-5" /> : 
                    <Eye className="h-5 w-5" />
                  }
                </button>
                {formErrors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
       
          <Button 
            className="mt-10 bg-lime-400 hover:bg-lime-500 text-navy-900" 
            onClick={handleUpdatePassword}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>

        <Separator className="bg-navy-700 mr-8"/>

        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Danger Zone</h3>
          <p className="text-sm text-gray-300 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChangePassword;