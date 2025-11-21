"use client";

import { useToast } from "@/hooks/use-toast";
import { OFFER_MARKDOWN } from "@/lib/constants";
import { Offer } from "@/server/db/schema";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, Pencil, Check, X, Download, Save, Copy } from "lucide-react";
import Chat from "./Chat";
import { Label } from "./ui/label";
import OfferPreview from "./OfferPreview";
import FileUpload from "./FileUpload";

interface OfferDetailProps {
  offer: Offer;
}

function OfferDetail({ offer }: OfferDetailProps) {
  const [offerContent, setOfferContent] = useState(
    offer.content || OFFER_MARKDOWN
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedClientName, setEditedClientName] = useState(offer.clientName);
  const [editedClientAddress, setEditedClientAddress] = useState(
    offer.clientAddress
  );

  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

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
          clientName: editedClientName,
          clientAddress: editedClientAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save offer");
      }

      setIsEditing(false);
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
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedClientName(offer.clientName);
    setEditedClientAddress(offer.clientAddress);
  };

  const handleEditSave = () => {
    setEditedClientName(editedClientName);
    setEditedClientAddress(editedClientAddress);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      // Ensure content is never empty - use default template if needed
      const contentToCopy = offerContent.trim() || OFFER_MARKDOWN;

      // Create the markdown content with header
      let markdownContent = "";

      if (editedClientName || editedClientAddress) {
        markdownContent += `# ${editedClientName || "Untitled Offer"}\n\n`;
        if (editedClientAddress) {
          markdownContent += `${editedClientAddress}\n\n`;
        }
        markdownContent += "---\n\n";
      }

      markdownContent += contentToCopy;

      // Copy to clipboard
      await navigator.clipboard.writeText(markdownContent);

      toast({
        title: "Offer copied to clipboard",
        description: "The offer text has been copied to your clipboard.",
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast({
        title: "Error copying to clipboard",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    try {
      // Ensure content is never empty - use default template if needed
      const contentToExport = offerContent.trim() || OFFER_MARKDOWN;

      // Create the markdown content with header
      let markdownContent = "";

      if (editedClientName || editedClientAddress) {
        markdownContent += `# ${editedClientName || "Untitled Offer"}\n\n`;
        if (editedClientAddress) {
          markdownContent += `${editedClientAddress}\n\n`;
        }
        markdownContent += "---\n\n";
      }

      markdownContent += contentToExport;

      // Create a blob with the markdown content
      const blob = new Blob([markdownContent], { type: "text/markdown" });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const filename = editedClientName
        ? `${editedClientName
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase()}_offer.md`
        : "offer.md";

      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Markdown exported successfully",
        description: "Your offer has been exported as a markdown file.",
      });
    } catch (error) {
      console.error("Error exporting markdown:", error);
      toast({
        title: "Error exporting markdown",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        {isEditing ? (
          <div className="flex items-center  justify-center gap-4">
            <div className="space-x-4 flex flex-row items-center">
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="clientName" className="text-xs">
                  Client Name
                </Label>
                <Input
                  id="clientName"
                  value={editedClientName}
                  onChange={(e) => setEditedClientName(e.target.value)}
                  disabled={isSaving}
                  placeholder="Client Name"
                  className="text-lg"
                />
              </div>

              <div className="w-full flex flex-col gap-2">
                <Label htmlFor="clientAddress" className="text-xs">
                  Client Address
                </Label>
                <Input
                  id="clientAddress"
                  value={editedClientAddress}
                  onChange={(e) => setEditedClientAddress(e.target.value)}
                  disabled={isSaving}
                  placeholder="Client Address"
                  className="text-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleEditSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">
              {[editedClientName, editedClientAddress].join(" - ") ||
                "Untitled Offer"}
            </h1>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-1 h-4 w-4" />
            )}
            Save
          </Button>
          <Button onClick={handleCopy} variant="outline" disabled={isCopying}>
            {isCopying ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Copy className="mr-1 h-4 w-4" />
            )}
            Copy
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-1 h-4 w-4" />
            )}
            Download Markdown
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <Chat
            offerContent={offerContent}
            onOfferUpdate={handleOfferUpdate}
            onLoadingChange={handleChatLoadingChange}
          />
          {/* File upload component */}
          <FileUpload
            onAutoGenerate={handleOfferUpdate}
            currentOffer={offerContent}
            onLoadingChange={handleFileUploadingChange}
          />
        </div>

        <OfferPreview content={offerContent} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default OfferDetail;
