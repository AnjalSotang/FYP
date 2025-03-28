import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Cog } from "lucide-react"
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
    const fieldName = id.replace('-', '')
    setFormData({ ...formData, [fieldName]: value })
    
    // Clear errors when user types
    if (formErrors[fieldName]) {
      setFormErrors({ ...formErrors, [fieldName]: "" })
    }
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
    <Card id="account" className="bg-navy-800 border-navy-700 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Cog className="h-5 w-5 text-lime-400" />
          Account Settings
        </CardTitle>
        <CardDescription className="text-gray-300">Manage your account settings and preferences</CardDescription>
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
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Input
                id="current-password"
                type="password"
                placeholder="Current password"
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
              {formErrors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{formErrors.currentPassword}</p>
              )}
            </div>
            
            <div>
              <Input
                id="new-password"
                type="password"
                placeholder="New password"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
              {formErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{formErrors.newPassword}</p>
              )}
            </div>
            
            <div>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
              {formErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <Button 
            className="mt-2 bg-lime-400 hover:bg-lime-500 text-navy-900" 
            onClick={handleUpdatePassword}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>

        <Separator className="bg-navy-700" />

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