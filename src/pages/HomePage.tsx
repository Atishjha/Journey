import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, DollarSign, Users, ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
//import heroImage from "@/assets/hero-";
//import heroImage from "C:\AI Projects\travel-planner\frontend\src\assets\hero-travel.jpg";
//import heroImage from "../assets/hero-travel.jpg";
//import heroImage from "@/assets/hero-travel.jpg";
import heroImage from "../assets/hero-travel.jpg";
export function HomePage() {
  const features = [
    {
      icon: MapPin,
      title: "Smart Destinations",
      description: "AI-powered recommendations based on your preferences and budget."
    },
    {
      icon: Calendar,
      title: "Perfect Timing",
      description: "Optimal travel dates considering weather, events, and crowds."
    },
    {
      icon: DollarSign,
      title: "Budget Tracking",
      description: "Keep your expenses in check with real-time budget monitoring."
    },
    {
      icon: Users,
      title: "Group Planning",
      description: "Collaborate with friends and family to plan the perfect trip."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "TravelPlan made organizing our European vacation so easy. Everything was perfectly planned!"
    },
    {
      name: "Mike Chen",
      rating: 5,
      text: "The budget tracking feature saved us hundreds of dollars. Highly recommend!"
    },
    {
      name: "Emma Davis",
      rating: 5,
      text: "Best travel planning tool I've ever used. The AI suggestions were spot on."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 container py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Plan Your Dream
              <span className="block bg-gradient-warm bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl">
              Discover amazing destinations, create perfect itineraries, and track your 
              travel expenses all in one place. Let AI help you plan your next unforgettable journey.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg" asChild>
                <Link to="/planner">
                  Start Planning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to plan the perfect trip
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From destination discovery to expense tracking, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-soft hover:shadow-travel transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by travelers worldwide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our users have to say about their travel planning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Ready to start your next adventure?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TravelPlan to create amazing experiences.
          </p>
          <Button size="lg" className="text-lg bg-white text-primary hover:bg-white/90" asChild>
            <Link to="/planner">
              Plan Your Trip Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}