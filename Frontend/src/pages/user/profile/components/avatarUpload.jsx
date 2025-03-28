import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { updateProfile } from '../../../../../store/authSlice'; // Update with your actual path
import { toast } from "react-toastify"
const AvatarUpload = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.data); // Get user data from Redux store
  const [avatarSrc, setAvatarSrc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Update the avatar source whenever userData changes
 // Update the avatar source whenever userData changes
 useEffect(() => {
  if (userData?.profileImage) {
    // Add your backend URL to the path
    const baseUrl = 'http://localhost:3001'; // Adjust to your backend URL
    const normalizedPath = userData.profileImage.replace(/\\/g, "/");
    setAvatarSrc(`${baseUrl}/${normalizedPath}`);
  } else if (userData?.avatar) {
    // Similar treatment for avatar
    const baseUrl = 'http://localhost:3001  ';
    const normalizedPath = userData.avatar.replace(/\\/g, "/");
    setAvatarSrc(`${baseUrl}/${normalizedPath}`);
  }
}, [userData]);

// Add this to your component to see the actual path value
console.log("Image path from userData:", userData?.profileImage);
console.log("Normalized avatar src:", avatarSrc);
  // Handle file selection
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAvatarSrc = e.target.result;
        setAvatarSrc(newAvatarSrc);
      };
      reader.readAsDataURL(file);
      
      // Upload to server
      setIsUploading(true);
      try {
        // Use the updateProfile action we created
        await dispatch(updateProfile({}, file));
        toast({
          title: "Success",
          description: "Profile image updated successfully",
          variant: "success",
        });
      } catch (error) {
        // Reset to previous avatar if upload fails
        setAvatarSrc(userData?.profileImage || userData?.avatar || null);
        toast({
          title: "Error",
          description: "Failed to update profile image",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  // Trigger file input click when button is clicked
  const triggerFileInput = () => {
    document.getElementById('avatar-upload').click();
  };
  
  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };
  
  // If no user data yet, show loading state
  if (!userData) {
    return (
      <div className="relative inline-block">
        <Avatar className="h-24 w-24">
          <AvatarFallback>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }


  return (
    <div className="relative inline-block">
      <Avatar className="h-24 w-24">
        <AvatarImage src={avatarSrc}   />
        <AvatarFallback>
          {getInitials(userData?.firstName || userData?.name)}
        </AvatarFallback>
      </Avatar>
      
      <Button
        size="icon"
        variant="outline"
        className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-navy-700 border-navy-700 text-lime-400"
        onClick={triggerFileInput}
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
      </Button>
      
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </div>
  );
};

export default AvatarUpload;