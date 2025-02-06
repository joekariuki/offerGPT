import { db } from "@/server/db";
import { offersTable } from "@/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

  const { clientName, clientAddress } = body;

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
