import OfferDetail from "@/components/OfferDetail";
import { getOfferById } from "@/server/queries";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

export default async function OfferDetailPage({
  params,
}: {
  params: { offerId: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const offer = await getOfferById(params.offerId);

  console.log("offer", offer);

  if (!offer) {
    notFound();
  }

  return <OfferDetail offer={offer} />;
}
