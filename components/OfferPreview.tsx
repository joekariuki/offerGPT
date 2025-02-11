import React from "react";
import { Card, CardContent } from "./ui/card";
import ReactMarkdown from "react-markdown";
import { Loader2 } from "lucide-react";

interface OfferPreviewProps {
  content: string;
  isLoading: boolean;
}

function OfferPreview({ content, isLoading }: OfferPreviewProps) {
  return (
    <Card className="w-full h-[550px] relative py-6 overflow-y-scroll">
      <CardContent>
        Offer Preview
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => (
              <h1 className="text-2xl font-bold mb-4" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="text-xl font-semibold mb-3" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-lg font-medium mb-2" {...props} />
            ),
            p: ({ ...props }) => <p className="mb-4" {...props} />,
            ul: ({ ...props }) => (
              <ul className="list-disc pl-5 mb-4" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-5 mb-4" {...props} />
            ),
            li: ({ ...props }) => <li className="mb-1" {...props} />,
            strong: ({ ...props }) => (
              <strong className="font-semibold" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </CardContent>
      {isLoading && (
        <div className="absolute inset-0 bg-transparent backdrop-blur flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </Card>
  );
}

export default OfferPreview;
