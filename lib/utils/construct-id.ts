type Event = {
  date: {
    start: Date;
    end: Date;
  };
  location: string;
  locationCode: string;
};

/**
 * Generates a unique identifier for a vendor application.
 *
 * @param event - The event object containing date and location information
 * @param applicationNumber - The sequential number of the application
 * @param applicationTypeCode - The type code of the application (e.g., 'VE' for Vendors, 'WS' for Workshop)
 * @returns A formatted string ID in the format: YY_TYPE_NN_LOC (e.g., '26VE01ANM')
 *   - YY: Two-digit year (e.g., '26')
 *   - TYPE: Application type code (e.g., 'VE', 'WS')
 *   - NN: Zero-padded application order number (e.g., '01', '11')
 *   - LOC: Uppercase event location code (e.g., 'ANM' for Ayia Napa Marina)
 *
 * @example
 * const event = { date: { start: new Date(2026, 0, 1) }, locationCode: 'anm' };
 * const id = generateId(event, 1, 'VE');
 * // Returns: '26VE01ANM'
 */
export function generateId(
  event: Event,
  applicationNumber: number,
  applicationTypeCode: string,
): string {
  // YY - year of event, e.g. 26
  // Type - type of application, e.g. VE for Vendors WS for Workshop
  // No - integer corresponding to the order, e.g. 01 for first, 11 for eleventh
  // Loc - the location of the event, e.g. ANM for Ayia Napa Marina
  const year = event.date.start.getFullYear().toString().slice(-2);
  const orderNumber = applicationNumber.toString().padStart(2, "0");
  const locationCode = event.locationCode.toUpperCase();

  return `${year}${applicationTypeCode}${orderNumber}${locationCode}`;
}
