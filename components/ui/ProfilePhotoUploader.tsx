'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { toast } from 'sonner';

export const ProfilePhotoUploader = () => {
    const {user, isLoaded} = useUser();
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user) return;

        const file = event.target.files?.[0];
        if (!file) return;
        
        try {
            setIsUploading(true);
      
            // Upload the image to Clerk
            await user.setProfileImage({file});
      
            toast.success('Profile image updated!');
          } catch (error) {
            console.error('Image upload failed:', error);
            toast.error('Failed to update profile image');
          } finally {
            setIsUploading(false);
          }
    };

    if (!isLoaded) return null;

    return (
        <div className={cn('w-fit relative')}>
            <Avatar className="w-48 h-48">
                <AvatarImage src={user?.imageUrl} /> 
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <Button
                type='button'
                className="w-8 h-8 p-2 rounded-full absolute right-[-15px] top-[60%] bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isUploading}
                onClick={() => document.getElementById('profile-image-upload')?.click()}
            >
                <Upload className="h-4 w-4" />
            </Button>

            <input id="profile-image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
    );
};