import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Building,
  Car,
  CheckCircle,
  ChevronRight,
  Globe,
  GraduationCap,
  Home,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen min-w-full  bg-background">
      {/* Header */}
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-20 md:py-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white z-0"></div>
          <div className="container relative z-10 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex m-3 flex-col gap-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Your New Life{" "}
                  <span className="text-blue-500">Starts Here</span>
                </h1>
                <p className="text-xl text-gray-600">
                  AI-powered help for housing, cars, and immigration support —
                  all in one place.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Link href={"/signup"}>
                    <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                      Start Planning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative h-[600px] w-full ">
                <Image
                  src="/landing-1.png"
                  alt="ImmiGrow Hero Image"
                  fill
                  // className="object-cover"
                  priority
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}
              </div>
            </div>
          </div>
        </section>

        {/* Platform Overview */}
        <section id="about" className="py-20 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                All-in-One Platform for New Immigrants
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to start your new life in one place, powered
                by AI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Housing</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Verified rentals across top cities with virtual tours and
                    trusted landlords.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Car className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Cars</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    New & used cars with insurance options tailored for
                    newcomers.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Consultants</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Trusted immigration consultants with verified credentials
                    and reviews.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Smart Planner</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    AI-powered immigration guidance customized to your unique
                    situation.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How ImmiGrow Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered platform simplifies your immigration journey in
                three easy steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: "01",
                  title: "Tell Us About Your Move",
                  description:
                    "Where, when, and why you're immigrating. We'll customize everything to your needs.",
                  icon: Globe,
                },
                {
                  number: "02",
                  title: "Get Smart Matches Instantly",
                  description:
                    "AI finds you the right homes, cars, and consultants based on your preferences.",
                  icon: CheckCircle,
                },
                {
                  number: "03",
                  title: "Connect, Book, and Arrive Ready",
                  description:
                    "No stress. No scams. Just a smooth transition to your new home.",
                  icon: Home,
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center text-center p-6"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>

                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/4 right-0 transform translate-x-1/2">
                      <ChevronRight className="h-8 w-8 text-blue-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section id="who-its-for" className="py-20 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Built for Every Immigrant Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                No matter your situation, ImmiGrow has the tools and resources
                you need.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "International Students",
                  description:
                    "Find student housing, affordable cars, and visa support.",
                  icon: GraduationCap,
                  color: "bg-blue-100",
                },
                {
                  title: "Skilled Workers",
                  description:
                    "Professional relocation support for you and your family.",
                  icon: Building,
                  color: "bg-purple-100",
                },
                {
                  title: "Families",
                  description:
                    "Family-friendly homes, safe vehicles, and community connections.",
                  icon: Users,
                  color: "bg-orange-100",
                },
                {
                  title: "Realtors & Car Dealers",
                  description:
                    "Connect with newcomers looking for your services.",
                  icon: Home,
                  color: "bg-blue-100",
                },
              ].map((segment, index) => (
                <Card
                  key={index}
                  className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 h-full"
                >
                  <CardHeader className="pb-2">
                    <div
                      className={`w-12 h-12 rounded-full ${segment.color} flex items-center justify-center mb-4`}
                    >
                      <segment.icon className="h-6 w-6 text-blue-500" />
                    </div>
                    <CardTitle>{segment.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">
                      {segment.description}
                    </CardDescription>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-500 border-blue-500 hover:bg-blue-50"
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Thousands Worldwide
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from people who&apos;ve successfully started their new
                lives with ImmiGrow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  name: "Sarah Chen",
                  location: "From China to Canada",
                  quote:
                    "ImmiGrow helped me find a perfect apartment and a reliable car within days of arriving. The consultant they matched me with made my visa process so much easier.",
                  rating: 5,
                },
                {
                  name: "Miguel Rodriguez",
                  location: "From Mexico to USA",
                  quote:
                    "As a student, I was worried about finding affordable housing. ImmiGrow not only found me a great place but also connected me with other students from my country.",
                  rating: 5,
                },
                {
                  name: "Priya Sharma",
                  location: "From India to Australia",
                  quote:
                    "Moving with my family was stressful until we found ImmiGrow. Their AI recommendations were spot-on for our needs, and we felt at home right away.",
                  rating: 4,
                },
              ].map((testimonial, index) => (
                <Card key={index} className="border-none shadow-lg h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {Array(testimonial.rating)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">
                      {testimonial.quote}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-500 font-bold">
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-12 flex-wrap">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-500">5,000+</p>
                <p className="text-gray-600">Users Onboarded</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-500">12+</p>
                <p className="text-gray-600">Countries Served</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-500">4.9/5</p>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-blue-500 text-white">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Let&apos;s Plan Your Move - Together
              </h2>
              <p className="text-xl mb-8">
                Takes less than 2 minutes to get matched with the perfect
                housing, transportation, and support.
              </p>
              <Link href={"/signup"}>
                <Button
                  size="lg"
                  className="bg-white text-blue-500 hover:bg-gray-100"
                >
                  Start Now — It&apos;s Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" className="py-20 m-4 bg-white">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Have Questions? Reach Out!
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Our team is here to help you with any questions about your
                  immigration journey.
                </p>

                <form className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input id="name" placeholder="Your name" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      rows={4}
                    />
                  </div>

                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Send Message
                  </Button>
                </form>
              </div>

              <div className="relative h-[500px] w-full ">
                <Image
                  src="/landing-2.jpg"
                  alt="Contact ImmiGrow"
                  fill
                  className="object-cover"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div> */}
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
