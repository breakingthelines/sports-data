/**
 * StatsBomb Open Data adapter.
 */

export { fromStatsBombOpen, type FromStatsBombOpenOptions } from './adapter.js';

export type {
  StatsBombEvent,
  StatsBombShot,
  StatsBombPass,
  StatsBombCarry,
  StatsBombDuel,
  StatsBombInterception,
  StatsBombMatch,
  StatsBombRef,
  StatsBombLocation,
  StatsBombLocation3D,
} from './types.js';

export {
  STATSBOMB_EVENT_TYPES,
  STATSBOMB_SHOT_OUTCOMES,
  STATSBOMB_PASS_HEIGHTS,
  STATSBOMB_BODY_PARTS,
  STATSBOMB_DUEL_TYPES,
  STATSBOMB_INTERCEPTION_OUTCOMES,
} from './types.js';
