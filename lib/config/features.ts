// Presentation-layer visibility flags. Independent of:
//   - routes.config.ts (build-time 404s)
//   - lib/config/mode.ts (booking behavior)
// Flip a flag and redeploy.

export const PRIVATE_DINING_VISIBLE = true;
export const VENDOR_DETAIL_VISIBLE = false;
