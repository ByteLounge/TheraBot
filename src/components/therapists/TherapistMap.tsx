"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search, LocateFixed } from "lucide-react";
import { Spinner } from "../shared/Spinner";

// Ensure you have NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env.local file
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface Therapist {
  id: string;
  name: string;
  address: string;
  position: { lat: number; lng: number };
  specialties?: string[];
}

// Mock data for therapists - replace with actual API call
const mockTherapists: Therapist[] = [
  { id: "1", name: "Dr. Serene Mindwell", address: "123 Wellness Way, Tranquil City", position: { lat: 34.0522, lng: -118.2437 }, specialties: ["Anxiety", "Depression"] },
  { id: "2", name: "Calm Waters Clinic", address: "456 Peace Ave, Serenity Suburb", position: { lat: 34.0580, lng: -118.2500 }, specialties: ["Stress Management", "CBT"] },
  { id: "3", name: "The Healing Space", address: "789 Harmony Rd, Mindful Town", position: { lat: 34.0450, lng: -118.2300 }, specialties: ["Trauma", "Family Therapy"] },
];


export function TherapistMap() {
  const { toast } = useToast();
  const [center, setCenter] = useState({ lat: 34.052235, lng: -118.243683 }); // Default to Los Angeles
  const [zoom, setZoom] = useState(11);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);

  useEffect(() => {
    // Simulate fetching therapists based on current map center or user location
    // In a real app, this would be an API call
    setTherapists(mockTherapists.filter(t => 
        Math.abs(t.position.lat - center.lat) < 0.1 && 
        Math.abs(t.position.lng - center.lng) < 0.1
    ));
  }, [center]);


  const handleLocateMe = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setZoom(13);
          setLoadingLocation(false);
          toast({ title: "Location Found", description: "Map centered on your current location." });
        },
        (error) => {
          console.error("Error getting location", error);
          toast({
            title: "Location Error",
            description: "Could not access your location. Please ensure location services are enabled.",
            variant: "destructive",
          });
          setLoadingLocation(false);
        }
      );
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive",
      });
      setLoadingLocation(false);
    }
  };

  if (!API_KEY) {
    return (
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" /> Find Therapists Nearby
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">
            Google Maps API Key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl flex flex-col h-[calc(100vh-10rem)]">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" /> Find Therapists Nearby
                </CardTitle>
                <CardDescription>Discover mental health professionals in your area.</CardDescription>
            </div>
            <Button onClick={handleLocateMe} disabled={loadingLocation}>
                {loadingLocation ? <Spinner className="mr-2 h-4 w-4" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                Use My Current Location
            </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 relative">
        <APIProvider apiKey={API_KEY}>
          <Map
            center={center}
            zoom={zoom}
            mapId={"therabot-map"} // Optional: for Cloud-based map styling
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            className="w-full h-full"
            onCenterChanged={(ev) => setCenter(ev.detail.center)}
            onZoomChanged={(ev) => setZoom(ev.detail.zoom)}
          >
            {therapists.map((therapist) => (
              <Marker 
                key={therapist.id} 
                position={therapist.position} 
                onClick={() => setSelectedTherapist(therapist)}
              />
            ))}
            {selectedTherapist && (
                <InfoWindow 
                    position={selectedTherapist.position} 
                    onCloseClick={() => setSelectedTherapist(null)}
                    pixelOffset={new google.maps.Size(0, -30)} // Adjust InfoWindow position
                >
                    <div className="p-2 font-body">
                        <h3 className="font-headline text-md mb-1">{selectedTherapist.name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{selectedTherapist.address}</p>
                        {selectedTherapist.specialties && (
                             <p className="text-xs">Specialties: {selectedTherapist.specialties.join(", ")}</p>
                        )}
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-primary" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedTherapist.address)}`, "_blank")}>
                            Get Directions
                        </Button>
                    </div>
                </InfoWindow>
            )}
          </Map>
        </APIProvider>
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg text-xs text-muted-foreground">
            Map data ©{new Date().getFullYear()} Google
        </div>
      </CardContent>
    </Card>
  );
}
