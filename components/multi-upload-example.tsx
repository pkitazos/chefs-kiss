"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

export function MultiUploadExample() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; url: string; type: string }>
  >([]);

  const { startUpload, isUploading } = useUploadThing("multipleFileUploader", {
    onClientUploadComplete: (res) => {
      if (res) {
        const newFiles = res.map((file) => ({
          name: file.name,
          url: file.url,
          type: file.type,
        }));
        setUploadedFiles((prev) => [...prev, ...newFiles]);
        setFiles([]);
      }
    },
    onUploadError: (error) => {
      alert(`Upload failed: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    await startUpload(files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearUploaded = () => {
    setUploadedFiles([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multiple File Upload</CardTitle>
        <CardDescription>
          Upload multiple images and PDFs (max 5 images, 3 PDFs)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Input
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-sm text-muted-foreground mt-2">
            Images: max 4MB each | PDFs: max 8MB each
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Selected Files:</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles([])}
              >
                Clear all
              </Button>
            </div>
            <div className="space-y-2">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg bg-muted p-3"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {file.type.startsWith("image/") ? "Image" : "PDF"}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(idx)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading}
          className="w-full"
        >
          {isUploading ? "Uploading..." : `Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
        </Button>

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm">
                Uploaded Files ({uploadedFiles.length})
              </p>
              <Button variant="ghost" size="sm" onClick={clearUploaded}>
                Clear
              </Button>
            </div>
            <div className="grid gap-2">
              {uploadedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                      <span className="text-xs font-medium">PDF</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View file
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
