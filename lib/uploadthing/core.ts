import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

/**
 * This is your Uploadthing file router
 * Define your file upload endpoints here
 */
export const uploadRouter = {
  // Example: Image uploader that requires authentication
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      // Authenticate user
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      // Return metadata that will be accessible in onUploadComplete
      return { userId: session.user.id, userName: session.user.name };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This runs on the server after upload completes
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // You can save the file info to your database here
      // await db.insert(files).values({
      //   userId: metadata.userId,
      //   url: file.url,
      //   name: file.name,
      // });

      // Return data to the client
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Example: Multiple file uploader
  multipleFileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    pdf: { maxFileSize: "8MB", maxFileCount: 3 },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("File uploaded:", file.name, "by user:", metadata.userId);
      return { uploadedBy: metadata.userId };
    }),

  // Example: Public uploader (no auth required)
  publicUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // No auth check, anyone can upload
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Public upload complete:", file.url);
      return { url: file.url };
    }),

  // Example: Avatar uploader
  avatarUploader: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session?.user) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update user's avatar in database
      // await db.update(users)
      //   .set({ image: file.url })
      //   .where(eq(users.id, metadata.userId));

      console.log("Avatar updated for user:", metadata.userId);
      return { url: file.url };
    }),

  // Vendor Application Documents
  vendorBusinessLicense: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // Public uploader - no auth required for vendor applications
      return {
        uploadType: "business_license",
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Business license uploaded:", file.url);
      return { url: file.url, uploadType: metadata.uploadType };
    }),

  vendorHygieneCert: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return {
        uploadType: "hygiene_cert",
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Hygiene cert uploaded:", file.url);
      return { url: file.url, uploadType: metadata.uploadType };
    }),

  vendorLiabilityInsurance: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return {
        uploadType: "liability_insurance",
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Liability insurance uploaded:", file.url);
      return { url: file.url, uploadType: metadata.uploadType };
    }),

  vendorTruckPhoto: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return {
        uploadType: "truck_photo",
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Truck photo uploaded:", file.url);
      return { url: file.url, uploadType: metadata.uploadType };
    }),

  vendorTruckLicense: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      return {
        uploadType: "truck_license",
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Truck license uploaded:", file.url);
      return { url: file.url, uploadType: metadata.uploadType };
    }),

  vendorEmployeeHealthCert: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 10 }, // Support multiple employees
  })
    .middleware(async () => {
      return {
        uploadType: "employee_health_cert",
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Employee health cert uploaded:", file.url);
      return { url: file.url, uploadType: metadata.uploadType };
    }),

  vendorEmployeeSocialInsurance: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 10 }, // Support multiple employees
  })
    .middleware(async () => {
      return {
        uploadType: "employee_social_insurance",
        uploadedAt: new Date().toISOString(),
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Employee social insurance uploaded:", file.url);
      return { url: file.url, uploadType: metadata.uploadType };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
