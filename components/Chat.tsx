import React, { useCallback } from "react";

interface ChatProps {
  offerContent: string;
  onOfferUpdate: (updatedOffer: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

interface OfferData {
  confirmation: string;
  updatedOffer: string;
}

export default function Chat({
  offerContent,
  onOfferUpdate,
  onLoadingChange,
}: ChatProps) {
  // TODO: Implement chat component
  // const handleNewMessage = useCallback((messages: Mes))
  return <div>Chat</div>;
}
