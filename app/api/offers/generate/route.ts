import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { z } from "zod";

const generateOfferSchema = z.object({
  currentOffer: z.string(),
  fileContents: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = generateOfferSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors },
        { status: 400 }
      );
    }

    const { currentOffer, fileContents } = parsed.data;

    const prompt = `You are an AI assistant specializing in updating real estate offers based on information from uploaded documents.
Analyze the following uploaded files and extract relevant information to update the real estate offer.
Use the information from these files to populate or update the offer letter with accurate details.
Maintain the overall structure and professional tone of the document.
Respond ONLY with the updated offer in markdown format, without any additional commentary.

Current offer:
${currentOffer}

Uploaded Files Content:
${fileContents}

Updated offer:`;

    const { text: updatedOffer } = await generateText({
      model: openai("gpt-4-turbo"),
      prompt,
    });

    if (!updatedOffer) {
      return NextResponse.json(
        { error: "Failed to generate offer" },
        { status: 500 }
      );
    }

    return NextResponse.json({ updatedOffer });
  } catch (error) {
    console.error("Error generating offer from files:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while generating the offer.",
      },
      { status: 500 }
    );
  }
}

