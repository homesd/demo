"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Map,
  Heart,
  UserRound,
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  Home as HomeIcon,
  Briefcase,
  Gem,
  Bell,
  CheckCircle,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  packages as allPackages,
  destinations,
  testimonials,
  agents,
} from "@/lib/data";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LoginDialog } from "@/components/auth/login-dialog";
import { AgentCard } from "@/components/agent-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWishlist } from "@/components/context/wishlist-context";
import { useAuth } from "@/components/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/components/context/cart-context";
import { PackageCard } from "@/components/package-card";
import { FilterSheet } from "@/components/filter-sheet";
import { BottomNavBar } from "@/components/bottom-nav-bar";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AgentRegistrationModal } from "@/components/auth/agent-registration-modal";

type Package = (typeof allPackages)[0];

const AppHeader = () => {
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-2">
          <Map className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold text-foreground font-headline">
            Roam Southeast
          </h1>
        </Link>
                <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex"
            onClick={() => setAgentRegistrationOpen(true)}
          >
            <Briefcase className="h-4 w-4 mr-2" />
            Register Agent
          </Button>

          <Link href="/superadmin" passHref>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                <span>Your Bali trip is confirmed!</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Megaphone className="mr-2 h-4 w-4 text-blue-500" />
                <span>New deals for Thailand available.</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4 text-red-500" />
                <span>Someone liked your review.</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/shortlist" passHref>
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          <LoginDialog />
        </div>
      </div>
    </header>
  );
};

