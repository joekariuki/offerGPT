"use client";

import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Loader2, Upload } from "lucide-react";
import { Input } from "./ui/input";

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

        if (file.type !== "text/plain" && file.type !== "text/html") {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a text or HTML file.`,
            variant: "destructive",
          });
          continue;
        }

        try {
          const content = await file.text();
          newFiles.push({ name: file.name, content });
        } catch (error) {
          toast({
            title: "Error reading file",
            description: `Failed to read ${file.name}.`,
            variant: "destructive",
          });
        }
      }
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleAutoGenerateOffer = async () => {};
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
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
              accept=".txt,.html"
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
      </CardContent>
    </Card>
  );
}

export default FileUpload;
