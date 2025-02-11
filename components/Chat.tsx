"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Message, useChat } from "ai/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface ChatProps {
  offerContent: string;
  onOfferUpdate: (updatedOffer: string) => void;
  onLoadingChange: (loading: boolean) => void;
}

interface OfferData {
  confirmation: string;
  updatedOffer: string;
}

/**
 * A component that displays a chat interface to interact with the AI assistant to
 * update the real estate offer.
 */
export default function Chat({
  offerContent,
  onOfferUpdate,
  onLoadingChange,
}: ChatProps) {
  // The latest offer content that is being updated
  const [latestOffer, setLatestOffer] = useState(offerContent);

  // Indicates whether the chat is processing a new message
  const [isProcessing, setIsProcessing] = useState(false);

  // Ref to the scroll area element
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  /**
   * Handles an offer update from the chat messages.
   * @param newOffer The new offer content.
   */
  const handleOfferUpdate = useCallback(
    (newOffer: string) => {
      onOfferUpdate(newOffer);
      setLatestOffer(newOffer);
    },
    [onOfferUpdate]
  );

  /**
   * Handles new messages from the chat.
   * @param messages The new messages.
   */
  const handleNewMessage = useCallback(
    (messages: Message[]) => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.role === "assistant" && message.toolInvocations) {
          for (const toolInvocation of message.toolInvocations) {
            if (
              toolInvocation.toolName === "updateOffer" &&
              toolInvocation.state === "result"
            ) {
              const result = toolInvocation.result as OfferData;

              if (result.updatedOffer) {
                handleOfferUpdate(result.updatedOffer);
                return;
              }
            }
          }
        }
      }
    },
    [handleOfferUpdate]
  );

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      // The API endpoint to interact with the AI assistant
      api: "/api/chat",

      // The initial messages to display in the chat
      initialMessages: [
        {
          id: "1",
          role: "system",
          content:
            "You are a helpful assistant specializing in real estate offers.",
        },
        {
          id: "2",
          role: "assistant",
          content:
            "Hello! I'm here to help you update your real estate offer. What changes would you like to make?",
        },
      ],

      // The body of the request to the AI assistant
      body: {
        currentOffer: latestOffer,
      },

      // The callback when the chat is finished
      onFinish: () => {
        setIsProcessing(false);
        onLoadingChange(false);
      },
    });

  useEffect(() => {
    // Handle new messages from the chat
    handleNewMessage(messages);
  }, [messages, handleNewMessage]);

  useEffect(() => {
    // Update the loading state of the chat
    onLoadingChange(isProcessing || isLoading);
  }, [isProcessing, isLoading, onLoadingChange]);

  useEffect(() => {
    // Update the latest offer content when the offer content changes
    console.log("Updating latest offer:", latestOffer);
    setLatestOffer(offerContent);
  }, [offerContent, latestOffer]);

  /**
   * Handles the form submission of the chat.
   * @param e The form event.
   */
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    onLoadingChange(true);

    console.log("Submitting form chat messages:", input);
    console.log("Current offer:", input);
    handleSubmit(e, {
      body: {
        currentOffer: latestOffer,
      },
    });
  };

  // The display messages are the messages without the first message
  const displayMessages = messages.slice(1);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Chat History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4 mb-4" ref={scrollAreaRef}>
          {displayMessages.map((message: Message) => (
            <div key={message.id} className="mb-4">
              <p
                className={cn(
                  "font-semibold",
                  message.role === "user" ? "text-gray-600" : "text-primary"
                )}
              >
                {message.role === "user" ? "You: " : "AI: "}
              </p>

              {message.content ? (
                <p
                  className={cn(
                    "mt-1",
                    message.role === "user" ? "text-gray-600" : "text-primary"
                  )}
                >
                  {message.content}
                </p>
              ) : message.toolInvocations &&
                message.toolInvocations.length > 0 ? (
                <p className="mt-1 italic text-muted-foreground">
                  Updating offer...
                </p>
              ) : null}
            </div>
          ))}
        </ScrollArea>
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center space-x-2"
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-grow"
          />
          <Button type="submit" disabled={isProcessing || isLoading}>
            {isProcessing || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
