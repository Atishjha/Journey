import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, MapPin, Calendar, Globe, Camera, Settings } from "lucide-react";

export function ProfilePage() {
  const userStats = {
    totalTrips: 12,
    countriesVisited: 8,
    totalDistance: "45,230 km",
    favoriteSeason: "Spring"
  };

  const recentTrips = [
    { destination: "Paris, France", date: "Mar 2024", rating: 5 },
    { destination: "Tokyo, Japan", date: "Jan 2024", rating: 5 },
    { destination: "Bali, Indonesia", date: "Dec 2023", rating: 4 },
  ];

  const interests = ["Culture", "Food", "Photography", "Nature", "History", "Adventure"];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Profile</h1>
            <p className="text-lg text-muted-foreground">
              Manage your travel preferences and view your journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-lg">JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Home Location</Label>
                    <Input id="location" placeholder="City, Country" defaultValue="New York, USA" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Tell us about yourself and your travel interests..."
                      defaultValue="Passionate traveler exploring the world one destination at a time. Love discovering local cultures, trying new cuisines, and capturing memories through photography."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Travel Preferences
                  </CardTitle>
                  <CardDescription>
                    Help us personalize your travel recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-3 block">Travel Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Typical Budget Range</Label>
                      <Input id="budget" placeholder="e.g., $1000-2000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Preferred Trip Duration</Label>
                      <Input id="duration" placeholder="e.g., 5-7 days" />
                    </div>
                  </div>

                  <Button className="w-full">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Stats & Activity */}
            <div className="space-y-6">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Travel Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userStats.totalTrips}</div>
                    <div className="text-sm text-muted-foreground">Total Trips</div>
                  </div>
                  
                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Countries Visited</span>
                      <span className="font-semibold">{userStats.countriesVisited}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Distance Traveled</span>
                      <span className="font-semibold">{userStats.totalDistance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Favorite Season</span>
                      <span className="font-semibold">{userStats.favoriteSeason}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Recent Trips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTrips.map((trip, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{trip.destination}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {trip.date}
                          </p>
                        </div>
                        <div className="flex">
                          {Array.from({ length: trip.rating }).map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">★</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft bg-gradient-primary">
                <CardContent className="pt-6 text-white text-center">
                  <Globe className="h-8 w-8 mx-auto mb-3 text-white/80" />
                  <h3 className="font-semibold mb-2">Travel More, Save More</h3>
                  <p className="text-sm text-white/90 mb-4">
                    Upgrade to Premium for exclusive deals and advanced planning features.
                  </p>
                  <Button variant="outline" className="bg-white/20 border-white/20 text-white hover:bg-white/30">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}