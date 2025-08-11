import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Calendar, DollarSign, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function DashboardPage() {
  // Mock data - would come from API
  const stats = {
    totalTrips: 12,
    upcomingTrips: 3,
    totalSpent: 15420,
    savedMoney: 2340
  };

  const recentTrips = [
    {
      id: 1,
      title: "Paris Adventure",
      destination: "Paris, France",
      dates: "Mar 15-22, 2024",
      budget: 2500,
      spent: 2340,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Tokyo Explorer",
      destination: "Tokyo, Japan",
      dates: "Jan 10-20, 2024",
      budget: 3500,
      spent: 3200,
      status: "completed"
    },
    {
      id: 3,
      title: "Bali Retreat",
      destination: "Bali, Indonesia",
      dates: "Dec 5-15, 2023",
      budget: 2000,
      spent: 1850,
      status: "completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your travel overview.</p>
          </div>
          <Button asChild>
            <Link to="/planner">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalTrips}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-travel-orange">{stats.upcomingTrips}</div>
              <p className="text-xs text-muted-foreground">Next 6 months</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-travel-green">
                ${stats.totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-travel-purple">
                ${stats.savedMoney.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Through planning</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Recent Trips</CardTitle>
              <CardDescription>Your latest travel adventures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-soft transition-shadow cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{trip.title}</h3>
                        <Badge className={getStatusColor(trip.status)}>
                          {trip.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {trip.destination}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {trip.dates}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${trip.spent}</p>
                      <p className="text-sm text-muted-foreground">
                        of ${trip.budget}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/itinerary">View All Trips</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your next trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full justify-start h-16" asChild>
                  <Link to="/planner">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">Plan New Trip</div>
                        <div className="text-sm text-muted-foreground">
                          Start planning your next adventure
                        </div>
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start h-16" asChild>
                  <Link to="/itinerary">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-travel-orange/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-travel-orange" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">View Itineraries</div>
                        <div className="text-sm text-muted-foreground">
                          Check your upcoming trips
                        </div>
                      </div>
                    </div>
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start h-16">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-travel-green/10 rounded-lg">
                      <DollarSign className="h-5 w-5 text-travel-green" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Track Expenses</div>
                      <div className="text-sm text-muted-foreground">
                        Monitor your travel budget
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}