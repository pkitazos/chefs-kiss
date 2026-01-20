"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vendorFormSchema,
  type VendorFormData,
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

export function VendorApplicationForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (error) => {
      toast.error("Submission Failed", {
        description: error.message,
      });
    },
  });

  const onSubmit = (data: VendorFormData) => {
    submitMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            List the dishes you plan to offer (1-6 items). Please note, no
            drinks are allowed to be sold by vendors. The festival will be
            selling drinks separately.
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
                    placeholder="Chef's Kiss Signature Smash Burger"
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

          {dishFields.length < 4 && (
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
                accept="image"
                value={watch("truck.truckPhotoUrl")}
                onUploadComplete={(url) => setValue("truck.truckPhotoUrl", url)}
                error={errors.truck?.truckPhotoUrl?.message}
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
                accept="pdf"
                value={watch("truck.electroMechanicalLicenseUrl")}
                onUploadComplete={(url) =>
                  setValue("truck.electroMechanicalLicenseUrl", url)
                }
                error={errors.truck?.electroMechanicalLicenseUrl?.message}
                required
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 5: Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>
            Upload all required business documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FileUploadField
            label="Business License"
            description="Your official business license"
            endpoint="vendorBusinessLicense"
            accept="pdf"
            value={watch("files.businessLicense")}
            onUploadComplete={(url) => setValue("files.businessLicense", url)}
            error={errors.files?.businessLicense?.message}
            required
          />

          <FileUploadField
            label="Hygiene Inspection Certificate"
            description="Current hygiene inspection certification"
            endpoint="vendorHygieneCert"
            accept="pdf"
            value={watch("files.hygieneInspectionCertification")}
            onUploadComplete={(url) =>
              setValue("files.hygieneInspectionCertification", url)
            }
            error={errors.files?.hygieneInspectionCertification?.message}
            required
          />

          <FileUploadField
            label="Liability Insurance"
            description="Proof of liability insurance"
            endpoint="vendorLiabilityInsurance"
            accept="pdf"
            value={watch("files.liabilityInsurance")}
            onUploadComplete={(url) =>
              setValue("files.liabilityInsurance", url)
            }
            error={errors.files?.liabilityInsurance?.message}
            required
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
                accept="pdf"
                // eslint-disable-next-line react-hooks/incompatible-library
                value={watch(`files.employees.${index}.healthCertificate`)}
                onUploadComplete={(url) =>
                  setValue(`files.employees.${index}.healthCertificate`, url)
                }
                error={
                  errors.files?.employees?.[index]?.healthCertificate?.message
                }
                required
              />

              <FileUploadField
                label="Social Insurance"
                description="Proof of social insurance registration."
                endpoint="vendorEmployeeSocialInsurance"
                accept="pdf"
                value={watch(`files.employees.${index}.socialInsurance`)}
                onUploadComplete={(url) =>
                  setValue(`files.employees.${index}.socialInsurance`, url)
                }
                error={
                  errors.files?.employees?.[index]?.socialInsurance?.message
                }
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
