
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
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { updateProfile as updateFirebaseProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { UserCircle2, Mail, Cake, Save } from "lucide-react";
import { Spinner } from "../shared/Spinner";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(0, "Age cannot be negative.").optional().nullable(),
});

export function ProfileForm() {
  const { currentUser, userProfile, reloadUserProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
    }
  }, [userProfile, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!currentUser) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      
      const dataToSave = {
        displayName: values.displayName,
        age: values.age ?? null, // Ensure age is null if undefined/empty
        profileImageUrl: null, // No longer uploading images
      };

      if (typeof dataToSave.age === 'number' && isNaN(dataToSave.age)) {
        dataToSave.age = null;
      }
      
      await setDoc(userDocRef, dataToSave, { merge: true });
      
      if (auth.currentUser) {
          await updateFirebaseProfile(auth.currentUser, {
              displayName: values.displayName,
              photoURL: null // No longer setting photoURL here
          });
          await auth.currentUser.reload();
      }

      await reloadUserProfile(); 
      toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
    } catch (error: any) {
      console.error("Profile update error object:", error);
      let description = "Could not update profile. Please try again.";
      if (error.code && error.message) { 
        description = `Update failed: ${error.code}. ${error.message}`;
      } else if (error.message) {
        description = `Update failed: ${error.message}`;
      }
      toast({
        title: "Update Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ").filter(Boolean);
    if (nameParts.length === 0 || nameParts[0] === "") return "U";
    return nameParts.map(n => n[0]).join("").toUpperCase();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
            <Avatar className="h-24 w-24 ring-4 ring-primary ring-offset-2 ring-offset-background">
                {/* No AvatarImage, rely on AvatarFallback */}
                <AvatarFallback className="text-3xl">
                    {getInitials(form.getValues("displayName") || userProfile?.displayName)}
                </AvatarFallback>
            </Avatar>
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
                    <Input type="number" placeholder="Your Age" {...field} value={field.value ?? ""} min="0" />
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
