import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  DollarSign, 
  Users, 
  Heart, 
  Camera, 
  Utensils, 
  Mountain,
  Building,
  Waves,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function PlannerPage() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [budget, setBudget] = useState([2000]);
  const [travelers, setTravelers] = useState("2");
  const [interests, setInterests] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const interestOptions = [
    { id: "culture", label: "Culture & History", icon: Building },
    { id: "food", label: "Food & Dining", icon: Utensils },
    { id: "nature", label: "Nature & Outdoors", icon: Mountain },
    { id: "photography", label: "Photography", icon: Camera },
    { id: "beaches", label: "Beaches", icon: Waves },
    { id: "romance", label: "Romance", icon: Heart },
  ];

  const toggleInterest = (interestId: string) => {
    setInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handlePlanTrip = () => {
    // This would normally call an API to generate the trip plan
    console.log("Planning trip with:", {
      destination,
      startDate,
      endDate,
      budget: budget[0],
      travelers,
      interests,
      notes
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Plan Your Perfect Trip</h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your dream destination and we'll create a personalized itinerary
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Trip Details
                  </CardTitle>
                  <CardDescription>
                    Fill in the details to get started with your trip planning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Destination */}
                  <div className="space-y-2">
                    <Label htmlFor="destination">Where do you want to go?</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="destination"
                        placeholder="e.g., Paris, Tokyo, New York"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-4">
                    <Label>Budget (USD)</Label>
                    <div className="px-3">
                      <Slider
                        value={budget}
                        onValueChange={setBudget}
                        max={10000}
                        min={500}
                        step={100}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>$500</span>
                        <span className="font-semibold text-primary">
                          ${budget[0].toLocaleString()}
                        </span>
                        <span>$10,000+</span>
                      </div>
                    </div>
                  </div>

                  {/* Number of Travelers */}
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of Travelers</Label>
                    <Select value={travelers} onValueChange={setTravelers}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 person</SelectItem>
                        <SelectItem value="2">2 people</SelectItem>
                        <SelectItem value="3">3 people</SelectItem>
                        <SelectItem value="4">4 people</SelectItem>
                        <SelectItem value="5+">5+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Interests */}
                  <div className="space-y-4">
                    <Label>What are you interested in?</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interestOptions.map((interest) => (
                        <Button
                          key={interest.id}
                          variant={interests.includes(interest.id) ? "default" : "outline"}
                          className="h-20 flex flex-col gap-2"
                          onClick={() => toggleInterest(interest.id)}
                        >
                          <interest.icon className="h-5 w-5" />
                          <span className="text-xs">{interest.label}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any specific requests, dietary restrictions, accessibility needs, etc."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{destination || "Choose destination"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {startDate && endDate
                          ? `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`
                          : "Select dates"
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${budget[0].toLocaleString()} budget</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{travelers} {travelers === "1" ? "traveler" : "travelers"}</span>
                    </div>
                  </div>

                  {interests.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Interests:</p>
                      <div className="flex flex-wrap gap-1">
                        {interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interestOptions.find(opt => opt.id === interest)?.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button 
                className="w-full h-12 text-lg" 
                onClick={handlePlanTrip}
                disabled={!destination || !startDate || !endDate}
              >
                Create My Itinerary
              </Button>

              <Card className="border-0 shadow-soft bg-gradient-primary">
                <CardContent className="pt-6 text-white">
                  <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
                  <p className="text-sm text-white/90">
                    Be specific about your interests to get better recommendations. 
                    Our AI considers local events, weather, and seasonal activities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
