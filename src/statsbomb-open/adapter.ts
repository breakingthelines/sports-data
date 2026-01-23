/**
 * StatsBomb Open Data adapter.
 *
 * Transforms StatsBomb Open Data events into BTL's normalised schema.
 */

import type {
  NormalizedMatchData,
  MatchEvent,
  Team,
  Player,
  PitchCoordinates,
  EventType,
  BodyPart,
  ShotOutcome,
  PassHeight,
  PassOutcome,
  TackleOutcome,
  InterceptionOutcome,
  DuelType,
  ShotEventData,
  PassEventData,
  CarryEventData,
  TackleEventData,
  InterceptionEventData,
  DataSource,
} from '#/core/types.js';

import {
  type StatsBombEvent,
  type StatsBombLocation,
  type StatsBombMatch,
  STATSBOMB_EVENT_TYPES,
  STATSBOMB_SHOT_OUTCOMES,
  STATSBOMB_PASS_HEIGHTS,
  STATSBOMB_BODY_PARTS,
  STATSBOMB_INTERCEPTION_OUTCOMES,
} from './types.js';

// =============================================================================
// OPTIONS
// =============================================================================

export interface FromStatsBombOpenOptions {
  /** Match metadata (from matches.json) */
  match?: StatsBombMatch;
  /** Override home team info */
  homeTeam?: Partial<Team>;
  /** Override away team info */
  awayTeam?: Partial<Team>;
  /** Additional metadata to include */
  meta?: Record<string, string>;
}

// =============================================================================
// COORDINATE TRANSFORMATION
// =============================================================================

/**
 * StatsBomb uses 120x80 coordinate system.
 * BTL normalises to 0-100 for both axes.
 */
const STATSBOMB_PITCH_LENGTH = 120;
const STATSBOMB_PITCH_WIDTH = 80;

function normalizeCoordinates(location: StatsBombLocation): PitchCoordinates {
  const [x, y] = location;
  return {
    x: (x / STATSBOMB_PITCH_LENGTH) * 100,
    y: (y / STATSBOMB_PITCH_WIDTH) * 100,
  };
}

// =============================================================================
// ENUM MAPPINGS
// =============================================================================

function mapBodyPart(bodyPartId: number | undefined): BodyPart | undefined {
  if (bodyPartId === undefined) return undefined;

  switch (bodyPartId) {
    case STATSBOMB_BODY_PARTS.RIGHT_FOOT:
      return 'right_foot';
    case STATSBOMB_BODY_PARTS.LEFT_FOOT:
      return 'left_foot';
    case STATSBOMB_BODY_PARTS.HEAD:
      return 'head';
    default:
      return 'other';
  }
}

function mapShotOutcome(outcomeId: number): ShotOutcome | undefined {
  switch (outcomeId) {
    case STATSBOMB_SHOT_OUTCOMES.GOAL:
      return 'goal';
    case STATSBOMB_SHOT_OUTCOMES.SAVED:
    case STATSBOMB_SHOT_OUTCOMES.SAVED_OFF_TARGET:
    case STATSBOMB_SHOT_OUTCOMES.SAVED_TO_POST:
      return 'saved';
    case STATSBOMB_SHOT_OUTCOMES.OFF_T:
    case STATSBOMB_SHOT_OUTCOMES.WAYWARD:
      return 'missed';
    case STATSBOMB_SHOT_OUTCOMES.BLOCKED:
      return 'blocked';
    case STATSBOMB_SHOT_OUTCOMES.POST:
      return 'post';
    default:
      return undefined;
  }
}

function mapPassHeight(heightId: number): PassHeight | undefined {
  switch (heightId) {
    case STATSBOMB_PASS_HEIGHTS.GROUND:
      return 'ground';
    case STATSBOMB_PASS_HEIGHTS.LOW:
      return 'low';
    case STATSBOMB_PASS_HEIGHTS.HIGH:
      return 'high';
    default:
      return undefined;
  }
}

function mapPassOutcome(outcome: { id: number } | undefined): PassOutcome {
  // If no outcome object, pass was successful
  if (!outcome) return 'successful';
  // Any outcome object means the pass failed
  return 'unsuccessful';
}

