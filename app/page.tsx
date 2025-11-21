import { GenerateOfferButton } from "@/components/GenerateOfferButton";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <section className="flex-1 flex items-center justify-center w-full max-w-4xl mx-auto px-4 text-center">
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
      <footer className="w-full border-t border-gray-200 py-4">
        <div className="w-full max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Open source available on{" "}
            <a
              href="https://github.com/joekariuki/offerGPT"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
