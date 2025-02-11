import { convertToCoreMessages, generateText, streamText, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export async function POST(request: Request) {
  const body = await request.json();

  const { messages, currentOffer } = body;

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are a helpful assistant specializing in real estate offers.
    Provide concise summaries of changes made to the offer without repeating the entire document.
    Here is the current offer:\n\n${currentOffer}`,
    messages: convertToCoreMessages(messages),
    tools: {
      updateOffer: tool({
        description: "Update the real estate offer based on user feedback",
        parameters: z.object({
          currentOffer: z.string().describe("The current offer content"),
          feedback: z
            .string()
            .describe("User feedback to incorporate into the offer"),
        }),
        execute: async ({
          currentOffer,
          feedback,
        }: {
          currentOffer?: string;
          feedback: string;
        }) => {
          try {
            const prompt = `
            You are an AI assistant specializing in updating real estate offers based on user feedback.
            Modify the offer to incorporate the user's feedback while maintaining the overal structure and professional tone of the document.
            Respond ONLY with the updated offer in markdown format, without any additional commentary.

            Current offer:
            ${currentOffer}

            User feedback:
            ${feedback}

            Updated offer:`;

            const { text: updatedOffer } = await generateText({
              model: openai("gpt-4-turbo"),
              prompt,
            });

            if (!updatedOffer) {
              throw new Error("Failed to generate offer");
            }

            return {
              confirmation: `I've updated the offer based on your feedback: "${feedback}"`,
              updatedOffer: updatedOffer,
            };
          } catch (error) {
            console.error("Error updating offer:", error);
            throw new Error(
              "An error occurred while updating the offer. Please try again."
            );
          }
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