function mapInterceptionOutcome(outcomeId: number): InterceptionOutcome | undefined {
  switch (outcomeId) {
    case STATSBOMB_INTERCEPTION_OUTCOMES.WON:
    case STATSBOMB_INTERCEPTION_OUTCOMES.SUCCESS_IN_PLAY:
    case STATSBOMB_INTERCEPTION_OUTCOMES.SUCCESS_OUT:
      return 'won';
    case STATSBOMB_INTERCEPTION_OUTCOMES.LOST:
    case STATSBOMB_INTERCEPTION_OUTCOMES.LOST_IN_PLAY:
    case STATSBOMB_INTERCEPTION_OUTCOMES.LOST_OUT:
      return 'lost';
    default:
      return undefined;
  }
}

function mapTackleOutcome(outcome: { id: number; name: string } | undefined): TackleOutcome {
  if (!outcome) return 'won';
  // StatsBomb outcomes like "Lost", "Lost In Play", "Lost Out" indicate failure
  return outcome.name.toLowerCase().includes('lost') ? 'lost' : 'won';
}

function mapDuelType(duelTypeId: number | undefined): DuelType | undefined {
  if (duelTypeId === undefined) return undefined;
  // Aerial duels have type id 10 (Aerial Lost)
  if (duelTypeId === 10) return 'aerial';
  return 'ground';
}

// =============================================================================
// EVENT TRANSFORMERS
// =============================================================================

function transformPlayer(
  sbPlayer: { id: number; name: string } | undefined,
  shirtNumber?: number
): Player | undefined {
  if (!sbPlayer) return undefined;
  return {
    id: String(sbPlayer.id),
    name: sbPlayer.name,
    shirtNumber,
  };
}

function transformTeam(sbTeam: { id: number; name: string }): Team {
  return {
    id: String(sbTeam.id),
    name: sbTeam.name,
  };
}

function transformShotEvent(event: StatsBombEvent): ShotEventData | undefined {
  if (!event.shot) return undefined;

  const { shot } = event;
  return {
    type: 'shot',
    endLocation: shot.end_location
      ? normalizeCoordinates([shot.end_location[0], shot.end_location[1]])
      : undefined,
    xg: shot.statsbomb_xg,
    bodyPart: mapBodyPart(shot.body_part?.id),
    outcome: mapShotOutcome(shot.outcome.id),
  };
}

function transformPassEvent(event: StatsBombEvent): PassEventData | undefined {
  if (!event.pass) return undefined;

  const { pass } = event;
  return {
    type: 'pass',
    endLocation: pass.end_location ? normalizeCoordinates(pass.end_location) : undefined,
    recipient: pass.recipient ? transformPlayer(pass.recipient) : undefined,
    height: pass.height ? mapPassHeight(pass.height.id) : undefined,
    bodyPart: mapBodyPart(pass.body_part?.id),
    outcome: mapPassOutcome(pass.outcome),
  };
}

function transformCarryEvent(event: StatsBombEvent): CarryEventData | undefined {
  if (!event.carry) return undefined;

  return {
    type: 'carry',
    endLocation: event.carry.end_location
      ? normalizeCoordinates(event.carry.end_location)
      : undefined,
  };
}

function transformTackleEvent(event: StatsBombEvent): TackleEventData | undefined {
  if (!event.duel) return undefined;

  return {
    type: 'tackle',
    outcome: mapTackleOutcome(event.duel.outcome),
    duelType: mapDuelType(event.duel.type?.id),
  };
}

function transformInterceptionEvent(event: StatsBombEvent): InterceptionEventData | undefined {
  if (!event.interception) return undefined;

  return {
    type: 'interception',
    outcome: mapInterceptionOutcome(event.interception.outcome.id),
  };
}

function getEventType(event: StatsBombEvent): EventType | null {
  switch (event.type.id) {
    case STATSBOMB_EVENT_TYPES.SHOT:
      return 'shot';
    case STATSBOMB_EVENT_TYPES.PASS:
      return 'pass';
    case STATSBOMB_EVENT_TYPES.CARRY:
      return 'carry';
    case STATSBOMB_EVENT_TYPES.DUEL:
      // Only tackle duels (type.id === 11)
      if (event.duel?.type?.id === 11) return 'tackle';
      return null;
    case STATSBOMB_EVENT_TYPES.INTERCEPTION:
      return 'interception';
    default:
      return null;
  }
}