const GuestBenefitsSection = () => {
  const { user } = useAuth();

  // Only show to non-authenticated users
  if (user) return null;

  return (
    <section className="py-12 px-6 bg-gradient-to-r from-primary/5 to-blue-50">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-4">Join Roam Southeast Today</h3>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Create your free account and unlock exclusive features to make your
          travel planning effortless and secure.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Save Your Favorites</h4>
              <p className="text-sm text-muted-foreground">
                Create wishlists and save packages to compare and book later
                from any device.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Secure Payments</h4>
              <p className="text-sm text-muted-foreground">
                Book with confidence using our escrow payment system for maximum
                protection.
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Trip Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                Manage all your bookings, view e-tickets, and track your travel
                history.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <LoginDialog />
          <p className="text-sm text-muted-foreground">
            Already have an account? Sign in above
          </p>
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  const [packageList, setPackageList] = React.useState<Package[]>(
    allPackages.slice(0, 4),
  );
  const [activeDestination, setActiveDestination] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState<Package[]>([]);
  const [showSearchResults, setShowSearchResults] = React.useState(false);
  const [open, setOpen] = useState<null | "about" | "contact" | "terms" | "privacy">(null);
  const [agentRegistrationOpen, setAgentRegistrationOpen] = React.useState(false);

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const filtered = allPackages.filter((pkg) => {
      return (
        pkg.title.toLowerCase().includes(normalizedQuery) ||
        pkg.destination.toLowerCase().includes(normalizedQuery) ||
        pkg.duration.toLowerCase().includes(normalizedQuery)
      );
    });

    setSearchResults(filtered);
    setShowSearchResults(true);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to packages page with search query
      window.location.href = `/packages?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  React.useEffect(() => {
    if (activeDestination === "All") {
      setPackageList(allPackages.slice(0, 4));
    } else {
      setPackageList(
        allPackages
          .filter((p) => p.destination === activeDestination)
          .slice(0, 4),
      );
    }
  }, [activeDestination]);

  const filteredAgents = React.useMemo(() => {
    if (activeDestination === "All") {
      return agents;
    }
    return agents.filter((agent) =>
      agent.specialty.includes(activeDestination),
    );
  }, [activeDestination]);

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-2xl">
        <div className="flex min-h-screen w-full flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto pb-24">
            <section className="p-6 text-center">
              <h2 className="text-3xl font-bold font-headline tracking-tight">
                Your Southeast Asian Adventure Awaits
              </h2>
              <p className="mt-2 text-muted-foreground">
                Buy pre-packaged tours directly from local experts. No markups.
              </p>
              <form onSubmit={handleSearchSubmit} className="relative mt-6">
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for destinations or packages"
                  className="pl-10 h-12 text-base rounded-full shadow-md"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    {searchResults.slice(0, 5).map((pkg) => (
                      <Link
                        key={pkg.id}
                        href={`/packages/${pkg.slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-muted transition-colors border-b last:border-b-0"
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery("");
                        }}
                      >
                        <Image
                          src={pkg.image}
                          alt={pkg.title}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                          data-ai-hint={pkg.hint}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{pkg.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {pkg.destination} • {pkg.duration}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary rupee-font">₹{pkg.price}</span>
                      </Link>
                    ))}
                    {searchResults.length > 5 && (
                      <div className="p-3 text-center">
                        <Link
                          href={`/packages?search=${encodeURIComponent(searchQuery)}`}
                          className="text-sm text-primary hover:underline"
                          onClick={() => {
                            setShowSearchResults(false);
                            setSearchQuery("");
                          }}
                        >
                          View all {searchResults.length} results
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {showSearchResults && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 p-4 text-center">
                    <p className="text-muted-foreground">
                      No packages found for "{searchQuery}"
                    </p>
                  </div>
                )}
              </form>
            </section>

            <section className="px-2 pb-6">
              <Carousel
                opts={{
                  align: "start",
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {destinations.map((dest) => (
                    <CarouselItem
                      key={dest.name}
                      className="basis-1/4 sm:basis-1/5 lg:basis-1/6"
                    >
                      <div
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                        onClick={() => setActiveDestination(dest.name)}
                      >
                        <div
                          className={cn(
                            "relative w-20 h-20 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105 ring-2 ring-transparent",
                            activeDestination === dest.name
                              ? "ring-primary"
                              : "ring-border",
                          )}
                        >
                          <Image
                            src={dest.image}
                            alt={dest.name}
                            fill
                            style={{ objectFit: "cover" }}
                            className="transition-transform duration-300 group-hover:scale-110"
                            data-ai-hint={dest.hint}
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                        </div>
                        <p
                          className={cn(
                            "text-sm font-medium transition-colors",
                            activeDestination === dest.name
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                          style={{ opacity: 0.92 }}
                        >
                          {dest.name}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden sm:block">
                  <CarouselPrevious className="absolute left-[-10px] top-1/3 -translate-y-1/2 z-10" />
                  <CarouselNext className="absolute right-[-10px] top-1/3 -translate-y-1/2 z-10" />
                </div>
              </Carousel>
            </section>

            <section className="px-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-headline">
                  Popular Packages
                </h3>
                <Link
                  href="/packages"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {packageList.map((pkg) => (
                  <PackageCard key={pkg.id} pkg={pkg} />
                ))}
              </div>
            </section>

            <section className="bg-muted py-12 px-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold font-headline">
                  Top Travel Agents
                </h3>
                <Link
                  href="/agents"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  See all
                </Link>
              </div>
              <Carousel
                opts={{
                  align: "start",
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {filteredAgents.map((agent) => (
                    <CarouselItem
                      key={agent.id}
                      className="basis-full sm:basis-1/2 lg:basis-1/3 pl-4"
                    >
                      <AgentCard agent={agent} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden sm:block">
                  <CarouselPrevious className="left-[-10px]" />
                  <CarouselNext className="right-[-10px]" />
                </div>
              </Carousel>
            </section>

            <section className="py-12 px-6">
              <h3 className="text-xl font-bold font-headline text-center mb-6">
                What Our Travelers Say
              </h3>
              <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {testimonials.map((testimonial) => (
                    <CarouselItem
                      key={testimonial.id}
                      className="md:basis-1/1 lg:basis-1/1"
                    >
                      <div className="p-1">
                        <Card className="border-none shadow-lg">
                          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                            <Avatar className="w-16 h-16 mb-4 border-2 border-accent">
                              <AvatarImage
                                src={testimonial.avatar}
                                data-ai-hint={testimonial.hint}
                              />
                              <AvatarFallback>
                                {testimonial.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <p className="italic">"{testimonial.quote}"</p>
                            <p className="mt-4 font-bold font-headline text-foreground">
                              - {testimonial.name}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden sm:block">
                  <CarouselPrevious className="left-[-10px]" />
                  <CarouselNext className="right-[-10px]" />
                </div>
              </Carousel>
            </section>

            {/* Guest User Benefits Section - Only show to non-authenticated users */}
            <GuestBenefitsSection />

            <footer className="flex flex-wrap justify-center gap-4 py-8">
              <Button variant="link" onClick={() => setOpen("about")}>About Us</Button>
              <Button variant="link" onClick={() => setOpen("contact")}>Contact</Button>
              <Button variant="link" onClick={() => setOpen("terms")}>Terms & Conditions</Button>
              <Button variant="link" onClick={() => setOpen("privacy")}>Privacy Policy</Button>
            </footer>

            {/* Modals for each section */}
            <Dialog open={open === "about"} onOpenChange={() => setOpen(null)}>
              <DialogContent>
                <DialogTitle className="!text-black">About Us</DialogTitle>
                <p>
                  At Your Company, we specialize in creating seamless travel experiences by connecting travelers directly with trusted destination service providers. Our goal is to provide transparent pricing, rich itineraries, and impeccable customer service to help you explore the world effortlessly.
                </p>
              </DialogContent>
            </Dialog>
            <Dialog open={open === "contact"} onOpenChange={() => setOpen(null)}>
              <DialogContent>
                <DialogTitle className="!text-black">Contact</DialogTitle>
                <p>
                  We are here to assist you with any questions or support needs. Reach out to us via:<br/>
                  <strong>Email:</strong> support@yourcompany.com<br/>
                  <strong>Phone:</strong> +91-12345-67890<br/>
                  <strong>Address:</strong> 123 Travel St, Your City, India<br/>
                  Our customer service is available Monday to Saturday, 9:00 AM to 6:00 PM IST.
                </p>
              </DialogContent>
            </Dialog>
            <Dialog open={open === "terms"} onOpenChange={() => setOpen(null)}>
              <DialogContent>
                <DialogTitle className="!text-black">Terms & Conditions</DialogTitle>
                <p>
                  By using our platform, you agree to our terms which include responsible use of the site, accurate personal information submission, payment commitments, and compliance with local travel regulations. We reserve the right to modify these terms at any time; continued use means acceptance.
                </p>
              </DialogContent>
            </Dialog>
            <Dialog open={open === "privacy"} onOpenChange={() => setOpen(null)}>
              <DialogContent>
                <DialogTitle className="!text-black">Privacy Policy</DialogTitle>
                <p>
                  Your privacy is paramount. We collect personal data only to facilitate bookings and customer support. We do not share your information with third parties without your consent, and we implement industry-standard security measures to protect your data.
                </p>
              </DialogContent>
            </Dialog>
          </main>

          <BottomNavBar />
        </div>
      </div>
    </div>
  );
}
