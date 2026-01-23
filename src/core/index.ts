/**
 * Core module - types, schemas, and validation for normalised match data.
 */

// Types
export type {
  PitchCoordinates,
  DataSource,
  Team,
  Player,
  EventType,
  ShotOutcome,
  PassHeight,
  PassOutcome,
  TackleOutcome,
  DuelType,
  InterceptionOutcome,
  BodyPart,
  ShotEventData,
  PassEventData,
  TackleEventData,
  CarryEventData,
  InterceptionEventData,
  MatchEventData,
  MatchEvent,
  NormalizedMatchData,
} from './types.js';

// Type guards
export {
  isShotEvent,
  isPassEvent,
  isTackleEvent,
  isCarryEvent,
  isInterceptionEvent,
} from './types.js';

// Validation schemas
export {
  pitchCoordinatesSchema,
  dataSourceSchema,
  teamSchema,
  playerSchema,
  eventTypeSchema,
  shotOutcomeSchema,
  passHeightSchema,
  passOutcomeSchema,
  tackleOutcomeSchema,
  duelTypeSchema,
  interceptionOutcomeSchema,
  bodyPartSchema,
  shotEventDataSchema,
  passEventDataSchema,
  tackleEventDataSchema,
  carryEventDataSchema,
  interceptionEventDataSchema,
  matchEventDataSchema,
  matchEventSchema,
  normalizedMatchDataSchema,
} from './validation.js';

// Validation helpers
export type { ValidationResult } from './validation.js';
export { validateMatchData, safeValidateMatchData } from './validation.js';
