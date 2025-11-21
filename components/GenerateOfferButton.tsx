"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function GenerateOfferButton() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isSignedIn) {
      router.push("/offers");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <Button size="lg" onClick={handleClick} className="text-lg px-8 py-6">
      Generate Offer
    </Button>
  );
}

