
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MapPin, ExternalLink } from "lucide-react";

export default function TherapistsPage() {
  const googleMapsUrl = "https://www.google.com/maps/search/psychotherapist+near+me";

  const handleOpenGoogleMaps = () => {
    window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-3xl">Find a Psychotherapist</CardTitle>
          <CardDescription>
            Need to find a mental health professional? We can help you search on Google Maps.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Click the button below to open Google Maps and search for psychotherapists in your area. 
            This will open in a new browser tab.
          </p>
          <Button onClick={handleOpenGoogleMaps} size="lg" className="w-full sm:w-auto">
            <ExternalLink className="mr-2 h-5 w-5" />
            Search on Google Maps
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">
            TheraBot provides this link as a convenience and does not endorse or recommend any specific therapist.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
