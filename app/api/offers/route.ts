import { db } from "@/server/db";
import { offersTable } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";

const newOfferSchema = z.object({
  clientName: z.string(),
  clientAddress: z.string(),
  content: z.string().optional(),
});

const updateOfferSchema = newOfferSchema.extend({
  id: z.string().uuid(),
});

// Helper function to check authentication
async function checkAuth() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("User not authenticated", { status: 401 });
  }

  return userId;
}

// GET all offers for authenticated user
export async function GET() {
  const userId = await checkAuth();

  if (userId instanceof NextResponse) return userId;

  const offers = await db
    .select()
    .from(offersTable)
    .where(eq(offersTable.userId, userId));

  return NextResponse.json(offers);
}

// POST to create a new offer
export async function POST(request: Request) {
  const userId = await checkAuth();

  if (userId instanceof NextResponse) return userId;

  const body = await request.json();

  // Validate the request body
  const parsedOffer = newOfferSchema.safeParse(body);

  // Return error if validation fails
  if (!parsedOffer.success) {
    return NextResponse.json(
      { error: parsedOffer.error.errors },
      { status: 400 }
    );
  }

  const { clientName, clientAddress } = parsedOffer.data;

  if (!clientName || !clientAddress) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const newOffer = await db
    .insert(offersTable)
    .values({
      userId,
      clientName,
      clientAddress,
    })
    .returning();

  return NextResponse.json(newOffer[0], { status: 201 });
}

// PATCH to update an offer
export async function PATCH(request: Request) {
  // Check authentication
  const userId = await checkAuth();

  if (userId instanceof NextResponse) return userId;

  // Parse the request body
  const body = await request.json();

  // Validate the request body
  const parsedUpdatedOffer = updateOfferSchema.safeParse(body);

  // Return error if validation fails
  if (!parsedUpdatedOffer.success) {
    return NextResponse.json(
      { error: parsedUpdatedOffer.error.errors },
      { status: 400 }
    );
  }

  const { id, content, clientName, clientAddress } = parsedUpdatedOffer.data;

  const updatedOffer = await db
    .update(offersTable)
    .set({
      content,
      clientName,
      clientAddress,
    })
    .where(eq(offersTable.id, id))
    .returning();

  if (updatedOffer.length === 0) {
    return new NextResponse("Offer not found", { status: 404 });
  }

  return NextResponse.json(updatedOffer[0]);
}
