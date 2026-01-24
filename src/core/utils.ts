/**
 * Utility functions for working with proto types.
 * Provides better DX for common operations.
 */

import {
  type MatchEvent,
  type ShotEventData,
  type PassEventData,
  type TackleEventData,
  type CarryEventData,
  type InterceptionEventData,
  EventType,
  ShotOutcome,
  PassHeight,
  PassOutcome,
  TackleOutcome,
  DuelType,
  InterceptionOutcome,
  BodyPart,
} from './types.js';

// =============================================================================
// TYPE GUARDS
// =============================================================================

export function isShot(
  event: MatchEvent
): event is MatchEvent & { eventData: { case: 'shot'; value: ShotEventData } } {
  return event.eventData.case === 'shot';
}

export function isPass(
  event: MatchEvent
): event is MatchEvent & { eventData: { case: 'pass'; value: PassEventData } } {
  return event.eventData.case === 'pass';
}

export function isTackle(
  event: MatchEvent
): event is MatchEvent & { eventData: { case: 'tackle'; value: TackleEventData } } {
  return event.eventData.case === 'tackle';
}

export function isCarry(
  event: MatchEvent
): event is MatchEvent & { eventData: { case: 'carry'; value: CarryEventData } } {
  return event.eventData.case === 'carry';
}

export function isInterception(
  event: MatchEvent
): event is MatchEvent & { eventData: { case: 'interception'; value: InterceptionEventData } } {
  return event.eventData.case === 'interception';
}

// =============================================================================
// ENUM TO STRING HELPERS
// =============================================================================

export const eventTypeName: Record<EventType, string> = {
  [EventType.UNSPECIFIED]: 'unspecified',
  [EventType.SHOT]: 'shot',
  [EventType.PASS]: 'pass',
  [EventType.TACKLE]: 'tackle',
  [EventType.CARRY]: 'carry',
  [EventType.INTERCEPTION]: 'interception',
};

export const shotOutcomeName: Record<ShotOutcome, string> = {
  [ShotOutcome.UNSPECIFIED]: 'unspecified',
  [ShotOutcome.GOAL]: 'goal',
  [ShotOutcome.SAVED]: 'saved',
  [ShotOutcome.MISSED]: 'missed',
  [ShotOutcome.BLOCKED]: 'blocked',
  [ShotOutcome.POST]: 'post',
};

export const passHeightName: Record<PassHeight, string> = {
  [PassHeight.UNSPECIFIED]: 'unspecified',
  [PassHeight.GROUND]: 'ground',
  [PassHeight.LOW]: 'low',
  [PassHeight.HIGH]: 'high',
};

export const passOutcomeName: Record<PassOutcome, string> = {
  [PassOutcome.UNSPECIFIED]: 'unspecified',
  [PassOutcome.SUCCESSFUL]: 'successful',
  [PassOutcome.UNSUCCESSFUL]: 'unsuccessful',
};

export const tackleOutcomeName: Record<TackleOutcome, string> = {
  [TackleOutcome.UNSPECIFIED]: 'unspecified',
  [TackleOutcome.WON]: 'won',
  [TackleOutcome.LOST]: 'lost',
};

export const duelTypeName: Record<DuelType, string> = {
  [DuelType.UNSPECIFIED]: 'unspecified',
  [DuelType.GROUND]: 'ground',
  [DuelType.AERIAL]: 'aerial',
};

export const interceptionOutcomeName: Record<InterceptionOutcome, string> = {
  [InterceptionOutcome.UNSPECIFIED]: 'unspecified',
  [InterceptionOutcome.WON]: 'won',
  [InterceptionOutcome.LOST]: 'lost',
};

export const bodyPartName: Record<BodyPart, string> = {
  [BodyPart.UNSPECIFIED]: 'unspecified',
  [BodyPart.RIGHT_FOOT]: 'right_foot',
  [BodyPart.LEFT_FOOT]: 'left_foot',
  [BodyPart.HEAD]: 'head',
  [BodyPart.OTHER]: 'other',
};
