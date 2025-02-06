import OfferDetail from "@/components/OfferDetail";
import { getOfferById } from "@/server/queries";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ offerId: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Await the params to get the offerId
  const { offerId } = await params;

  // Fetch the offer by ID
  const offer = await getOfferById(offerId);

  if (!offer) {
    notFound();
  }

  return <OfferDetail offer={offer} />;
}
