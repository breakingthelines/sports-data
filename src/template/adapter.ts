/**
 * Template adapter - transform your provider's data to BTL schema.
 *
 * Copy this file as a starting point for new adapters.
 *
 * Steps to implement:
 * 1. Define raw types in types.ts
 * 2. Implement coordinate normalisation (if needed)
 * 3. Map event types to BTL EventType
 * 4. Map enums (outcomes, body parts, etc.)
 * 5. Create the main transform function
 * 6. Add tests in adapter.test.ts
 */

import type {
  NormalizedMatchData,
  MatchEvent,
  Team,
  DataSource,
  PitchCoordinates,
  EventType,
} from '#/core/types.js';

import type { TemplateMatch, TemplateEvent } from './types.js';

// =============================================================================
// OPTIONS
// =============================================================================

export interface FromTemplateOptions {
  /** Override home team info */
  homeTeam?: Partial<Team>;
  /** Override away team info */
  awayTeam?: Partial<Team>;
  /** Additional metadata */
  meta?: Record<string, string>;
}

// =============================================================================
// DATA SOURCE
// =============================================================================

const TEMPLATE_SOURCE: DataSource = {
  provider: 'template',
  name: 'Template Provider',
  // logo: 'https://...',
  // url: 'https://...',
};

// =============================================================================
// COORDINATE NORMALISATION
// =============================================================================

/**
 * Normalise coordinates from provider format to BTL (0-100).
 *
 * Example for a provider using 100x68 pitch:
 * ```typescript
 * const PITCH_LENGTH = 100;
 * const PITCH_WIDTH = 68;
 *
 * function normalizeCoordinates(x: number, y: number): PitchCoordinates {
 *   return {
 *     x: (x / PITCH_LENGTH) * 100,
 *     y: (y / PITCH_WIDTH) * 100,
 *   };
 * }
 * ```
 */
function normalizeCoordinates(x: number, y: number): PitchCoordinates {
  // TODO: Adjust for your provider's coordinate system
  return { x, y };
}

// =============================================================================
// EVENT TYPE MAPPING
// =============================================================================

/**
 * Map provider event types to BTL EventType.
 *
 * Return null for unsupported event types.
 */
function mapEventType(providerType: string): EventType | null {
  // TODO: Map your provider's event types
  switch (providerType.toLowerCase()) {
    case 'shot':
      return 'shot';
    case 'pass':
      return 'pass';
    case 'carry':
    case 'dribble':
      return 'carry';
    case 'tackle':
      return 'tackle';
    case 'interception':
      return 'interception';
    default:
      return null;
  }
}

// =============================================================================
// EVENT TRANSFORMER
// =============================================================================

function transformEvent(event: TemplateEvent): MatchEvent | null {
  const eventType = mapEventType(event.type);
  if (!eventType) return null;

  const timestamp = event.minute + event.second / 60;

  return {
    id: event.id,
    type: eventType,
    timestamp,
    location: normalizeCoordinates(event.x, event.y),
    // TODO: Add player, team, eventData based on your provider's schema
  };
}

// =============================================================================
// MAIN ADAPTER
// =============================================================================

/**
 * Transform provider data into BTL's normalised schema.
 *
 * @param match - Raw match data from provider
 * @param options - Optional configuration
 * @returns Normalised match data
 */
export function fromTemplate(
  match: TemplateMatch,
  options: FromTemplateOptions = {}
): NormalizedMatchData {
  const homeTeam: Team = {
    id: match.homeTeam.id,
    name: match.homeTeam.name,
    ...options.homeTeam,
  };

  const awayTeam: Team = {
    id: match.awayTeam.id,
    name: match.awayTeam.name,
    ...options.awayTeam,
  };

  const events = match.events.map(transformEvent).filter((e): e is MatchEvent => e !== null);

  return {
    matchId: match.matchId,
    homeTeam,
    awayTeam,
    events,
    source: TEMPLATE_SOURCE,
    meta: options.meta,
  };
}
