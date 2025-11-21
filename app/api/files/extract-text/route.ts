import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const fileType = file.type;
    const fileName = file.name;
    let extractedText = "";

    // Handle different file types
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      // Handle PDF files
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (
      fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      // Handle DOCX files
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (
      fileType === "text/plain" ||
      fileType === "text/html" ||
      fileType === "text/markdown" ||
      fileName.endsWith(".md") ||
      fileName.endsWith(".markdown")
    ) {
      // Handle text, HTML, and markdown files
      extractedText = await file.text();
    } else {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${fileType}. Supported types: PDF, DOCX, TXT, HTML, MD`,
        },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from file. The file may be empty or corrupted." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text: extractedText,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Error extracting text from file:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while processing the file.",
      },
      { status: 500 }
    );
  }
}

