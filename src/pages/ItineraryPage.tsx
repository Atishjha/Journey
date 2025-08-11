import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Camera,
  Utensils,
  Plane,
  Car,
  Hotel,
  Edit
} from "lucide-react";

export function ItineraryPage() {
  const [selectedTrip] = useState("paris-adventure");

  // Mock data - would come from API
  const trip = {
    id: "paris-adventure",
    title: "Paris Adventure",
    destination: "Paris, France",
    startDate: "March 15, 2024",
    endDate: "March 22, 2024",
    duration: "8 days",
    budget: 2500,
    spent: 1200,
    travelers: 2,
    status: "upcoming"
  };

  const itinerary = [
    {
      day: 1,
      date: "March 15, 2024",
      activities: [
        {
          time: "10:00 AM",
          title: "Arrive at Charles de Gaulle Airport",
          type: "transport",
          icon: Plane,
          description: "Flight lands at CDG Terminal 2E",
          cost: 0,
          duration: "1 hour"
        },
        {
          time: "2:00 PM",
          title: "Check-in at Hotel Malte Opera",
          type: "accommodation",
          icon: Hotel,
          description: "Boutique hotel in the 2nd arrondissement",
          cost: 120,
          duration: "30 minutes"
        },
        {
          time: "4:00 PM",
          title: "Explore the Louvre District",
          type: "sightseeing",
          icon: Camera,
          description: "Walk around the museum area and Tuileries Garden",
          cost: 0,
          duration: "2 hours"
        },
        {
          time: "7:30 PM",
          title: "Dinner at L'As du Fallafel",
          type: "dining",
          icon: Utensils,
          description: "Famous falafel in the Marais district",
          cost: 25,
          duration: "1 hour"
        }
      ]
    },
    {
      day: 2,
      date: "March 16, 2024",
      activities: [
        {
          time: "9:00 AM",
          title: "Visit the Louvre Museum",
          type: "sightseeing",
          icon: Camera,
          description: "Pre-booked tickets for morning entry",
          cost: 17,
          duration: "3 hours"
        },
        {
          time: "1:00 PM",
          title: "Lunch at Café de Flore",
          type: "dining",
          icon: Utensils,
          description: "Historic café in Saint-Germain",
          cost: 35,
          duration: "1 hour"
        },
        {
          time: "3:00 PM",
          title: "Stroll along the Seine",
          type: "sightseeing",
          icon: MapPin,
          description: "Walk from Notre-Dame to the Eiffel Tower",
          cost: 0,
          duration: "2 hours"
        },
        {
          time: "6:00 PM",
          title: "Sunset at Trocadéro",
          type: "sightseeing",
          icon: Camera,
          description: "Best view of the Eiffel Tower at sunset",
          cost: 0,
          duration: "1 hour"
        }
      ]
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "transport": return Plane;
      case "accommodation": return Hotel;
      case "dining": return Utensils;
      case "sightseeing": return Camera;
      default: return MapPin;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "transport": return "bg-blue-100 text-blue-800";
      case "accommodation": return "bg-purple-100 text-purple-800";
      case "dining": return "bg-orange-100 text-orange-800";
      case "sightseeing": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          {/* Trip Header */}
          <Card className="border-0 shadow-soft mb-8">
            <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{trip.title}</CardTitle>
                  <CardDescription className="text-white/80 text-base">
                    {trip.destination} • {trip.duration}
                  </CardDescription>
                </div>
                <Badge className="bg-white/20 text-white">
                  {trip.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{trip.startDate}</p>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{trip.endDate}</p>
                    <p className="text-xs text-muted-foreground">End Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">${trip.spent} / ${trip.budget}</p>
                    <p className="text-xs text-muted-foreground">Budget</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{trip.travelers} travelers</p>
                    <p className="text-xs text-muted-foreground">Group Size</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itinerary Tabs */}
          <Tabs defaultValue="itinerary" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="itinerary">Daily Itinerary</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="notes">Notes & Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="space-y-6">
              {itinerary.map((day) => (
                <Card key={day.day} className="border-0 shadow-soft">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Day {day.day}
                          <Badge variant="outline">{day.date}</Badge>
                        </CardTitle>
                        <CardDescription>
                          {day.activities.length} activities planned
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Day
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.activities.map((activity, index) => {
                        const IconComponent = getActivityIcon(activity.type);
                        return (
                          <div
                            key={index}
                            className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-soft transition-shadow"
                          >
                            <div className="flex flex-col items-center">
                              <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              {index < day.activities.length - 1 && (
                                <div className="w-px h-8 bg-border mt-2" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold">{activity.title}</h3>
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    {activity.cost > 0 ? `$${activity.cost}` : "Free"}
                                  </p>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">
                                {activity.description}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {activity.time}
                                </span>
                                <span>{activity.duration}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="expenses">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Track your spending throughout the trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Expense tracking coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Travel Notes & Tips</CardTitle>
                  <CardDescription>Important information for your trip</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">📍 Local Tips</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Metro day passes are €7.50 and valid for all zones</li>
                        <li>• Most museums are closed on Mondays or Tuesdays</li>
                        <li>• Dinner is typically served after 7:30 PM</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-muted">
                      <h4 className="font-semibold mb-2">🎫 Bookings & Reservations</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Louvre Museum tickets: Confirmation #LV123456</li>
                        <li>• Hotel check-in: 3:00 PM, early check-in available</li>
                        <li>• Restaurant reservations recommended for dinner</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}