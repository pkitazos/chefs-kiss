/**
 * Route Configuration
 *
 * Controls which routes are enabled/disabled in the app.
 * Set to `true` to enable a route, `false` to disable it.
 *
 * Disabled routes will be prefixed with an underscore (_) and ignored by Next.js.
 *
 * Usage:
 *   1. Update the routes below (true = enabled, false = disabled)
 *   2. Run `pnpm toggle-routes`
 *   3. Run `pnpm build` to rebuild
 */

export const ROUTES = {
  // ============================================================================
  // CURRENT EVENT PAGES (root level)
  // ============================================================================
  // These pages implicitly refer to the current/upcoming event

  map: false, // Venue map (enable when venue finalized)
  schedule: false, // Event schedule/timetable (enable when finalized)
  venue: false, // Venue information (enable when finalized)

  // ============================================================================
  // VENDORS
  // ============================================================================

  vendors: true, // Browse all vendors (enable when finalized)
  "vendors/apply": true, // Vendor application form (enable during application period)

  // Note: vendors/[slug] is a dynamic route and will be accessible if 'vendors' is enabled

  // ============================================================================
  // DISHES
  // ============================================================================

  dishes: false, // Browse all dishes with filters (enable when finalized)

  // ============================================================================
  // WORKSHOPS
  // ============================================================================

  workshops: true, // Browse all workshops (enable when finalized)
  "workshops/apply": true, // Workshop application form (enable during application period)

  // Note: workshops/[slug] and workshops/[slug]/register are dynamic routes
  //       They will be accessible if 'workshops' is enabled

  // ============================================================================
  // PAST EVENTS ARCHIVE
  // ============================================================================

  events: true, // Past events archive/gallery overview

  // Note: events/[slug] is a dynamic route and will be accessible if 'events' is enabled

  // ============================================================================
  // STATIC PAGES
  // ============================================================================
  // These are typically always enabled

  about: true, // About the festival organization
  faq: true, // Frequently asked questions
  contact: true, // Contact information

  // ============================================================================
  // ADMIN PAGES
  // ============================================================================
  // These are typically always enabled

  admin: true, // Admin dashboard overview
  "admin/login": true, // Admin login page
  "admin/applications": true, // Vendor applications management
  "admin/registrations": true, // Workshop registrations management
  "admin/analytics": true, // Event analytics
} as const;

// ============================================================================
// EXAMPLE EVENT LIFECYCLE CONFIGURATIONS
// ============================================================================

/**
 * PHASE 1: Post-Event (1-2 weeks after event)
 * Show recent event info before going into hibernation
 */
export const POST_EVENT_CONFIG = {
  map: true,
  schedule: true,
  venue: true,
  vendors: true,
  "vendors/apply": false,
  "vendors/apply/success": false,
  dishes: true,
  workshops: true,
  "workshops/apply": false,
  events: true,
  about: true,
  faq: true,
  contact: true,
  admin: true,
  "admin/login": true,
  "admin/applications": true,
  "admin/registrations": true,
  "admin/analytics": true,
};

/**
 * PHASE 2: Hibernation / Coming Soon
 * Minimal pages, waiting for next event
 */
export const HIBERNATION_CONFIG = {
  map: false,
  schedule: false,
  venue: false,
  vendors: false,
  "vendors/apply": false,
  "vendors/apply/success": false,
  dishes: false,
  workshops: false,
  "workshops/apply": false,
  events: true, // Keep archive accessible
  about: true,
  faq: true,
  contact: true,
  admin: true,
  "admin/login": true,
  "admin/applications": true,
  "admin/registrations": true,
  "admin/analytics": true,
};

/**
 * PHASE 3: Vendor Applications Open
 * Only vendor application form is live
 */
export const VENDOR_APPLICATIONS_CONFIG = {
  map: false,
  schedule: false,
  venue: false,
  vendors: false,
  "vendors/apply": true, // Open for applications
  "vendors/apply/success": true,
  dishes: false,
  workshops: false,
  "workshops/apply": false,
  events: true,
  about: true,
  faq: true,
  contact: true,
  admin: true,
  "admin/login": true,
  "admin/applications": true,
  "admin/registrations": true,
  "admin/analytics": true,
};

/**
 * PHASE 4: Vendors Finalized
 * Vendor list is live, workshops not yet
 */
export const VENDORS_LIVE_CONFIG = {
  map: false,
  schedule: false,
  venue: false,
  vendors: true, // List of vendors now visible
  "vendors/apply": false, // Applications closed
  "vendors/apply/success": false,
  dishes: false,
  workshops: false,
  "workshops/apply": false,
  events: true,
  about: true,
  faq: true,
  contact: true,
  admin: true,
  "admin/login": true,
  "admin/applications": true,
  "admin/registrations": true,
  "admin/analytics": true,
};

/**
 * PHASE 5: Workshops Live
 * Workshop pages and registration are open
 */
export const WORKSHOPS_LIVE_CONFIG = {
  map: false,
  schedule: false,
  venue: false,
  vendors: true,
  "vendors/apply": false,
  "vendors/apply/success": false,
  dishes: false,
  workshops: true, // Workshop list and registration now open
  "workshops/apply": false, // Workshop applications closed
  events: true,
  about: true,
  faq: true,
  contact: true,
  admin: true,
  "admin/login": true,
  "admin/applications": true,
  "admin/registrations": true,
  "admin/analytics": true,
};

/**
 * PHASE 6: Full Event Live
 * All event details finalized - map, dishes, schedule
 */
export const FULL_EVENT_CONFIG = {
  map: true,
  schedule: true,
  venue: true,
  vendors: true,
  "vendors/apply": false, // Applications closed
  "vendors/apply/success": false,
  dishes: true,
  workshops: true,
  "workshops/apply": false, // Workshop applications closed
  events: true,
  about: true,
  faq: true,
  contact: true,
  admin: true,
  "admin/login": true,
  "admin/applications": true,
  "admin/registrations": true,
  "admin/analytics": true,
};

/**
 * To use a preset configuration:
 * 1. Copy one of the configs above
 * 2. Replace the ROUTES object at the top of this file
 * 3. Run `pnpm toggle-routes`
 */
