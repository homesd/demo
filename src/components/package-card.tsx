"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/auth/auth-context";
import { useWishlist } from "@/components/context/wishlist-context";
import { useCart } from "@/components/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { LoginEnforcementModal } from "@/components/auth/login-enforcement-modal";
import { packages as allPackages, agents } from "@/lib/data";
import { useRouter } from "next/navigation";

type Package = (typeof allPackages)[0];

export const PackageCard = ({ pkg }: { pkg: Package }) => {
  const agent = agents.find((a) => a.id === pkg.agentId);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();
  const { items, addToCart } = useCart();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  // Check if this package is already in the cart
  const isInCart = items.some((item) => item.package.id === pkg.id);

  const handleWishlistToggle = () => {
    const wasWishlisted = isInWishlist(pkg.id);
    const success = toggleWishlist(pkg.id);
    if (!success) {
      toast({
        title: "Create account to save packages",
        description:
          "Sign up or log in to save packages to your wishlist and access them anytime.",
        variant: "default",
      });
    } else {
      // Use the previous state to determine the correct message
      toast({
        title: wasWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
        description: `"${pkg.title}" has been ${wasWishlisted ? "removed from" : "added to"} your wishlist.`,
      });
    }
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

  return (
    <>
    <Card className="overflow-hidden border-none shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col">
      <CardContent className="p-0 flex flex-col flex-grow">
        <div className="relative">
          <Link href={`/packages/${pkg.slug}`} passHref>
            <Image
              src={pkg.image}
              alt={pkg.title}
              width={600}
              height={400}
              className="h-48 w-full object-cover"
              data-ai-hint={pkg.hint}
            />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 rounded-full bg-background/70 hover:bg-background"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist(pkg.id)
                  ? "text-primary fill-current"
                  : "text-foreground"
              }`}
            />
          </Button>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <Link href={`/packages/${pkg.slug}`} passHref>
            <h3 className="font-headline text-lg font-bold truncate hover:underline">
              {pkg.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{pkg.destination}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{pkg.duration}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-accent fill-current" />
              <span className="font-bold">{pkg.rating}</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              <span className="text-sm font-normal" style={{ fontFamily: "'Noto Sans', 'Roboto', 'Arial', 'Segoe UI', sans-serif" }}>From ₹</span>
              <span style={{ fontFamily: "'Noto Sans', 'Roboto', 'Arial', 'Segoe UI', sans-serif" }}>{pkg.price}</span>
            </div>
          </div>

          {/* Cart Button for logged-in users */}
          {user && (
            <div className="mt-3 flex gap-2">
              {isInCart ? (
                <Link href="/cart" className="flex-1">
                  <Button size="sm" className="w-full text-xs" variant="secondary">
                    Go to Cart
                  </Button>
                </Link>
              ) : (
                <Button size="sm" className="flex-1 text-xs" onClick={handleBookNow}>
                  Book Now
                </Button>
              )}
            </div>
          )}

          {/* Quick actions for guest users */}
          {!user && (
            <div className="mt-3 flex gap-2">
              <Link href={`/packages/${pkg.slug}`} className="flex-1">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  View Details
                </Button>
              </Link>
              <Button
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setShowLoginModal(true)}
              >
                Book Now
              </Button>
            </div>
          )}

          <div className="border-t my-4"></div>
          <div className="flex items-center gap-3 mt-auto">
            {agent && (
              <Link href={`/agents/${agent.id}`} passHref>
                <Avatar className="w-10 h-10 border-2 border-primary">
                  <AvatarImage src={agent.logo} data-ai-hint={agent.hint} />
                  <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            )}
            {agent && (
              <div>
                <Link href={`/agents/${agent.id}`} passHref>
                  <p className="font-semibold text-sm hover:underline">
                    {agent.name}
                  </p>
                </Link>
                {/* Increase opacity for 'Tour Operator' text */}
                <p className="text-xs" style={{ opacity: 0.85 }}>
                  Tour Operator
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Login Enforcement Modal */}
    <LoginEnforcementModal
      open={showLoginModal}
      onOpenChange={setShowLoginModal}
      onLoginSuccess={handleLoginSuccess}
      title="Please login to book your package"
      description={`Sign in to book "${pkg.title}" and enjoy secure payments, direct agent communication, and more.`}
    />
    </>
  );
};
