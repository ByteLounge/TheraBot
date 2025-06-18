
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc } from "firebase/firestore"; // Changed updateDoc to setDoc
import { db, storage, auth } from "@/lib/firebase";
import { updateProfile as updateFirebaseProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState, useRef } from "react";
import { UserCircle2, Mail, Cake, Save, Edit3 } from "lucide-react"; // Removed ImageUp as it's not used
import { Spinner } from "../shared/Spinner";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(0, "Age cannot be negative.").optional().nullable(),
});

export function ProfileForm() {
  const { currentUser, userProfile, reloadUserProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      age: undefined,
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        displayName: userProfile.displayName || "",
        age: userProfile.age || undefined,
      });
      setImagePreview(userProfile.profileImageUrl || null);
    }
  }, [userProfile, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      let profileImageUrl = userProfile?.profileImageUrl || null;

      if (imageFile) {
        const storageRef = ref(storage, `profileImages/${currentUser.uid}/${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        profileImageUrl = await getDownloadURL(snapshot.ref);
      }

      const userDocRef = doc(db, "users", currentUser.uid);
      // Use setDoc with merge: true to create the document if it doesn't exist, or update if it does.
      await setDoc(userDocRef, {
        displayName: values.displayName,
        age: values.age || null,
        profileImageUrl: profileImageUrl,
      }, { merge: true });
      
      if (auth.currentUser) {
          await updateFirebaseProfile(auth.currentUser, {
              displayName: values.displayName,
              photoURL: profileImageUrl 
          });
      }

      await reloadUserProfile(); 
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
    } catch (error: any) {
      console.error("Profile update error", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setImageFile(null); 
    }
  }
  
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 0 || nameParts[0] === "") return "U";
    return nameParts.map(n => n[0]).join("").toUpperCase();
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-primary ring-offset-2 ring-offset-background">
                <AvatarImage src={imagePreview || undefined} alt={userProfile?.displayName || "User"} data-ai-hint="user profile"/>
                <AvatarFallback className="text-3xl">
                    {getInitials(userProfile?.displayName)}
                </AvatarFallback>
            </Avatar>
            <Button 
                variant="outline" 
                size="sm" 
                className="relative -top-6 -right-8 rounded-full h-8 w-8 p-0"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile picture"
            >
                <Edit3 className="h-4 w-4" />
            </Button>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageChange}
            />
        </div>
        <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
            <UserCircle2 className="h-8 w-8 text-primary" /> Your Profile
        </CardTitle>
        <CardDescription>Manage your personal information and preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5"><UserCircle2 size={16}/> Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
                <FormLabel className="flex items-center gap-1.5"><Mail size={16}/> Email</FormLabel>
                <Input value={userProfile?.email || ""} disabled placeholder="your@email.com" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </FormItem>
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5"><Cake size={16}/> Age (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Your Age" {...field} value={field.value ?? ""} min={0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground text-center w-full">
            Your information is kept confidential and secure.
        </p>
      </CardFooter>
    </Card>
  );
}

