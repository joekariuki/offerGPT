"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";

// Offer type without client name and address
interface Offer {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
interface CreateOfferModalProps {
  isVisible: boolean;
  onClose: () => void;
}

function CreateOfferModal({ onClose, isVisible }: CreateOfferModalProps) {
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const hanldeCreate = async () => {
    if (!clientName.trim() || !clientAddress.trim()) {
      // Updated validation
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // API request to create offer
      const response = await axios.post<Offer>("/api/offers", {
        clientName,
        clientAddress,
        content: "", // TODO: Pass content data to request
      });

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Offer created successfully.",
        });

        onClose();
        router.push(`/offers/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error creating offer:", error);

      toast({
        title: "Error",
        description: "Failed to create offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create offer</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client name"
          className="w-full mb-4"
        />
        <Input
          type="text"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
          placeholder="Enter client address"
          className="w-full mb-4"
        />

        {/* // TODO: Add content field */}

        <div className="flex justify-end space-x-2">
          <Button onClick={hanldeCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateOfferModal;
