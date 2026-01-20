import {
  pgTable,
  text,
  timestamp,
  decimal,
  integer,
  index,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";

// Enum for application status
export const applicationStatusEnum = pgEnum("application_status", [
  "pending",
  "approved",
  "rejected",
]);

// Truck information (separate table for data integrity)
export const vendorTruckInfo = pgTable("vendor_truck_info", {
  id: uuid("id").primaryKey().defaultRandom(),

  photoUrl: text("photo_url").notNull(),
  length: decimal("length", { precision: 5, scale: 2 }).notNull(),
  width: decimal("width", { precision: 5, scale: 2 }).notNull(),
  height: decimal("height", { precision: 5, scale: 2 }).notNull(),
  electroMechanicalLicenseUrl: text("electro_mechanical_license_url").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Main vendor applications table
export const vendorApplications = pgTable(
  "vendor_applications",
  {
    id: text("id").primaryKey(),

    // Status tracking with enum
    status: applicationStatusEnum("status").notNull().default("pending"),

    // Business Info
    businessName: text("business_name").notNull(),
    contactPerson: text("contact_person").notNull(),
    email: text("email").notNull(),
    phoneNumber: text("phone_number").notNull(),
    companyName: text("company_name").notNull(),
    instagramHandle: text("instagram_handle"),

    // Special Requirements
    specialRequirements: text("special_requirements"),
    kitchenEquipment: text("kitchen_equipment"),
    storage: text("storage"),

    // Document Files
    businessLicenseUrl: text("business_license_url").notNull(),
    hygieneInspectionCertificationUrl: text(
      "hygiene_inspection_certification_url"
    ).notNull(),
    liabilityInsuranceUrl: text("liability_insurance_url").notNull(),

    // Optional reference to truck info
    truckInfoId: uuid("truck_info_id").references(() => vendorTruckInfo.id, {
      onDelete: "set null",
    }),

    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("vendor_applications_status_idx").on(table.status),
    index("vendor_applications_created_at_idx").on(table.createdAt),
    index("vendor_applications_email_idx").on(table.email),
  ]
);

// Dishes offered by vendor
export const vendorDishes = pgTable("vendor_dishes", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorApplicationId: text("vendor_application_id")
    .notNull()
    .references(() => vendorApplications.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Power supply requirements
export const vendorPowerRequirements = pgTable("vendor_power_requirements", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorApplicationId: text("vendor_application_id")
    .notNull()
    .references(() => vendorApplications.id, { onDelete: "cascade" }),
  device: text("device").notNull(),
  wattage: integer("wattage").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Employee documents
export const vendorEmployees = pgTable("vendor_employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorApplicationId: text("vendor_application_id")
    .notNull()
    .references(() => vendorApplications.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  healthCertificateUrl: text("health_certificate_url").notNull(),
  socialInsuranceUrl: text("social_insurance_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
