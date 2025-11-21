"use client";

import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Upload, X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface UploadedFile {
  name: string;
  content: string;
}

interface FileUploadProps {
  onAutoGenerate: (updatedOffer: string) => void;
  currentOffer: string;
  onLoadingChange: (isLoading: boolean) => void;
}

function FileUpload({
  onAutoGenerate,
  currentOffer,
  onLoadingChange,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    onLoadingChange(isGenerating);
  }, [isGenerating, onLoadingChange]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (files) {
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check if the file size is greater than 5MB
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB limit.`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file type
        const validTypes = [
          "text/plain",
          "text/html",
          "text/markdown",
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];
        const validExtensions = [
          ".txt",
          ".html",
          ".md",
          ".markdown",
          ".pdf",
          ".docx",
        ];
        const fileName = file.name.toLowerCase();

        const isValidType =
          validTypes.includes(file.type) ||
          validExtensions.some((ext) => fileName.endsWith(ext));

        if (!isValidType) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a supported file type. Accepted: PDF, DOCX, TXT, HTML, MD`,
            variant: "destructive",
          });
          continue;
        }

        try {
          let content = "";

          // For PDF and DOCX, use the API endpoint to extract text
          if (
            file.type === "application/pdf" ||
            fileName.endsWith(".pdf") ||
            file.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileName.endsWith(".docx")
          ) {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/files/extract-text", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(
                errorData.error || `Failed to process ${file.name}`
              );
            }

            const data = await response.json();
            content = data.text;
          } else {
            // For text, HTML, and markdown files, read directly
            content = await file.text();
          }

          if (!content || content.trim().length === 0) {
            toast({
              title: "Empty file",
              description: `${file.name} appears to be empty.`,
              variant: "destructive",
            });
            continue;
          }

          newFiles.push({ name: file.name, content });
        } catch (error) {
          console.error("Error reading file:", error);
          toast({
            title: "Error reading file",
            description:
              error instanceof Error
                ? error.message
                : `Failed to read ${file.name}.`,
            variant: "destructive",
          });
        }
      }
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);

      // Reset the file input to allow uploading the same file again
      const fileInput = document.getElementById(
        "file-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleAutoGenerateOffer = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload at least one file to generate an offer.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    onLoadingChange(true);

    try {
      // Combine all uploaded file contents
      const fileContents = uploadedFiles
        .map((file) => `File: ${file.name}\n${file.content}`)
        .join("\n\n---\n\n");

      // Call the dedicated generate API endpoint
      const response = await fetch("/api/offers/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentOffer: currentOffer,
          fileContents: fileContents,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || "Failed to generate offer from files"
        );
      }

      const data = await response.json();

      if (data.updatedOffer) {
        onAutoGenerate(data.updatedOffer);
        toast({
          title: "Offer generated successfully",
          description: `Offer updated based on ${uploadedFiles.length} file(s).`,
        });
      } else {
        throw new Error("No updated offer received from server");
      }
    } catch (error) {
      console.error("Error generating offer from files:", error);
      toast({
        title: "Error generating offer",
        description:
          error instanceof Error
            ? error.message
            : "Failed to generate offer from files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      onLoadingChange(false);
    }
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Accepted formats: PDF, DOCX, TXT, HTML, MD • Max file size: 5MB
            </Label>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => document.getElementById("file-upload")?.click()}
                variant="outline"
                className="w-1/2"
                disabled={isGenerating}
              >
                <Upload className="h-4 w-4 mr-2" /> Upload Files
              </Button>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.html,.md,.markdown,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/html,text/markdown"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button
                onClick={handleAutoGenerateOffer}
                className="w-1/2"
                disabled={isGenerating || uploadedFiles.length === 0}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  "Auto Generate"
                )}
              </Button>
            </div>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Uploaded Files ({uploadedFiles.length}):
              </p>
              <div className="space-y-1">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-2 bg-muted rounded-md"
                  >
                    <span className="text-sm truncate flex-1">{file.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 ml-2"
                      onClick={() => handleRemoveFile(file.name)}
                      disabled={isGenerating}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default FileUpload;
