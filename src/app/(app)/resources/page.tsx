
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, BookOpen, Podcast, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    title: "The Power of Now",
    description: "A guide to spiritual enlightenment by Eckhart Tolle.",
    type: "Article",
    icon: BookOpen,
    link: "https://archive.org/download/ThePowerOfNowEckhartTolle_201806/The%20Power%20Of%20Now%20-%20Eckhart%20Tolle.pdf",
  },
  {
    title: "Guided Meditation for Beginners",
    description: "A 10-minute guided meditation to help you relax and focus.",
    type: "Audio",
    icon: Podcast,
    link: "https://youtu.be/Evgx9yX2Vw8?feature=shared",
  },
  // Removed "The Power of Positive Affirmations"
  // Removed "Building Resilience: Coping Strategies"
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 overflow-hidden bg-gradient-to-r from-primary/80 via-primary/70 to-accent/70 p-1 shadow-xl">
        <div className="bg-card p-6 md:p-10 rounded-md">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 text-primary p-4 bg-primary/10 rounded-full">
              <Leaf size={60} />
            </div>
            <div>
              <h1 className="font-headline text-3xl md:text-4xl font-semibold text-foreground mb-2">
                Mindful Growth Resources
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore articles, guides, and tools to support your mental wellness journey.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Card key={index} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 rounded-full bg-accent/20 text-accent-foreground">
                    <resource.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-headline text-lg">{resource.title}</CardTitle>
                </div>
                {/* Image component removed */}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </CardContent>
              <CardFooter>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    {resource.type === "Audio" ? "Listen Now" : "Read More"}
                  </Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-12 text-center p-8 bg-card border">
          <CardTitle className="font-headline text-2xl mb-3">No Resources Available Yet</CardTitle>
          <CardDescription className="text-muted-foreground">
            We're working on curating helpful resources. Please check back soon!
          </CardDescription>
        </Card>
      )}

       <Card className="mt-12 text-center p-8 bg-accent/30 border-accent/50">
        <CardTitle className="font-headline text-2xl mb-3">More Coming Soon!</CardTitle>
        <CardDescription className="text-muted-foreground">
          We're constantly curating new resources to help you on your path to wellbeing. Check back often!
        </CardDescription>
      </Card>
    </div>
  );
}
