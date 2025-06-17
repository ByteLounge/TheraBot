"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

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
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { Spinner } from "@/components/shared/Spinner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, { displayName: values.name });
        
        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName: values.name,
          email: values.email,
          createdAt: serverTimestamp(),
          profileImageUrl: null,
          age: null,
        });
      }
      
      toast({ title: "Signup Successful", description: "Welcome to TheraBot!" });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Signup error", error);
      toast({
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserPlus className="h-8 w-8" />
        </div>
        <CardTitle className="font-headline text-3xl">Create Your Account</CardTitle>
        <CardDescription>Join TheraBot and start your journey to mental wellness.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                     <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••" 
                        {...field} 
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              Sign Up
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col items-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" asChild className="p-0 text-primary hover:underline">
            <Link href="/login">Log in</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
