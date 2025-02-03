import { auth } from "@clerk/nextjs/server";
import { offersTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { db } from "./db";

export async function getOffersForCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const offers = await db
    .select()
    .from(offersTable)
    .where(eq(offersTable.userId, userId));

  return offers;
}

export async function getOfferById(offerId: string) {
  const offer = await db.query.offersTable.findFirst({
    where: eq(offersTable.id, offerId),
  });

  return offer;
}
