"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquarePlus, History, FileText, Bot, Users, Leaf } from "lucide-react";
import Image from "next/image";

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  cta: string;
}

function ActionCard({ title, description, href, icon: Icon, cta }: ActionCardProps) {
  return (
    <Card className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={href}>{cta}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { userProfile } = useAuth();

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 overflow-hidden bg-gradient-to-r from-primary/80 via-primary/70 to-accent/70 p-1 shadow-xl">
        <div className="bg-card p-6 md:p-10 rounded-md">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
                <Image src="https://placehold.co/150x150.png" alt="Therabot illustration" width={150} height={150} className="rounded-full border-4 border-primary/50" data-ai-hint="friendly robot"/>
            </div>
            <div>
              <h1 className="font-headline text-3xl md:text-4xl font-semibold text-foreground mb-2">
                Welcome, {userProfile?.displayName || "User"}!
              </h1>
              <p className="text-lg text-muted-foreground">
                TheraBot is here to support you. What would you like to do today?
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          title="Chat with AI Therapist"
          description="Engage in a supportive conversation with your AI companion."
          href="/chat"
          icon={MessageSquarePlus}
          cta="Start Chatting"
        />
        <ActionCard
          title="View Chat History"
          description="Review your past conversations and reflections."
          href="/history"
          icon={History}
          cta="Access History"
        />
        <ActionCard
          title="Generate Wellness Report"
          description="Get a summary of insights and motivational advice from your chats."
          href="/report"
          icon={FileText}
          cta="Generate Report"
        />
         <ActionCard
          title="Your Profile"
          description="Manage your personal information and preferences."
          href="/profile"
          icon={Users} 
          cta="Go to Profile"
        />
        <ActionCard
          title="Mindful Growth"
          description="Discover resources and tips for personal development."
          href="/resources" 
          icon={Leaf}
          cta="Explore Resources"
        />
         <ActionCard
          title="Community Support"
          description="Connect with others and share experiences (feature coming soon)."
          href="#"
          icon={Users}
          cta="Coming Soon"
        />
      </div>
    </div>
  );
}
