"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vendorFormSchema,
  type VendorFormData,
  MAX_DISHES,
} from "@/lib/validations/vendor-form";
import { api } from "@/lib/trpc/client";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileUploadField } from "./file-upload-field";
import {
  IconPlus,
  IconTrash,
  IconSend,
  IconLoader2,
} from "@tabler/icons-react";

const DISH_PLACEHOLDERS = [
  "Chef's Kiss Signature Smash Burger",
  "Crispy Hand-Cut Fries",
  "Buffalo Hot Wings",
  "Gourmet Hot Dog with Caramelized Onions",
  "Loaded Nachos with Jalapeños & Sour Cream",
  "Fresh-Baked Artisan Donuts",
  "Classic Margherita Pizza",
  "Chocolate Lava Cake",
  "Caesar Salad",
  "BBQ Pulled Pork Sandwich",
];

export function VendorApplicationForm() {
  // Track which file fields have a file selected but not uploaded
  const [pendingUploads, setPendingUploads] = useState<Record<string, boolean>>(
    {},
  );
  // Custom error messages for "forgot to upload" scenario
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const handleFileSelect = (fieldKey: string, hasFile: boolean) => {
    setPendingUploads((prev) => ({ ...prev, [fieldKey]: hasFile }));
    // Clear the error when user interacts with the field
    if (hasFile) {
      setUploadErrors((prev) => {
        const next = { ...prev };
        delete next[fieldKey];
        return next;
      });
    }
  };

  const handleUploadComplete = (
    fieldKey: string,
    fieldName: string,
    url: string,
  ) => {
    setValue(fieldName as keyof VendorFormData, url as never);
    // Clear pending state and error when upload completes
    setPendingUploads((prev) => ({ ...prev, [fieldKey]: false }));
    setUploadErrors((prev) => {
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    getValues,
  } = useForm<VendorFormData>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      businessInfo: {
        businessName: "",
        contactPerson: "",
        email: "",
        phoneNumber: "",
        companyName: "",
        instagramHandle: "",
      },
      productsOffered: {
        dishes: [{ name: "", price: 0 }],
      },
      specialRequirements: {
        requirements: "",
        kitchenEquipment: "",
        powerSupply: [],
        storage: "",
      },
      truck: {
        ownTruck: false,
        truckPhotoUrl: "",
        truckDimensions: {
          length: undefined,
          width: undefined,
          height: undefined,
        },
        electroMechanicalLicenseUrl: "",
      },
      files: {
        employees: [
          {
            name: "",
            healthCertificate: "",
            socialInsurance: "",
          },
        ],
        businessLicense: "",
        hygieneInspectionCertification: "",
        liabilityInsurance: "",
      },
    },
  });

  const {
    fields: dishFields,
    append: appendDish,
    remove: removeDish,
  } = useFieldArray({
    control,
    name: "productsOffered.dishes",
  });

  const {
    fields: powerFields,
    append: appendPower,
    remove: removePower,
  } = useFieldArray({
    control,
    name: "specialRequirements.powerSupply",
  });

  const {
    fields: employeeFields,
    append: appendEmployee,
    remove: removeEmployee,
  } = useFieldArray({
    control,
    name: "files.employees",
  });

  const ownTruck = watch("truck.ownTruck");

  const submitMutation = api.vendors.submitApplication.useMutation({
    onSuccess: (data) => {
      toast.success("Application Submitted!", {
        description: `Application ID: ${data.applicationId}`,
      });
      reset();
      setPendingUploads({});
      setUploadErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error) => {
      toast.error("Submission Failed", {
        description:
          "Something went wrong while submitting your application. Please try again.",
      });
      console.error("Submission error:", error);
    },
  });

  const onSubmit = (data: VendorFormData) => {
    submitMutation.mutate(data);
  };

  // Custom submit handler that checks for pending uploads before validation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const values = getValues();
    const newUploadErrors: Record<string, string> = {};

    // Check required file fields for pending uploads
    const fileFieldsToCheck = [
      {
        key: "files.businessLicense",
        value: values.files.businessLicense,
        label: "Business License",
      },
      {
        key: "files.hygieneInspectionCertification",
        value: values.files.hygieneInspectionCertification,
        label: "Hygiene Inspection Certificate",
      },
    ];

    // Add truck fields if truck is owned
    if (values.truck.ownTruck) {
      fileFieldsToCheck.push(
        {
          key: "truck.truckPhotoUrl",
          value: values.truck.truckPhotoUrl ?? "",
          label: "Truck Photo",
        },
        {
          key: "truck.electroMechanicalLicenseUrl",
          value: values.truck.electroMechanicalLicenseUrl ?? "",
          label: "Electro-Mechanical License",
        },
      );
    }

    // Add employee document fields
    values.files.employees.forEach((employee, index) => {
      fileFieldsToCheck.push(
        {
          key: `files.employees.${index}.healthCertificate`,
          value: employee.healthCertificate,
          label: `Employee ${index + 1} Health Certificate`,
        },
        {
          key: `files.employees.${index}.socialInsurance`,
          value: employee.socialInsurance,
          label: `Employee ${index + 1} Social Insurance`,
        },
      );
    });

    // Check each field
    let hasPendingUpload = false;
    for (const field of fileFieldsToCheck) {
      if (pendingUploads[field.key] && !field.value) {
        newUploadErrors[field.key] =
          "Looks like you forgot to upload your file. Click the Upload button.";
        hasPendingUpload = true;
      }
    }

    if (hasPendingUpload) {
      setUploadErrors(newUploadErrors);
      toast.error("Please upload your selected files", {
        description:
          "Some files have been selected but not uploaded. Click the Upload button for each file.",
      });
      return;
    }

    // Clear any previous upload errors and proceed with normal validation
    setUploadErrors({});
    handleSubmit(onSubmit)();
  };

  // Helper to get the combined error message (zod error or upload error)
  const getFieldError = (fieldKey: string, zodError?: string) => {
    return uploadErrors[fieldKey] || zodError;
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Section 1: Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Tell us about your business and how to contact you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <FieldLabel htmlFor="businessName" required>
              Business Name
            </FieldLabel>
            <FieldDescription>
              How you want to appear in marketing
            </FieldDescription>
            <Field>
              <Input
                id="businessName"
                placeholder="Chef's Kiss Food Festival"
                {...register("businessInfo.businessName")}
                aria-invalid={!!errors.businessInfo?.businessName}
              />
            </Field>
            {errors.businessInfo?.businessName && (
              <FieldError>
                {errors.businessInfo.businessName.message}
              </FieldError>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="contactPerson" required>
              Contact Person
            </FieldLabel>
            <FieldDescription>
              Primary contact for your business
            </FieldDescription>
            <Field>
              <Input
                id="contactPerson"
                placeholder="Name Surname"
                {...register("businessInfo.contactPerson")}
                aria-invalid={!!errors.businessInfo?.contactPerson}
              />
            </Field>
            {errors.businessInfo?.contactPerson && (
              <FieldError>
                {errors.businessInfo.contactPerson.message}
              </FieldError>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="email" required>
              Email
            </FieldLabel>
            <FieldDescription>
              We&apos;ll use this for all communications
            </FieldDescription>
            <Field>
              <Input
                id="email"
                type="email"
                placeholder="info@chefskiss.com.cy"
                {...register("businessInfo.email")}
                aria-invalid={!!errors.businessInfo?.email}
              />
            </Field>
            {errors.businessInfo?.email && (
              <FieldError>{errors.businessInfo.email.message}</FieldError>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="phoneNumber" required>
              Phone Number
            </FieldLabel>
            <FieldDescription>Include country code</FieldDescription>
            <Field>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+357 99 999999"
                {...register("businessInfo.phoneNumber")}
                aria-invalid={!!errors.businessInfo?.phoneNumber}
              />
            </Field>
            {errors.businessInfo?.phoneNumber && (
              <FieldError>{errors.businessInfo.phoneNumber.message}</FieldError>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="companyName" required>
              Company Name
            </FieldLabel>
            <FieldDescription>Registered company name</FieldDescription>
            <Field>
              <Input
                id="companyName"
                placeholder="Chef's Kiss Ltd."
                {...register("businessInfo.companyName")}
                aria-invalid={!!errors.businessInfo?.companyName}
              />
            </Field>
            {errors.businessInfo?.companyName && (
              <FieldError>{errors.businessInfo.companyName.message}</FieldError>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="instagramHandle">Instagram Handle</FieldLabel>
            <FieldDescription>Optional - helps with promotion</FieldDescription>
            <Field>
              <Input
                id="instagramHandle"
                {...register("businessInfo.instagramHandle")}
                placeholder="@chefskiss.cy"
                aria-invalid={!!errors.businessInfo?.instagramHandle}
              />
            </Field>
            {errors.businessInfo?.instagramHandle && (
              <FieldError>
                {errors.businessInfo.instagramHandle.message}
              </FieldError>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Section 2: Festival Menu */}
      <Card>
        <CardHeader>
          <CardTitle>Festival Menu</CardTitle>
          <CardDescription>
            List the dishes you plan to offer (1-{MAX_DISHES} items). Please
            note, no drinks are allowed to be sold by vendors. The festival will
            be selling drinks separately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {dishFields.map((field, index) => (
            <div key={field.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Dish {index + 1}</h4>
                {dishFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDish(index)}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <FieldGroup>
                <FieldLabel htmlFor={`dish-name-${index}`} required>
                  Dish Name
                </FieldLabel>
                <Field>
                  <Input
                    id={`dish-name-${index}`}
                    placeholder={
                      DISH_PLACEHOLDERS[index] || "Chef's Kiss Signature Dish"
                    }
                    {...register(`productsOffered.dishes.${index}.name`)}
                    aria-invalid={
                      !!errors.productsOffered?.dishes?.[index]?.name
                    }
                  />
                </Field>
                {errors.productsOffered?.dishes?.[index]?.name && (
                  <FieldError>
                    {errors.productsOffered.dishes[index]?.name?.message}
                  </FieldError>
                )}
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor={`dish-price-${index}`} required>
                  Price (EUR)
                </FieldLabel>
                <Field>
                  <Input
                    id={`dish-price-${index}`}
                    type="number"
                    step="0.01"
                    placeholder="8"
                    {...register(`productsOffered.dishes.${index}.price`)}
                    aria-invalid={
                      !!errors.productsOffered?.dishes?.[index]?.price
                    }
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </Field>
                {errors.productsOffered?.dishes?.[index]?.price && (
                  <FieldError>
                    {errors.productsOffered.dishes[index]?.price?.message}
                  </FieldError>
                )}
              </FieldGroup>
            </div>
          ))}

          {dishFields.length < MAX_DISHES && (
            <Button
              type="button"
              variant="outline"
              onClick={() => appendDish({ name: "", price: 0 })}
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Add Dish
            </Button>
          )}

          {errors.productsOffered?.dishes && (
            <FieldError>
              {typeof errors.productsOffered.dishes === "object" &&
              "message" in errors.productsOffered.dishes
                ? errors.productsOffered.dishes.message
                : null}
            </FieldError>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Special Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Special Requirements</CardTitle>
          <CardDescription>
            Let us know about any special needs for your setup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <FieldLabel htmlFor="requirements">Special Requirements</FieldLabel>
            <FieldDescription>
              Any special requirements for your setup
            </FieldDescription>
            <Field>
              <Textarea
                id="requirements"
                placeholder="Space for a small prep table behind the stand."
                {...register("specialRequirements.requirements")}
                aria-invalid={!!errors.specialRequirements?.requirements}
              />
            </Field>
            {errors.specialRequirements?.requirements && (
              <FieldError>
                {errors.specialRequirements.requirements.message}
              </FieldError>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="kitchenEquipment">
              Kitchen Equipment
            </FieldLabel>
            <FieldDescription>
              List any equipment you need us to provide
            </FieldDescription>
            <Field>
              <Textarea
                id="kitchenEquipment"
                placeholder="1 stainless steel prep table, access to shared wash station."
                {...register("specialRequirements.kitchenEquipment")}
                aria-invalid={!!errors.specialRequirements?.kitchenEquipment}
              />
            </Field>
            {errors.specialRequirements?.kitchenEquipment && (
              <FieldError>
                {errors.specialRequirements.kitchenEquipment.message}
              </FieldError>
            )}
          </FieldGroup>

          <div className="space-y-4">
            <div>
              <FieldLabel>Power Supply Requirements</FieldLabel>
              <FieldDescription>
                List any power-consuming devices and their wattage
              </FieldDescription>
            </div>

            {powerFields.map((field, index) => (
              <div key={field.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Device {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePower(index)}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>

                <FieldGroup>
                  <FieldLabel htmlFor={`power-device-${index}`} required>
                    Device Name
                  </FieldLabel>
                  <Field>
                    <Input
                      id={`power-device-${index}`}
                      placeholder="Flat-top grill"
                      {...register(
                        `specialRequirements.powerSupply.${index}.device`,
                      )}
                      aria-invalid={
                        !!errors.specialRequirements?.powerSupply?.[index]
                          ?.device
                      }
                    />
                  </Field>
                  {errors.specialRequirements?.powerSupply?.[index]?.device && (
                    <FieldError>
                      {
                        errors.specialRequirements.powerSupply[index]?.device
                          ?.message
                      }
                    </FieldError>
                  )}
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor={`power-wattage-${index}`} required>
                    Wattage
                  </FieldLabel>
                  <Field>
                    <Input
                      id={`power-wattage-${index}`}
                      type="number"
                      step="1"
                      placeholder="3500"
                      {...register(
                        `specialRequirements.powerSupply.${index}.wattage`,
                      )}
                      aria-invalid={
                        !!errors.specialRequirements?.powerSupply?.[index]
                          ?.wattage
                      }
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </Field>
                  {errors.specialRequirements?.powerSupply?.[index]
                    ?.wattage && (
                    <FieldError>
                      {
                        errors.specialRequirements.powerSupply[index]?.wattage
                          ?.message
                      }
                    </FieldError>
                  )}
                </FieldGroup>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => appendPower({ device: "", wattage: 0 })}
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Add Power Device
            </Button>
          </div>

          <FieldGroup>
            <FieldLabel htmlFor="storage">Storage Requirements</FieldLabel>
            <FieldDescription>
              Any special storage needs (e.g., refrigeration)
            </FieldDescription>
            <Field>
              <Textarea
                id="storage"
                placeholder="Refrigerated storage."
                {...register("specialRequirements.storage")}
                aria-invalid={!!errors.specialRequirements?.storage}
              />
            </Field>
            {errors.specialRequirements?.storage && (
              <FieldError>
                {errors.specialRequirements.storage.message}
              </FieldError>
            )}
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Section 4: Food Truck */}
      <Card>
        <CardHeader>
          <CardTitle>Food Truck</CardTitle>
          <CardDescription>
            Information about your food truck (if applicable)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FieldGroup>
            <Field orientation="horizontal">
              <div className="flex items-center space-x-2">
                <input
                  id="ownTruck"
                  type="checkbox"
                  {...register("truck.ownTruck")}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <FieldLabel htmlFor="ownTruck" className="mb-0!">
                  I will participate with my own food truck
                </FieldLabel>
              </div>
            </Field>
            {errors.truck?.ownTruck && (
              <FieldError>{errors.truck.ownTruck.message}</FieldError>
            )}
          </FieldGroup>

          {ownTruck && (
            <div className="space-y-4 rounded-lg border p-4">
              <FileUploadField
                label="Truck Photo"
                description="Upload a clear exterior photo of your food truck during service or setup."
                endpoint="vendorTruckPhoto"
                value={watch("truck.truckPhotoUrl")}
                onUploadComplete={(url) =>
                  handleUploadComplete(
                    "truck.truckPhotoUrl",
                    "truck.truckPhotoUrl",
                    url,
                  )
                }
                onFileSelect={(hasFile) =>
                  handleFileSelect("truck.truckPhotoUrl", hasFile)
                }
                error={getFieldError(
                  "truck.truckPhotoUrl",
                  errors.truck?.truckPhotoUrl?.message,
                )}
                required
              />

              <div>
                <FieldLabel required>Truck Dimensions (meters)</FieldLabel>
                <FieldDescription>
                  Provide the dimensions of your food truck
                </FieldDescription>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <FieldGroup>
                    <FieldLabel htmlFor="truckLength" required>
                      Length
                    </FieldLabel>
                    <Field>
                      <Input
                        id="truckLength"
                        type="number"
                        step="0.01"
                        placeholder="4.5"
                        {...register("truck.truckDimensions.length")}
                        aria-invalid={!!errors.truck?.truckDimensions?.length}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </Field>
                    {errors.truck?.truckDimensions?.length && (
                      <FieldError>
                        {errors.truck.truckDimensions.length.message}
                      </FieldError>
                    )}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel htmlFor="truckWidth" required>
                      Width
                    </FieldLabel>
                    <Field>
                      <Input
                        id="truckWidth"
                        type="number"
                        step="0.01"
                        placeholder="2.2"
                        {...register("truck.truckDimensions.width")}
                        aria-invalid={!!errors.truck?.truckDimensions?.width}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </Field>
                    {errors.truck?.truckDimensions?.width && (
                      <FieldError>
                        {errors.truck.truckDimensions.width.message}
                      </FieldError>
                    )}
                  </FieldGroup>

                  <FieldGroup>
                    <FieldLabel htmlFor="truckHeight" required>
                      Height
                    </FieldLabel>
                    <Field>
                      <Input
                        id="truckHeight"
                        type="number"
                        step="0.01"
                        placeholder="2.8"
                        {...register("truck.truckDimensions.height")}
                        aria-invalid={!!errors.truck?.truckDimensions?.height}
                        onWheel={(e) => e.currentTarget.blur()}
                      />
                    </Field>
                    {errors.truck?.truckDimensions?.height && (
                      <FieldError>
                        {errors.truck.truckDimensions.height.message}
                      </FieldError>
                    )}
                  </FieldGroup>
                </div>
              </div>

              <FileUploadField
                label="Electro-Mechanical License"
                description="Provide a valid electro-mechanical license issued by local authorities."
                endpoint="vendorTruckLicense"
                value={watch("truck.electroMechanicalLicenseUrl")}
                onUploadComplete={(url) =>
                  handleUploadComplete(
                    "truck.electroMechanicalLicenseUrl",
                    "truck.electroMechanicalLicenseUrl",
                    url,
                  )
                }
                onFileSelect={(hasFile) =>
                  handleFileSelect("truck.electroMechanicalLicenseUrl", hasFile)
                }
                error={getFieldError(
                  "truck.electroMechanicalLicenseUrl",
                  errors.truck?.electroMechanicalLicenseUrl?.message,
                )}
                required
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 5: Business Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Business Documents</CardTitle>
          <CardDescription>
            Upload your business license and hygiene certificate (liability
            insurance is optional)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploadField
            label="Business License"
            description="Your official business license"
            endpoint="vendorBusinessLicense"
            value={watch("files.businessLicense")}
            onUploadComplete={(url) =>
              handleUploadComplete(
                "files.businessLicense",
                "files.businessLicense",
                url,
              )
            }
            onFileSelect={(hasFile) =>
              handleFileSelect("files.businessLicense", hasFile)
            }
            error={getFieldError(
              "files.businessLicense",
              errors.files?.businessLicense?.message,
            )}
            required
          />

          <FileUploadField
            label="Hygiene Inspection Certificate"
            description="Current hygiene inspection certification"
            endpoint="vendorHygieneCert"
            value={watch("files.hygieneInspectionCertification")}
            onUploadComplete={(url) =>
              handleUploadComplete(
                "files.hygieneInspectionCertification",
                "files.hygieneInspectionCertification",
                url,
              )
            }
            onFileSelect={(hasFile) =>
              handleFileSelect("files.hygieneInspectionCertification", hasFile)
            }
            error={getFieldError(
              "files.hygieneInspectionCertification",
              errors.files?.hygieneInspectionCertification?.message,
            )}
            required
          />

          <FileUploadField
            label="Liability Insurance"
            description="Proof of liability insurance"
            endpoint="vendorLiabilityInsurance"
            value={watch("files.liabilityInsurance")}
            onUploadComplete={(url) =>
              handleUploadComplete(
                "files.liabilityInsurance",
                "files.liabilityInsurance",
                url,
              )
            }
            onFileSelect={(hasFile) =>
              handleFileSelect("files.liabilityInsurance", hasFile)
            }
            error={getFieldError(
              "files.liabilityInsurance",
              errors.files?.liabilityInsurance?.message,
            )}
          />
        </CardContent>
      </Card>

      {/* Section 6: Employee Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Documents</CardTitle>
          <CardDescription>
            Upload documents for all employees working at the festival
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {employeeFields.map((field, index) => (
            <div key={field.id} className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Employee {index + 1}</h4>
                {employeeFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEmployee(index)}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <FieldGroup>
                <FieldLabel htmlFor={`employee-name-${index}`} required>
                  Employee Name
                </FieldLabel>
                <Field>
                  <Input
                    id={`employee-name-${index}`}
                    placeholder="Name Surname"
                    {...register(`files.employees.${index}.name`)}
                    aria-invalid={!!errors.files?.employees?.[index]?.name}
                  />
                </Field>
                {errors.files?.employees?.[index]?.name && (
                  <FieldError>
                    {errors.files.employees[index]?.name?.message}
                  </FieldError>
                )}
              </FieldGroup>

              <FileUploadField
                label="Health Certificate"
                description="Valid employee health certificate for food handling."
                endpoint="vendorEmployeeHealthCert"
                value={watch(`files.employees.${index}.healthCertificate`)}
                onUploadComplete={(url) =>
                  handleUploadComplete(
                    `files.employees.${index}.healthCertificate`,
                    `files.employees.${index}.healthCertificate`,
                    url,
                  )
                }
                onFileSelect={(hasFile) =>
                  handleFileSelect(
                    `files.employees.${index}.healthCertificate`,
                    hasFile,
                  )
                }
                error={getFieldError(
                  `files.employees.${index}.healthCertificate`,
                  errors.files?.employees?.[index]?.healthCertificate?.message,
                )}
                required
              />

              <FileUploadField
                label="Social Insurance"
                description="Proof of social insurance registration."
                endpoint="vendorEmployeeSocialInsurance"
                value={watch(`files.employees.${index}.socialInsurance`)}
                onUploadComplete={(url) =>
                  handleUploadComplete(
                    `files.employees.${index}.socialInsurance`,
                    `files.employees.${index}.socialInsurance`,
                    url,
                  )
                }
                onFileSelect={(hasFile) =>
                  handleFileSelect(
                    `files.employees.${index}.socialInsurance`,
                    hasFile,
                  )
                }
                error={getFieldError(
                  `files.employees.${index}.socialInsurance`,
                  errors.files?.employees?.[index]?.socialInsurance?.message,
                )}
                required
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendEmployee({
                name: "",
                healthCertificate: "",
                socialInsurance: "",
              })
            }
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>

          {errors.files?.employees && (
            <FieldError>
              {typeof errors.files.employees === "object" &&
              "message" in errors.files.employees
                ? errors.files.employees.message
                : null}
            </FieldError>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? (
            <>
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <IconSend className="mr-2 h-4 w-4" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
