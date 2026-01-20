"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing/client";
import type { OurFileRouter } from "@/lib/uploadthing/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  IconFileDescription,
  IconCircleCheck,
  IconX,
  IconUpload,
  IconLoader2,
  IconInfoCircle,
} from "@tabler/icons-react";

// Unified file types accepted by all vendor upload fields
const ACCEPTED_FILE_TYPES =
  ".pdf,.doc,.docx,.png,.jpg,.jpeg,.heic,.webp,image/heic";

type FileUploadFieldProps = {
  label: string;
  description?: string;
  endpoint: keyof OurFileRouter;
  onUploadComplete: (url: string) => void;
  onFileSelect?: (hasFile: boolean) => void;
  error?: string;
  value?: string;
  required?: boolean;
};

export function FileUploadField({
  label,
  description,
  endpoint,
  onUploadComplete,
  onFileSelect,
  error,
  value,
  required,
}: FileUploadFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | undefined>(value);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      if (res?.[0]?.ufsUrl) {
        setUploadedUrl(res[0].ufsUrl);
        onUploadComplete(res[0].ufsUrl);
        setSelectedFile(null);
        onFileSelect?.(false);
      }
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect?.(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await startUpload([selectedFile]);
  };

  const handleRemove = () => {
    setUploadedUrl(undefined);
    setSelectedFile(null);
    onUploadComplete("");
    onFileSelect?.(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <FieldGroup>
      <Field>
        <div className="flex w-max items-center gap-1.5">
          <FieldLabel required={required}>{label}</FieldLabel>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="ml-1.5 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Upload help"
              >
                <IconInfoCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p>
                Select a file, then click Upload.
                <br />
                <span className="text-muted-foreground">
                  Accepts: PDF, Word, PNG, JPG, HEIC, WebP
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        {description && <FieldDescription>{description}</FieldDescription>}

        <div className="space-y-3">
          {/* Upload Success State */}
          {uploadedUrl && (
            <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                <div className="flex flex-col">
                  <Badge
                    variant="outline"
                    className="w-fit border-green-600 text-green-700 dark:border-green-400 dark:text-green-300"
                  >
                    Uploaded
                  </Badge>
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    View file
                  </a>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="h-8 w-8 p-0"
              >
                <IconX className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          )}

          {/* File Selection & Upload */}
          {!uploadedUrl && (
            <>
              {/* File Input */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept={ACCEPTED_FILE_TYPES}
                  onChange={handleFileSelect}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50"
                />
              </div>

              {/* Selected File Preview */}
              {selectedFile && (
                <div className="flex items-center justify-between rounded-md border bg-muted p-3">
                  <div className="flex items-center gap-2">
                    <IconFileDescription className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {selectedFile.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    size="sm"
                  >
                    {isUploading ? (
                      <>
                        <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <IconUpload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {error && <FieldError>{error}</FieldError>}
      </Field>
    </FieldGroup>
  );
}
