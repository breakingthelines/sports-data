/**
 * Core module - re-exports proto types and provides utilities.
 */

// Proto types and schemas
export {
  // Message types
  type NormalizedMatchData,
  type DataSource,
  type Team,
  type Player,
  type PitchCoordinates,
  type MatchEvent,
  type ShotEventData,
  type PassEventData,
  type TackleEventData,
  type CarryEventData,
  type InterceptionEventData,
  // Enums
  EventType,
  ShotOutcome,
  PassHeight,
  PassOutcome,
  TackleOutcome,
  DuelType,
  InterceptionOutcome,
  BodyPart,
  // Schemas
  NormalizedMatchDataSchema,
  DataSourceSchema,
  TeamSchema,
  PlayerSchema,
  PitchCoordinatesSchema,
  MatchEventSchema,
  ShotEventDataSchema,
  PassEventDataSchema,
  TackleEventDataSchema,
  CarryEventDataSchema,
  InterceptionEventDataSchema,
  // Protobuf create helper
  create,
} from './types.js';

// Utilities
export {
  // Type guards
  isShot,
  isPass,
  isTackle,
  isCarry,
  isInterception,
  // Enum name helpers
  eventTypeName,
  shotOutcomeName,
  passHeightName,
  passOutcomeName,
  tackleOutcomeName,
  duelTypeName,
  interceptionOutcomeName,
  bodyPartName,
} from './utils.js';
