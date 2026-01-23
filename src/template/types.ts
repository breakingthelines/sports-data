/**
 * Template adapter - raw types from your data provider.
 *
 * Replace this file with types matching your provider's JSON/API schema.
 *
 * @example
 * ```typescript
 * export interface ProviderEvent {
 *   event_id: string;
 *   event_type: string;
 *   match_time: number;
 *   x_coord: number;
 *   y_coord: number;
 *   // ... provider-specific fields
 * }
 * ```
 */

export interface TemplateEvent {
  id: string;
  type: string;
  minute: number;
  second: number;
  x: number;
  y: number;
  // Add your provider-specific fields here
}

export interface TemplateMatch {
  matchId: string;
  homeTeam: { id: string; name: string };
  awayTeam: { id: string; name: string };
  events: TemplateEvent[];
}
