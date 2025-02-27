'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { ProfilePhotoUploader } from '@/components/ui/ProfilePhotoUploader';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define the schema using Zod
const profileFormSchema = z.object({
  username: z.string().max(30, { message: 'Username must not be longer than 30 characters.' }),
  email: z.string(),
  description: z.string().max(160).optional(),
  links: z
    .array(
      z.object({
        label: z.string().min(1, { message: 'Label is required' }),
        url: z.string().url({ message: 'Invalid URL' }),
      })
    )
    .optional(),
});

// Infer the type from the schema
type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: '',
      username: '',
      description: '',
      links: [],
    },
  });

  // Initialize form with user data
  useEffect(() => {
    if (isLoaded && isSignedIn && user && !isInitialized) {
      const metadata = user.publicMetadata || {};
      const description = (metadata as { description?: string })?.description || '';
      const links = (metadata as { links?: { label: string; url: string }[] })?.links || [];

      form.reset({
        email: user.primaryEmailAddress?.emailAddress || '',
        username: user.username || '', 
        description,
        links,
      });

      setIsInitialized(true);
    }
  }, [isLoaded, isSignedIn, user, form, isInitialized]);

  // Redirect to sign-in if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  // Handle form submission
  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    try {
      if (!user) return;

      // Update the username and metadata
      await user.update({
        username: data.username, // Update the username directly
        unsafeMetadata: {
          description: data.description,
          links: data.links,
          ...user.unsafeMetadata,
        },
      });

      toast.success('Profile updated', {
        description: 'Your profile has been successfully updated.',
      });

      router.refresh();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Update failed', {
        description: 'There was a problem updating your profile. Please try again.',
      });
    }
  };

  // Show loading state while user data is being fetched
  if (!isLoaded) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      
      <div className="flex justify-center mb-6">
        <ProfilePhotoUploader />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} readOnly disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your Username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Tell us about yourself" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Links Field */}
          <FormField
            control={form.control}
            name="links"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URLs</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {field.value?.map((link, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          placeholder="Label"
                          value={link.label}
                          onChange={(e) => {
                            const newLinks = [...(field.value || [])];
                            newLinks[index] = {
                              ...newLinks[index],
                              label: e.target.value,
                            };
                            field.onChange(newLinks);
                          }}
                        />
                        <Input
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => {
                            const newLinks = [...(field.value || [])];
                            newLinks[index] = {
                              ...newLinks[index],
                              url: e.target.value,
                            };
                            field.onChange(newLinks);
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => {
                            const newLinks = (field.value || []).filter((_, i) => i !== index);
                            field.onChange(newLinks);
                          }}
                          className="h-8 w-8"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const newLinks = [...(field.value || []), { label: '', url: '' }];
                        field.onChange(newLinks);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Add Link
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
}