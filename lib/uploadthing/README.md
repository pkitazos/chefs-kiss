# Uploadthing File Upload Setup

This directory contains the Uploadthing configuration for type-safe file uploads.

## Files

- `core.ts` - Server-side file router configuration
- `client.ts` - Client-side hooks and utilities

## Available Upload Endpoints

### 1. `imageUploader`
- **Type**: Single image upload
- **Max file size**: 4MB
- **Max file count**: 1
- **Authentication**: Required
- **Use case**: General image uploads

### 2. `multipleFileUploader`
- **Type**: Multiple images and PDFs
- **Max file size**: 4MB (images), 8MB (PDFs)
- **Max file count**: 5 (images), 3 (PDFs)
- **Authentication**: Required
- **Use case**: Document/media galleries

### 3. `publicUploader`
- **Type**: Public image upload
- **Max file size**: 2MB
- **Max file count**: 1
- **Authentication**: Not required
- **Use case**: Public submissions, anonymous uploads

### 4. `avatarUploader`
- **Type**: User avatar image
- **Max file size**: 2MB
- **Max file count**: 1
- **Authentication**: Required
- **Use case**: User profile pictures

## Usage Example

```tsx
"use client";

import { useUploadThing } from "@/lib/uploadthing/client";

export function MyUploadComponent() {
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log("Upload complete:", res);
      // Handle successful upload
    },
    onUploadError: (error) => {
      console.error("Upload failed:", error);
      // Handle error
    },
  });

  const handleUpload = async (files: File[]) => {
    await startUpload(files);
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const files = e.target.files;
        if (files) handleUpload(Array.from(files));
      }}
      disabled={isUploading}
    />
  );
}
```

## Customizing Upload Endpoints

To add a new upload endpoint, edit `core.ts`:

```typescript
export const uploadRouter = {
  // ... existing endpoints

  myCustomUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 3 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Add authentication check if needed
      const session = await auth.api.getSession({ headers: req.headers });
      if (!session?.user) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Save to database or perform other actions
      console.log("File uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;
```

## Saving Uploads to Database

Example of saving file metadata to your database:

```typescript
.onUploadComplete(async ({ metadata, file }) => {
  // Save to database
  await db.insert(files).values({
    userId: metadata.userId,
    url: file.url,
    name: file.name,
    size: file.size,
    type: file.type,
  });

  return { success: true };
});
```

## File Type Restrictions

Supported file types in Uploadthing:
- `image` - Images (jpg, png, gif, webp, etc.)
- `video` - Videos (mp4, webm, etc.)
- `audio` - Audio files (mp3, wav, etc.)
- `pdf` - PDF documents
- `blob` - Any file type

Example with specific MIME types:

```typescript
f({
  "image/png": { maxFileSize: "4MB" },
  "image/jpeg": { maxFileSize: "4MB" },
})
```

## Environment Setup

Make sure `UPLOADTHING_TOKEN` is set in your `.env.local`:

```bash
UPLOADTHING_TOKEN="your-token-from-uploadthing-dashboard"
```

Get your token from: https://uploadthing.com/dashboard

## Learn More

- [Uploadthing Documentation](https://docs.uploadthing.com)
- [File Router Reference](https://docs.uploadthing.com/api-reference/server#file-routes)
- [Client Hooks Reference](https://docs.uploadthing.com/api-reference/react)
