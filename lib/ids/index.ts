import type { WorkshopShortId } from "@/lib/config/workshops";

// ----------------------------------------------------------------------------
// Slot IDs
// Format: WS-<SHORTID>[-<VARIANT>]-D<N>-<HHMM>   e.g. "WS-PW-MG-D1-1730"
//         PD-<YYYY>-<MM>-<DD>                    e.g. "PD-2026-05-16"
// ----------------------------------------------------------------------------

export type WorkshopSlotIdParts = {
  workshopShortId: WorkshopShortId;
  variantId?: string;
  day: number;
  time: string;
};

export function buildWorkshopSlotId(parts: WorkshopSlotIdParts): string {
  const variant = parts.variantId ? `-${parts.variantId}` : "";
  return `WS-${parts.workshopShortId}${variant}-D${parts.day}-${parts.time}`;
}

const WORKSHOP_SLOT_ID_RE = /^WS-([A-Z]{2})(?:-([A-Z]{2,3}))?-D(\d+)-(\d{4})$/;

export function parseWorkshopSlotId(id: string): WorkshopSlotIdParts | null {
  const m = id.match(WORKSHOP_SLOT_ID_RE);
  if (!m) return null;
  return {
    workshopShortId: m[1] as WorkshopShortId,
    variantId: m[2],
    day: Number(m[3]),
    time: m[4],
  };
}

// ----------------------------------------------------------------------------
// Reference categories — what gets embedded in booking/waitlist refs.
// Workshop short IDs (BB, PW, KC, ...) plus "PD" for private dining.
// ----------------------------------------------------------------------------

export type RefCategory = WorkshopShortId | "PD";

export function categoryFromSlotId(slotId: string): RefCategory | null {
  if (slotId.startsWith("PD-")) return "PD";
  if (slotId.startsWith("WS-")) {
    const parts = slotId.split("-");
    return (parts[1] ?? null) as RefCategory | null;
  }
  return null;
}

// ----------------------------------------------------------------------------
// Booking & waitlist refs
// Format: <YY><TYPE>-<CAT><SEQ_3>-<LOC>          e.g. "26BK-PW001-ANM"
//   YY    = last two digits of event year
//   TYPE  = "BK" (booking) | "WL" (waitlist)
//   CAT   = workshop short ID or "PD"
//   SEQ_3 = per-(YY,TYPE,CAT) sequence, zero-padded to 3 chars
//   LOC   = uppercase event location code (e.g. "ANM")
// ----------------------------------------------------------------------------

export type BookingOrWaitlistRefType = "BK" | "WL";

export type BookingOrWaitlistRefParts = {
  year: number;
  type: BookingOrWaitlistRefType;
  category: RefCategory;
  sequence: number;
  locationCode: string;
};

export function buildBookingOrWaitlistRef(
  parts: BookingOrWaitlistRefParts,
): string {
  const yy = String(parts.year).slice(-2);
  const seq = String(parts.sequence).padStart(3, "0");
  const loc = parts.locationCode.toUpperCase();
  return `${yy}${parts.type}-${parts.category}${seq}-${loc}`;
}

const BOOKING_OR_WAITLIST_REF_RE =
  /^(\d{2})(BK|WL)-([A-Z]{2})(\d{3})-([A-Z]{3})$/;

export function parseBookingOrWaitlistRef(
  id: string,
): BookingOrWaitlistRefParts | null {
  const m = id.match(BOOKING_OR_WAITLIST_REF_RE);
  if (!m) return null;
  return {
    year: 2000 + Number(m[1]),
    type: m[2] as BookingOrWaitlistRefType,
    category: m[3] as RefCategory,
    sequence: Number(m[4]),
    locationCode: m[5],
  };
}

// ----------------------------------------------------------------------------
// Application refs (vendor + workshop pitches)
// Two formats coexist:
//   Legacy (year ≤ 2026): <YY><TYPE><SEQ_2><LOC>      e.g. "26VE01ANM"
//   New    (year ≥ 2027): <YY><TYPE>-<SEQ_3>-<LOC>    e.g. "27VE-001-ANM"
// ----------------------------------------------------------------------------

export type ApplicationRefType = "VE" | "WS";

export type ApplicationRefParts = {
  year: number;
  type: ApplicationRefType;
  sequence: number;
  locationCode: string;
};

const LEGACY_APPLICATION_CUTOFF_YEAR = 2026;

export function buildApplicationRef(parts: ApplicationRefParts): string {
  const yy = String(parts.year).slice(-2);
  const loc = parts.locationCode.toUpperCase();
  if (parts.year <= LEGACY_APPLICATION_CUTOFF_YEAR) {
    const seq = String(parts.sequence).padStart(2, "0");
    return `${yy}${parts.type}${seq}${loc}`;
  }
  const seq = String(parts.sequence).padStart(3, "0");
  return `${yy}${parts.type}-${seq}-${loc}`;
}

const APPLICATION_REF_NEW_RE = /^(\d{2})(VE|WS)-(\d{3})-([A-Z]{3})$/;
const APPLICATION_REF_LEGACY_RE = /^(\d{2})(VE|WS)(\d{2})([A-Z]{3})$/;

export function parseApplicationRef(id: string): ApplicationRefParts | null {
  const newMatch = id.match(APPLICATION_REF_NEW_RE);
  if (newMatch) {
    return {
      year: 2000 + Number(newMatch[1]),
      type: newMatch[2] as ApplicationRefType,
      sequence: Number(newMatch[3]),
      locationCode: newMatch[4],
    };
  }
  const legacyMatch = id.match(APPLICATION_REF_LEGACY_RE);
  if (legacyMatch) {
    return {
      year: 2000 + Number(legacyMatch[1]),
      type: legacyMatch[2] as ApplicationRefType,
      sequence: Number(legacyMatch[3]),
      locationCode: legacyMatch[4],
    };
  }
  return null;
}

// ----------------------------------------------------------------------------
// SQL LIKE-pattern helpers
// Useful for "count existing rows so we can compute the next sequence" or
// "find all bookings in category X" without parsing each row in app code.
// ----------------------------------------------------------------------------

export function slotIdLikePatternForCategory(category: RefCategory): string {
  return category === "PD" ? "PD-%" : `WS-${category}-%`;
}

export function refLikePatternForCategory(
  year: number,
  type: BookingOrWaitlistRefType,
  category: RefCategory,
): string {
  const yy = String(year).slice(-2);
  return `${yy}${type}-${category}%`;
}
