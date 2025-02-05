"use client";

import { useToast } from "@/hooks/use-toast";
import { OFFER_MARKDOWN } from "@/lib/constants";
import { Offer } from "@/server/db/schema";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Chat from "./Chat";

interface OfferDetailProps {
  offer: Offer;
}

function OfferDetail({ offer }: OfferDetailProps) {
  const [offerContent, setOfferContent] = useState(
    offer.content || OFFER_MARKDOWN
  );

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/offers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: offer.id,
          content: offerContent,
          clientName: offer.clientName,
          clientAddress: offer.clientAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save offer");
      }

      toast({
        title: "Offer saved successfully",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.log("Error saving offer:", error);
      toast({
        title: "Error saving offer",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
  };

  const handleOfferUpdate = (updatedOffer: string) => {
    setOfferContent(updatedOffer);
  };

  const handleChatLoadingChange = (loading: boolean) => {
    setIsChatLoading(loading);
  };

  const handleFileUploadingChange = (loading: boolean) => {
    setIsFileUploading(loading);
  };

  const isLoading = isChatLoading || isFileUploading;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {[offer.clientName, offer.clientAddress].join(" - ") ||
            "Untitled Offer"}
        </h1>
      </div>

      <div>
        <Button onClick={handleSave} className="mr-2" disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save
        </Button>
        <Button onClick={handleExport} variant="outline" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Export
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <Chat
            offerContent={offerContent}
            onOfferUpdate={handleOfferUpdate}
            onLoadingChange={handleChatLoadingChange}
          />
        </div>
      </div>
    </div>
  );
}

export default OfferDetail;
