"use client";

import { Offer } from "@/server/db/schema";
import React, { useState } from "react";
import { Button } from "./ui/button";
import OfferList from "./OfferList";

interface OffersListSectionProps {
  initialOffers: Offer[];
}

function OffersListSection({ initialOffers }: OffersListSectionProps) {
  const [offers] = useState<Offer[]>(initialOffers);

  const handleNewOfferClick = () => {};

  return (
    <div className="w-full max-w-3xl mx-auto">
      <header className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-primary">AI Offers</h1>
        {/* New offer button */}
        <Button size="lg" onClick={handleNewOfferClick}>
          New
        </Button>
      </header>
      {/* Offer list: shows a list of all created offers */}
      <OfferList offers={offers} />
      {/* TODO: Add create offer modal */}
    </div>
  );
}

export default OffersListSection;
