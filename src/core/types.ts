/**
 * Re-export proto types from generated folder.
 * These types are synced from the protos repo via GitHub Actions.
 */

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
  // Schemas (for creating messages)
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
} from '#/generated/game/v1/types/football/football_pb.js';

// Re-export create from protobuf for convenience
export { create } from '@bufbuild/protobuf';
