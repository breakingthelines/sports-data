/**
 * Zod schemas for validating normalised match data.
 */

import { z } from 'zod';

// =============================================================================
// COORDINATES
// =============================================================================

export const pitchCoordinatesSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

// =============================================================================
// DATA SOURCE
// =============================================================================

export const dataSourceSchema = z.object({
  provider: z.string().min(1),
  name: z.string().min(1),
  logo: z.string().url().optional(),
  url: z.string().url().optional(),
});

// =============================================================================
// TEAM & PLAYER
// =============================================================================

export const teamSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shortName: z.string().max(5).optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  meta: z.record(z.string()).optional(),
});

export const playerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  shirtNumber: z.number().int().min(1).max(99).optional(),
  position: pitchCoordinatesSchema.optional(),
  meta: z.record(z.string()).optional(),
});

// =============================================================================
// ENUMS
// =============================================================================

export const eventTypeSchema = z.enum(['shot', 'pass', 'tackle', 'carry', 'interception']);

export const shotOutcomeSchema = z.enum(['goal', 'saved', 'missed', 'blocked', 'post']);

export const passHeightSchema = z.enum(['ground', 'low', 'high']);

export const passOutcomeSchema = z.enum(['successful', 'unsuccessful']);

export const tackleOutcomeSchema = z.enum(['won', 'lost']);

export const duelTypeSchema = z.enum(['ground', 'aerial']);

export const interceptionOutcomeSchema = z.enum(['won', 'lost']);

export const bodyPartSchema = z.enum(['right_foot', 'left_foot', 'head', 'other']);

// =============================================================================
// EVENT DATA
// =============================================================================

export const shotEventDataSchema = z.object({
  type: z.literal('shot'),
  endLocation: pitchCoordinatesSchema.optional(),
  xg: z.number().min(0).max(1).optional(),
  bodyPart: bodyPartSchema.optional(),
  outcome: shotOutcomeSchema.optional(),
});

export const passEventDataSchema = z.object({
  type: z.literal('pass'),
  endLocation: pitchCoordinatesSchema.optional(),
  recipient: playerSchema.optional(),
  height: passHeightSchema.optional(),
  bodyPart: bodyPartSchema.optional(),
  outcome: passOutcomeSchema.optional(),
});

export const tackleEventDataSchema = z.object({
  type: z.literal('tackle'),
  outcome: tackleOutcomeSchema.optional(),
  duelType: duelTypeSchema.optional(),
});

export const carryEventDataSchema = z.object({
  type: z.literal('carry'),
  endLocation: pitchCoordinatesSchema.optional(),
});

export const interceptionEventDataSchema = z.object({
  type: z.literal('interception'),
  outcome: interceptionOutcomeSchema.optional(),
});

export const matchEventDataSchema = z.discriminatedUnion('type', [
  shotEventDataSchema,
  passEventDataSchema,
  tackleEventDataSchema,
  carryEventDataSchema,
  interceptionEventDataSchema,
]);

// =============================================================================
// MATCH EVENT
// =============================================================================

export const matchEventSchema = z.object({
  id: z.string().min(1),
  type: eventTypeSchema,
  timestamp: z.number().min(0),
  player: playerSchema.optional(),
  team: teamSchema.optional(),
  location: pitchCoordinatesSchema.optional(),
  meta: z.record(z.string()).optional(),
  eventData: matchEventDataSchema.optional(),
});

// =============================================================================
// NORMALISED MATCH DATA
// =============================================================================

export const normalizedMatchDataSchema = z.object({
  matchId: z.string().min(1),
  homeTeam: teamSchema,
  awayTeam: teamSchema,
  events: z.array(matchEventSchema),
  source: dataSourceSchema,
  meta: z.record(z.string()).optional(),
});

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

import type { NormalizedMatchData } from './types.js';

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: z.ZodError };

/**
 * Validate match data and throw if invalid.
 */
export function validateMatchData(data: unknown): NormalizedMatchData {
  return normalizedMatchDataSchema.parse(data) as NormalizedMatchData;
}

/**
 * Safely validate match data without throwing.
 */
export function safeValidateMatchData(data: unknown): ValidationResult<NormalizedMatchData> {
  const result = normalizedMatchDataSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data as NormalizedMatchData };
  }
  return { success: false, error: result.error };
}