function transformEvent(event: StatsBombEvent): MatchEvent | null {
  const eventType = getEventType(event);
  if (!eventType) return null;

  // Calculate timestamp as decimal minutes
  const timestamp = event.minute + event.second / 60;

  const matchEvent: MatchEvent = {
    id: event.id,
    type: eventType,
    timestamp,
    player: transformPlayer(event.player),
    team: event.team ? transformTeam(event.team) : undefined,
    location: event.location ? normalizeCoordinates(event.location) : undefined,
    meta: {
      period: String(event.period),
      possession: String(event.possession),
      ...(event.under_pressure && { underPressure: 'true' }),
    },
  };

  // Add type-specific event data
  switch (eventType) {
    case 'shot':
      matchEvent.eventData = transformShotEvent(event);
      break;
    case 'pass':
      matchEvent.eventData = transformPassEvent(event);
      break;
    case 'carry':
      matchEvent.eventData = transformCarryEvent(event);
      break;
    case 'tackle':
      matchEvent.eventData = transformTackleEvent(event);
      break;
    case 'interception':
      matchEvent.eventData = transformInterceptionEvent(event);
      break;
  }

  return matchEvent;
}

// =============================================================================
// MAIN ADAPTER
// =============================================================================

const STATSBOMB_OPEN_SOURCE: DataSource = {
  provider: 'statsbomb-open',
  name: 'StatsBomb Open Data',
  logo: 'https://statsbomb.com/wp-content/uploads/2021/10/SB_Logo_Primary_Colour.svg',
  url: 'https://github.com/statsbomb/open-data',
};

/**
 * Transform StatsBomb Open Data events into BTL's normalised schema.
 *
 * @param events - Array of StatsBomb events (from events JSON file)
 * @param options - Optional configuration
 * @returns Normalised match data
 *
 * @example
 * ```ts
 * import { fromStatsBombOpen } from '@breakingthelines/data-adapters/statsbomb-open';
 * import eventsJson from './3869685.json';
 *
 * const matchData = fromStatsBombOpen(eventsJson, {
 *   homeTeam: { shortName: 'ARG', primaryColor: '#75AADB' },
 *   awayTeam: { shortName: 'FRA', primaryColor: '#002654' },
 * });
 * ```
 */
export function fromStatsBombOpen(
  events: StatsBombEvent[],
  options: FromStatsBombOpenOptions = {}
): NormalizedMatchData {
  // Extract teams from events (first event with team info)
  const teamsFromEvents = extractTeamsFromEvents(events);

  // Build home/away teams with overrides
  const homeTeam: Team = {
    ...teamsFromEvents.home,
    ...options.homeTeam,
  };

  const awayTeam: Team = {
    ...teamsFromEvents.away,
    ...options.awayTeam,
  };

  // Extract match ID from match metadata or generate from first event
  const matchId = options.match?.match_id
    ? String(options.match.match_id)
    : events[0]?.id?.split('-')[0] || 'unknown';

  // Transform supported events
  const transformedEvents = events.map(transformEvent).filter((e): e is MatchEvent => e !== null);

  return {
    matchId,
    homeTeam,
    awayTeam,
    events: transformedEvents,
    source: STATSBOMB_OPEN_SOURCE,
    meta: options.meta,
  };
}

/**
 * Extract home and away teams from StatsBomb events.
 * Uses the Starting XI events to determine home/away.
 */
function extractTeamsFromEvents(events: StatsBombEvent[]): { home: Team; away: Team } {
  // Find Starting XI events (type 35) - first is usually home, second is away
  const startingXIs = events.filter((e) => e.type.id === STATSBOMB_EVENT_TYPES.STARTING_XI);

  if (startingXIs.length >= 2) {
    return {
      home: transformTeam(startingXIs[0].team),
      away: transformTeam(startingXIs[1].team),
    };
  }

  // Fallback: use possession_team from first events
  const teams = new Map<number, { id: number; name: string }>();
  for (const event of events) {
    if (event.team && !teams.has(event.team.id)) {
      teams.set(event.team.id, event.team);
    }
    if (teams.size >= 2) break;
  }

  const teamArray = Array.from(teams.values());
  return {
    home: transformTeam(teamArray[0] || { id: 0, name: 'Unknown Home' }),
    away: transformTeam(teamArray[1] || { id: 0, name: 'Unknown Away' }),
  };
}
