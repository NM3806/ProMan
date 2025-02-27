'use client';

import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';

export const ProfilePhotoUploader = () => {
    return (
        <div className={cn('w-fit relative')}>
            <Avatar className="w-48 h-48">
                <AvatarImage /> {/* src="/path/to/image" Replace with actual image path */}
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <Button
                className="w-8 h-8 p-2 rounded-full absolute right-[-15px] top-[60%] bg-blue-500 hover:bg-blue-600 text-white"
            >
                <Upload className="h-4 w-4" />
            </Button>

            <input type="file" accept="image/*" className="hidden" />
        </div>
    );
};