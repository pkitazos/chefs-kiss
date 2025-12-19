"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing/client";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { FieldGroup, FieldLabel } from "./ui/field";

export function UploadExample() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res) {
        const urls = res.map((file) => file.url);
        setUploadedUrls(urls);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Upload Example</CardTitle>
        <CardDescription>
          Upload images using Uploadthing (requires authentication)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldGroup>
          <FieldLabel htmlFor="file-upload">Select Image</FieldLabel>
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <p className="text-sm text-muted-foreground">Max file size: 4MB</p>
        </FieldGroup>

        {files.length > 0 && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium mb-2">Selected files:</p>
            <ul className="text-sm space-y-1">
              {files.map((file, idx) => (
                <li key={idx}>
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>

        {uploadedUrls.length > 0 && (
          <div className="space-y-4">
            <p className="font-medium text-sm">Uploaded successfully!</p>
            <div className="grid gap-4">
              {uploadedUrls.map((url, idx) => (
                <div key={idx} className="space-y-2">
                  <img
                    src={url}
                    alt={`Uploaded ${idx + 1}`}
                    className="rounded-lg max-h-64 object-cover"
                  />
                  <div className="flex items-center gap-2">
                    <Input value={url} readOnly className="text-xs" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(url)}
                    >
                      Copy
                    </Button>
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
