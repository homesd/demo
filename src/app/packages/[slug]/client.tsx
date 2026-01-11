"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  Heart,
  MessageSquare,
  Send,
  Share2,
  Star,
  User,
  Users,
  X,
  ShieldCheck,
  Tag,
  MapPin,
} from "lucide-react";
import type { packages as allPackages, agents } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { testimonials } from "@/lib/data";
import { useWishlist } from "@/components/context/wishlist-context";
import { useAuth } from "@/components/auth/auth-context";
import { useCart } from "@/components/context/cart-context";
import { LoginDialog } from "@/components/auth/login-dialog";
import { LoginEnforcementModal } from "@/components/auth/login-enforcement-modal";
import { useRouter } from "next/navigation";

type Package = (typeof allPackages)[0];
type Agent = (typeof agents)[0];

const PackageHeader = ({ title }: { title: string }) => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between p-4">
        <Link href="/" passHref>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="truncate text-xl font-bold text-foreground font-headline">
          {title}
        </h1>
        <div className="w-10"></div>
      </div>
    </header>
  );
};

const AskAgentDialog = ({ agent, pkg }: { agent: Agent; pkg: Package }) => {
  const [message, setMessage] = React.useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim()) {
      toast({
        title: "Message Sent!",
        description: `Your question has been sent to ${agent.name}. They will get back to you shortly.`,
      });
      setMessage("");
    }
  };

  const handleWhatsApp = () => {
    const phoneNumber = agent.phone.replace(/\D/g, ""); // Remove non-digits
    const defaultMessage = `Hi ${agent.name}! I'm interested in the "${pkg.title}" package. Could you please provide more details?`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask Your Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ask {agent.name}</DialogTitle>
          <DialogDescription>
            Have a question about the itinerary, inclusions, or anything else?
            Send them a message directly.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Type your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleWhatsApp}
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            WhatsApp DMC
          </Button>
          <DialogClose asChild>
            <Button onClick={handleSend} disabled={!message.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function PackageDetailsClient({
  pkg,
  agent,
}: {
  pkg: Package;
  agent: Agent;
}) {
  const { toast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [travelers, setTravelers] = React.useState(2);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [showPayment, setShowPayment] = React.useState(false);
  const [paymentName, setPaymentName] = React.useState("");
  const [paymentEmail, setPaymentEmail] = React.useState("");
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const router = useRouter();

  const handleWishlistToggle = () => {
    const success = toggleWishlist(pkg.id);
    if (!success) {
      toast({
        title: "Save to wishlist",
        description:
          "Sign in to save this package to your wishlist and access it later from any device.",
        variant: "default",
      });
    } else {
      const isNowWishlisted = isInWishlist(pkg.id);
      toast({
        title: isNowWishlisted ? "Added to Wishlist" : "Removed from Wishlist",
        description: `"${pkg.title}" has been ${isNowWishlisted ? "added to" : "removed from"} your wishlist.`,
      });
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Sign in to continue",
        description:
          "Create an account or sign in to add packages to your cart and complete booking.",
        variant: "default",
      });
      return;
    }

    addToCart(pkg, travelers, selectedDate);
    toast({
      title: "Booking Confirmed",
      description: `\"${pkg.title}\" for ${travelers} traveler${travelers !== 1 ? "s" : ""} has been booked!`,
    });
  };

  const copyLinkToClipboard = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "The package URL has been copied to your clipboard.",
    });
  };

  const handleShare = async () => {
    if (!pkg) return;
    const shareData = {
      title: pkg.title,
      text: `Check out this amazing travel package: ${pkg.title}`,
      url: window.location.href,
    };

    // Use Web Share API if available and allowed
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to clipboard if share fails
        await copyLinkToClipboard();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await copyLinkToClipboard();
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % packageImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + packageImages.length) % packageImages.length,
    );
  };

  const handleBookNow = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    router.push(`/booking/${pkg.id}`);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    router.push(`/booking/${pkg.id}`);
  };

  if (!pkg || !agent) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Package not found.
      </div>
    );
  }

  const dummyItinerary = [
    {
      day: 1,
      title: "Arrival & City Exploration",
      description:
        "Arrive at the airport, transfer to your hotel, and enjoy a day exploring the local markets and landmarks.",
    },
    {
      day: 2,
      title: "Cultural Immersion",
      description:
        "Visit ancient temples, museums, and historical sites to immerse yourself in the local culture.",
    },
    {
      day: 3,
      title: "Adventure Day",
      description:
        "Embark on an exciting adventure, such as jungle trekking, snorkeling, or zip-lining, depending on your destination.",
    },
    {
      day: 4,
      title: "Leisure & Relaxation",
      description:
        "Enjoy a day at your own pace. Relax on the beach, indulge in a spa treatment, or shop for souvenirs.",
    },
    {
      day: 5,
      title: "Departure",
      description:
        "Enjoy a final breakfast before transferring to the airport for your departure.",
    },
    {
      day: 6,
      title: "Island Hopping",
      description:
        "Explore nearby islands, swim in crystal clear waters, and enjoy a beach barbecue.",
    },
    {
      day: 7,
      title: "Wildlife Safari",
      description:
        "Go on a safari to see local wildlife in their natural habitat.",
    },
    {
      day: 8,
      title: "Mountain Trek",
      description:
        "Hike through scenic mountain trails and enjoy panoramic views.",
    },
    {
      day: 9,
      title: "Cooking Class",
      description:
        "Learn to cook local delicacies in a hands-on cooking class.",
    },
    {
      day: 10,
      title: "Farewell Dinner",
      description:
        "Enjoy a special farewell dinner with cultural performances.",
    },
  ];

  const inclusions = [
    "Airport transfers",
    "Accommodation in 3-star hotels",
    "Daily breakfast",
    "Guided tours as per itinerary",
    "Entrance fees to specified sights",
    "All applicable taxes",
  ];

  const exclusions = [
    "International airfare",
    "Visa fees",
    "Lunches and dinners",
    "Personal expenses",
    "Travel insurance",
    "Tips and gratuities",
  ];

  const packageImages = [
    pkg.image,
    `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop`,
    `https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=400&fit=crop`,
    `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop`,
    `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop`,
    `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop`,
  ];

  const StatCard = ({
    icon,
    label,
    value,
    hint,
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
    hint?: string;
  }) => (
    <Card className="shadow-md transition-all hover:shadow-lg hover:scale-105">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-primary/10 p-3 rounded-full">
          {React.createElement(icon, { className: "h-6 w-6 text-primary" })}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-bold text-lg">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-background text-foreground">
      <div className="mx-auto max-w-4xl">
        <div className="flex min-h-screen w-full flex-col">
          <PackageHeader title={pkg.title} />
          <main className="flex-1 overflow-y-auto pb-24">
            <Carousel className="w-full">
              <CarouselContent>
                {packageImages.map((src, index) => (
                  <CarouselItem key={index}>
                    <div
                      className="relative h-64 md:h-80 cursor-pointer group"
                      onClick={() => openLightbox(index)}
                    >
                      <Image
                        src={src}
                        alt={`${pkg.title} gallery image ${index + 1}`}
                        fill
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        data-ai-hint={`${pkg.hint} ${index % 2 === 0 ? "scenery" : "activity"}`}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          Click to view
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>

            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold text-foreground font-headline">
                    {pkg.title}
                  </h2>
                  <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{pkg.destination}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-accent fill-current" />
                      <span>
                        {pkg.rating} ({agent.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlistToggle}
                  >
                    <Heart
                      className={`h-5 w-5 ${isInWishlist(pkg.id) ? "text-primary fill-current" : ""}`}
                    />
                    <span className="sr-only">Wishlist</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
                <StatCard icon={Tag} label="Price" value={`₹${pkg.price}`} />
                <StatCard icon={Clock} label="Duration" value={pkg.duration} />
                <StatCard
                  icon={Users}
                  label="Group Size"
                  value={`${(pkg as any).groupSize?.min || 2}-${(pkg as any).groupSize?.max || 12} people`}
                />
                <StatCard
                  icon={User}
                  label="Category"
                  value={(pkg as any).category || "Adventure"}
                />
              </div>

              <div className="mb-6 rounded-lg bg-card p-6 shadow-md">
                <h3 className="text-xl font-bold font-headline mb-4" style={{ opacity: 0.92 }}>
                  Tour Operator
                </h3>
                <div className="flex items-start gap-4">
                  <Link href={`/agents/${agent.id}`} passHref>
                    <Avatar className="w-16 h-16 border-2 border-primary">
                      <AvatarImage src={agent.logo} data-ai-hint={agent.hint} />
                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link href={`/agents/${agent.id}`} passHref>
                        <p className="font-bold text-lg hover:underline">
                          {agent.name}
                        </p>
                      </Link>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        <ShieldCheck className="h-4 w-4 mr-1" /> Trusted Partner
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Verified Local Partner
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-accent fill-current" />
                      <span className="font-semibold">{agent.rating}</span>
                      <a
                        href="#reviews"
                        className="text-muted-foreground hover:underline"
                      >
                        ({agent.reviews} reviews)
                      </a>
                    </div>
                    <AskAgentDialog agent={agent} pkg={pkg} />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold font-headline mb-4">
                  Itinerary
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {dummyItinerary
                    .slice(0, parseInt(pkg.duration))
                    .map((item) => (
                      <AccordionItem value={`item-${item.day}`} key={item.day}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-3">
                            <Badge className="h-8 w-8 flex items-center justify-center shrink-0">
                              {item.day}
                            </Badge>
                            <span className="font-bold text-left">
                              {item.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pl-14">
                          {item.description}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>

              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold font-headline mb-4">
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-headline mb-4">
                    What's Excluded
                  </h3>
                  <ul className="space-y-2">
                    {exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <X className="h-5 w-5 text-red-500 mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-6" id="reviews">
                <h3 className="text-xl font-bold font-headline mb-4">
                  What Travelers Are Saying
                </h3>
                <div className="space-y-4">
                  {testimonials.slice(0, 2).map((testimonial) => (
                    <Card
                      key={testimonial.id}
                      className="border-none shadow-lg"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12 border-2 border-accent">
                            <AvatarImage
                              src={testimonial.avatar}
                              data-ai-hint={testimonial.hint}
                            />
                            <AvatarFallback>
                              {testimonial.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold font-headline text-foreground">
                                {testimonial.name}
                              </p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 text-accent fill-current"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="italic text-sm text-muted-foreground">
                              "{testimonial.quote}"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Guest User Benefits Section */}
              {!user && (
                <div className="mb-6 p-6 bg-gradient-to-r from-primary/10 to-blue-100 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-bold mb-3 text-center">
                    Sign up to unlock exclusive benefits!
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                        <Heart className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Save to Wishlist</p>
                      <p className="text-xs text-muted-foreground">
                        Keep track of your favorite packages
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-sm font-medium">Secure Booking</p>
                      <p className="text-xs text-muted-foreground">
                        Escrow payment protection
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium">Direct DMC Contact</p>
                      <p className="text-xs text-muted-foreground">
                        Chat with local experts
                      </p>
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <LoginDialog />
                  </div>
                </div>
              )}
            </div>
          </main>
          <footer className="fixed bottom-0 left-0 right-0 w-full bg-background/80 backdrop-blur-sm border-t">
            <div className="mx-auto max-w-4xl p-4 space-y-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <label htmlFor="travelers" className="font-medium">
                    Travelers:
                  </label>
                  <select
                    id="travelers"
                    value={travelers}
                    onChange={(e) => setTravelers(parseInt(e.target.value))}
                    className="px-2 py-1 rounded border bg-background"
                  >
                    {Array.from(
                      {
                        length: Math.min((pkg as any).groupSize?.max || 8, 12),
                      },
                      (_, i) => i + 1,
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "person" : "people"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="travel-date" className="font-medium">
                    Date:
                  </label>
                  <input
                    id="travel-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="px-2 py-1 rounded border bg-background text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="flex-1 text-lg"
                  onClick={handleBookNow}
                >
                  <ShieldCheck className="mr-2 h-5 w-5" />
                  Book Now - ₹{(
                    parseInt(pkg.price.replace(/,/g, "")) * travelers
                  ).toLocaleString()}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist(pkg.id) ? "text-primary fill-current" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0">
          <VisuallyHidden>
            <DialogTitle>Package Gallery - {pkg.title}</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white"
              onClick={prevImage}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 hover:bg-black/70 text-white"
              onClick={nextImage}
            >
              <ArrowLeft className="h-6 w-6 rotate-180" />
            </Button>

            <Image
              src={packageImages[currentImageIndex]}
              alt={`${pkg.title} gallery image ${currentImageIndex + 1}`}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
              data-ai-hint={`${pkg.hint} ${currentImageIndex % 2 === 0 ? "scenery" : "activity"}`}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {packageImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogTitle>Enter Payment Details</DialogTitle>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              className="w-full border rounded p-2"
              value={paymentName}
              onChange={e => setPaymentName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded p-2"
              value={paymentEmail}
              onChange={e => setPaymentEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Payment Details (Card/UPI)"
              className="w-full border rounded p-2"
            />
          </div>
          <DialogFooter>
            <Button onClick={() => { setShowPayment(false); alert('Payment processed!'); }}>Pay Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Login Enforcement Modal */}
      <LoginEnforcementModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onLoginSuccess={handleLoginSuccess}
        title="Please login to book your package"
        description={`Sign in to book "${pkg.title}" and enjoy secure payments, direct agent communication, and more.`}
      />
    </div>
  );
}
