/**
 * Template adapter types.
 *
 * Define TypeScript types for the raw data format from your provider.
 * These should match the structure of the provider's JSON/API response.
 */

// =============================================================================
// RAW EVENT TYPES
// =============================================================================

/**
 * Replace with the provider's event structure.
 */
export interface TemplateEvent {
  /** Unique event identifier */
  id: string;
  /** Event type identifier */
  type: {
    id: number;
    name: string;
  };
  /** Timestamp or timing info */
  timestamp: number;
  /** Player who performed the action */
  player?: {
    id: number;
    name: string;
  };
  /** Team associated with the event */
  team?: {
    id: number;
    name: string;
  };
  /** Location on pitch (provider's coordinate system) */
  location?: [number, number];
  // Add provider-specific event data fields here
}

/**
 * Match metadata if the provider includes it.
 */
export interface TemplateMatch {
  match_id: number;
  home_team: {
    id: number;
    name: string;
  };
  away_team: {
    id: number;
    name: string;
  };
  // Add other match fields as needed
}

// =============================================================================
// PROVIDER CONSTANTS
// =============================================================================

/**
 * Map of provider's event type IDs.
 * Update these to match your provider's event taxonomy.
 */
export const TEMPLATE_EVENT_TYPES = {
  SHOT: 1,
  PASS: 2,
  CARRY: 3,
  TACKLE: 4,
  INTERCEPTION: 5,
  // Add more event types as needed
} as const;

/**
 * Pitch dimensions used by this provider.
 * These are used for coordinate normalisation.
 */
export const TEMPLATE_PITCH = {
  LENGTH: 100, // e.g., 120 for StatsBomb
  WIDTH: 100, // e.g., 80 for StatsBomb
} as const;
