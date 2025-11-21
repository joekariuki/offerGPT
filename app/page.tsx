import { GenerateOfferButton } from "@/components/GenerateOfferButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <section className="w-full max-w-4xl mx-auto px-4 text-center">
        <div className="space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Generate AI-Powered
            <br />
            <span className="text-primary">Real Estate Offers</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
            Create professional, personalized real estate offers in seconds with
            the power of artificial intelligence.
          </p>
          <div className="pt-4">
            <GenerateOfferButton />
          </div>
        </div>
      </section>
    </div>
  );
}
