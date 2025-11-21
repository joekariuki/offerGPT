import OffersListSection from "@/components/OffersListSection";
import { Offer } from "@/server/db/schema";
import { getOffersForCurrentUser } from "@/server/queries";

export const dynamic = "force-dynamic";

export default async function OffersPage() {
  let offers: Offer[] = [];

  try {
    offers = await getOffersForCurrentUser();
  } catch (error) {
    console.error("Error fetching offers:", error);
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white">
      <OffersListSection initialOffers={offers} />
    </div>
  );
}

