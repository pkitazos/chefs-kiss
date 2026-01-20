interface ApplicationForExport {
  id: string;
  status: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  instagramHandle: string | null;
  specialRequirements: string | null;
  kitchenEquipment: string | null;
  storage: string | null;
  createdAt: Date;
}

export function exportApplicationsToCSV(applications: ApplicationForExport[]) {
  const headers = [
    "ID",
    "Status",
    "Business Name",
    "Contact Person",
    "Email",
    "Phone Number",
    "Company Name",
    "Instagram",
    "Special Requirements",
    "Kitchen Equipment",
    "Storage",
    "Created At",
  ];

  const rows = applications.map((app) => [
    app.id,
    app.status,
    app.businessName,
    app.contactPerson,
    app.email,
    app.phoneNumber,
    app.companyName,
    app.instagramHandle ?? "",
    app.specialRequirements ?? "",
    app.kitchenEquipment ?? "",
    app.storage ?? "",
    app.createdAt.toISOString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `vendor-applications-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
