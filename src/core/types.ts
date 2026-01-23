/**
 * Core types for normalised football match data.
 *
 * These types mirror the proto definitions in btl/game/v1/types/football/football.proto.
 *
 * TODO: Once @breakingthelines/protos publishes football types (btl/game/v1), re-export from:
 * `@breakingthelines/protos/btl/game/v1/types/football/football_pb`
 *
 * For better TypeScript DX, enums use string literals instead of proto's SCREAMING_SNAKE_CASE.
 * The adapter layer handles mapping between StatsBomb/other formats and these normalised types.
 */

// =============================================================================
// COORDINATES
// =============================================================================

/** Normalised pitch coordinates (0-100 for both axes) */
export interface PitchCoordinates {
  /** 0 = own goal line, 100 = opposition goal line */
  x: number;
  /** 0 = left touchline, 100 = right touchline */
  y: number;
}

// =============================================================================
// DATA SOURCE
// =============================================================================

/** Attribution for the data provider */
export interface DataSource {
  /** Provider identifier, e.g., "statsbomb-open" */
  provider: string;
  /** Display name, e.g., "StatsBomb Open Data" */
  name: string;
  /** URL to provider logo */
  logo?: string;
  /** Provider website URL */
  url?: string;
}

// =============================================================================
// TEAM & PLAYER
// =============================================================================

export interface Team {
  id: string;
  name: string;
  /** Max 5 chars, e.g., "ARS" */
  shortName?: string;
  /** Hex color, e.g., "#EF0107" */
  primaryColor?: string;
  /** Hex color */
  secondaryColor?: string;
  meta?: Record<string, string>;
}

export interface Player {
  id: string;
  name: string;
  /** Shirt number (1-99) */
  shirtNumber?: number;
  /** Average/current position on pitch */
  position?: PitchCoordinates;
  meta?: Record<string, string>;
}

// =============================================================================
// ENUMS - TypeScript-friendly string literals
// =============================================================================

export type EventType = 'shot' | 'pass' | 'tackle' | 'carry' | 'interception';

export type ShotOutcome = 'goal' | 'saved' | 'missed' | 'blocked' | 'post';

export type PassHeight = 'ground' | 'low' | 'high';

export type PassOutcome = 'successful' | 'unsuccessful';

export type TackleOutcome = 'won' | 'lost';

export type DuelType = 'ground' | 'aerial';

export type InterceptionOutcome = 'won' | 'lost';

export type BodyPart = 'right_foot' | 'left_foot' | 'head' | 'other';

// =============================================================================
// EVENT DATA
// =============================================================================

export interface ShotEventData {
  type: 'shot';
  endLocation?: PitchCoordinates;
  /** Expected goals (0-1) */
  xg?: number;
  bodyPart?: BodyPart;
  outcome?: ShotOutcome;
}

export interface PassEventData {
  type: 'pass';
  endLocation?: PitchCoordinates;
  recipient?: Player;
  height?: PassHeight;
  bodyPart?: BodyPart;
  outcome?: PassOutcome;
}

export interface TackleEventData {
  type: 'tackle';
  outcome?: TackleOutcome;
  duelType?: DuelType;
}

export interface CarryEventData {
  type: 'carry';
  endLocation?: PitchCoordinates;
}

export interface InterceptionEventData {
  type: 'interception';
  outcome?: InterceptionOutcome;
}

export type MatchEventData =
  | ShotEventData
  | PassEventData
  | TackleEventData
  | CarryEventData
  | InterceptionEventData;

// =============================================================================
// MATCH EVENT
// =============================================================================

export interface MatchEvent {
  id: string;
  type: EventType;
  /** Match minute (e.g., 45.5 = 45'30") */
  timestamp: number;
  player?: Player;
  team?: Team;
  location?: PitchCoordinates;
  meta?: Record<string, string>;
  /** Type-specific event data */
  eventData?: MatchEventData;
}

// =============================================================================
// NORMALISED MATCH DATA
// =============================================================================

export interface NormalizedMatchData {
  matchId: string;
  homeTeam: Team;
  awayTeam: Team;
  events: MatchEvent[];
  source: DataSource;
  meta?: Record<string, string>;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isShotEvent(event: MatchEvent): event is MatchEvent & { eventData: ShotEventData } {
  return event.type === 'shot' && event.eventData?.type === 'shot';
}

export function isPassEvent(event: MatchEvent): event is MatchEvent & { eventData: PassEventData } {
  return event.type === 'pass' && event.eventData?.type === 'pass';
}

export function isTackleEvent(
  event: MatchEvent
): event is MatchEvent & { eventData: TackleEventData } {
  return event.type === 'tackle' && event.eventData?.type === 'tackle';
}

export function isCarryEvent(
  event: MatchEvent
): event is MatchEvent & { eventData: CarryEventData } {
  return event.type === 'carry' && event.eventData?.type === 'carry';
}

export function isInterceptionEvent(
  event: MatchEvent
): event is MatchEvent & { eventData: InterceptionEventData } {
  return event.type === 'interception' && event.eventData?.type === 'interception';
}
