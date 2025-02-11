import { Offer } from "@/server/db/schema";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

interface OfferListProps {
  offers: Offer[];
}

function OfferList({ offers }: OfferListProps) {
  return (
    <div className="space-y-2">
      {offers.map((offer) => (
        <Link key={offer.id} href={`/offers/${offer.id}`} className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors border border-border">
            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-semibold">{offer.clientName}</span>
                {/* Dot separator */}
                <span className="mx-2">•</span>
                <span className="text-sm text-muted-foreground truncate">
                  {offer.clientAddress || "No address"}
                </span>
              </div>
              {offer.content && (
                <span className="ml-2 px-2 py-1 bg-primary/80 text-white rounded-full text-sm flex flex-row items-center space-x-2">
                  Generated <Sparkles className="h-4 w-4 ml-1" />
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default OfferList;
