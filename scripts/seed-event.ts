import "dotenv/config";
import { db } from "../lib/db";
import { events } from "../lib/db/schema/events";

async function seedEvent() {
  console.log("Checking for existing events...");

  const existingEvents = await db.select().from(events);

  if (existingEvents.length > 0) {
    console.log("Events already exist:");
    existingEvents.forEach((e) =>
      console.log(`  - ${e.name} (${e.locationCode})`),
    );
    process.exit(0);
  }

  console.log("Inserting initial event...");

  const [newEvent] = await db
    .insert(events)
    .values({
      name: "Chef's Kiss Ayia Napa 2026",
      locationCode: "ANM",
      location: "Ayia Napa Marina",
      startDate: new Date("2026-04-15"),
      endDate: new Date("2026-04-17"),
      isActive: true,
    })
    .returning();

  console.log("Created event:", newEvent.name);
  console.log("   ID:", newEvent.id);
  console.log("   Location:", newEvent.location);
  console.log(
    "   Dates:",
    newEvent.startDate.toDateString(),
    "-",
    newEvent.endDate.toDateString(),
  );

  process.exit(0);
}

seedEvent().catch((err) => {
  console.error("Failed to seed event:", err);
  process.exit(1);
});
