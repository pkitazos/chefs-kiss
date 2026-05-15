import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

import { getEnrichedSession } from "@/lib/auth";
import { userHasPermission } from "@/lib/auth/permissions";
import { getWorkshopAttendees } from "@/lib/admin/exports/workshop-attendees";

const CSV_HEADERS = [
  "ID",
  "Slot Date",
  "Slot Time",
  "Customer Name",
  "Email",
  "Phone",
  "Seats",
  "Type",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await getEnrichedSession({ headers: await headers() });
  if (!session || !userHasPermission(session.user, "admin.access")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug } = await params;
  const includeWaitlist =
    request.nextUrl.searchParams.get("includeWaitlist") === "true";

  const rows = await getWorkshopAttendees(slug, includeWaitlist);
  if (rows === null) {
    return NextResponse.json({ error: "Workshop not found" }, { status: 404 });
  }

  const csvData = rows.map((r) => [
    r.bookingId,
    r.slotDate,
    r.slotTime,
    r.customerName,
    r.email,
    r.phone,
    r.seats,
    r.type,
  ]);

  const csv = Papa.unparse(
    { fields: CSV_HEADERS, data: csvData },
    { quotes: true },
  );

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.csv"`,
    },
  });
}
