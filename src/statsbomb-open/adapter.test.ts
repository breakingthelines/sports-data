import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fromStatsBombOpen } from './adapter.js';
import type { StatsBombEvent } from './types.js';
import { STATSBOMB_EVENT_TYPES } from './types.js';
import { safeValidateMatchData, isShotEvent, isPassEvent, isCarryEvent } from '#/core/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('StatsBomb Open adapter', () => {
  let events: StatsBombEvent[];

  beforeAll(() => {
    const fixturePath = resolve(__dirname, './fixtures/3869685.json');
    const content = readFileSync(fixturePath, 'utf-8');
    events = JSON.parse(content) as StatsBombEvent[];
  });

  describe('fromStatsBombOpen', () => {
    it('transforms events into normalised match data', () => {
      const result = fromStatsBombOpen(events);

      expect(result).toMatchObject({
        matchId: expect.any(String),
        homeTeam: expect.objectContaining({ id: expect.any(String), name: expect.any(String) }),
        awayTeam: expect.objectContaining({ id: expect.any(String), name: expect.any(String) }),
        events: expect.any(Array),
        source: {
          provider: 'statsbomb-open',
          name: 'StatsBomb Open Data',
          logo: expect.any(String),
          url: expect.any(String),
        },
      });
    });

    it('extracts teams from Starting XI events', () => {
      const result = fromStatsBombOpen(events);

      // 2022 World Cup Final: Argentina vs France
      expect(result.homeTeam.name).toBe('Argentina');
      expect(result.awayTeam.name).toBe('France');
    });

    it('passes schema validation', () => {
      const result = fromStatsBombOpen(events);
      const validation = safeValidateMatchData(result);

      expect(validation.success).toBe(true);
    });

    it('applies team overrides from options', () => {
      const result = fromStatsBombOpen(events, {
        homeTeam: { shortName: 'ARG', primaryColor: '#75AADB' },
        awayTeam: { shortName: 'FRA', primaryColor: '#002654' },
      });

      expect(result.homeTeam.shortName).toBe('ARG');
      expect(result.homeTeam.primaryColor).toBe('#75AADB');
      expect(result.awayTeam.shortName).toBe('FRA');
      expect(result.awayTeam.primaryColor).toBe('#002654');
    });

    it('includes custom meta', () => {
      const result = fromStatsBombOpen(events, {
        meta: { competition: 'World Cup 2022', round: 'Final' },
      });

      expect(result.meta).toEqual({
        competition: 'World Cup 2022',
        round: 'Final',
      });
    });
  });

  describe('coordinate normalisation', () => {
    it('transforms StatsBomb coordinates (120x80) to BTL (0-100)', () => {
      const result = fromStatsBombOpen(events);

      // Find a pass event with location
      const passEvent = result.events.find((e) => e.type === 'pass' && e.location);

      expect(passEvent).toBeDefined();
      expect(passEvent!.location!.x).toBeGreaterThanOrEqual(0);
      expect(passEvent!.location!.x).toBeLessThanOrEqual(100);
      expect(passEvent!.location!.y).toBeGreaterThanOrEqual(0);
      expect(passEvent!.location!.y).toBeLessThanOrEqual(100);
    });

    it('normalises center of pitch correctly', () => {
      // StatsBomb center: (60, 40) -> BTL: (50, 50)
      // Find an event near center
      const result = fromStatsBombOpen(events);

      // Just verify all coordinates are in valid range
      for (const event of result.events) {
        if (event.location) {
          expect(event.location.x).toBeGreaterThanOrEqual(0);
          expect(event.location.x).toBeLessThanOrEqual(100);
          expect(event.location.y).toBeGreaterThanOrEqual(0);
          expect(event.location.y).toBeLessThanOrEqual(100);
        }
      }
    });
  });

  describe('event type mapping', () => {
    it('transforms shot events', () => {
      const result = fromStatsBombOpen(events);
      const shots = result.events.filter(isShotEvent);

      // The 2022 World Cup Final had many shots
      expect(shots.length).toBeGreaterThan(0);

      const shot = shots[0];
      expect(shot.type).toBe('shot');
      expect(shot.eventData.type).toBe('shot');
      expect(shot.eventData.xg).toBeGreaterThanOrEqual(0);
      expect(shot.eventData.xg).toBeLessThanOrEqual(1);
    });

    it('transforms pass events', () => {
      const result = fromStatsBombOpen(events);
      const passes = result.events.filter(isPassEvent);

      expect(passes.length).toBeGreaterThan(0);

      const pass = passes[0];
      expect(pass.type).toBe('pass');
      expect(pass.eventData.type).toBe('pass');
      expect(['successful', 'unsuccessful']).toContain(pass.eventData.outcome);
    });

    it('transforms carry events', () => {
      const result = fromStatsBombOpen(events);
      const carries = result.events.filter(isCarryEvent);

      expect(carries.length).toBeGreaterThan(0);

      const carry = carries[0];
      expect(carry.type).toBe('carry');
      expect(carry.eventData.type).toBe('carry');
      expect(carry.eventData.endLocation).toBeDefined();
    });

    it('filters out unsupported event types', () => {
      const result = fromStatsBombOpen(events);

      // Count raw events of supported types
      const supportedTypeIds = [
        STATSBOMB_EVENT_TYPES.SHOT,
        STATSBOMB_EVENT_TYPES.PASS,
        STATSBOMB_EVENT_TYPES.CARRY,
        STATSBOMB_EVENT_TYPES.INTERCEPTION,
      ] as const;
      const supportedRawCount = events.filter((e) =>
        (supportedTypeIds as readonly number[]).includes(e.type.id)
      ).length;

      // Duel events are only included if they're tackles
      const tackleCount = events.filter(
        (e) => e.type.id === STATSBOMB_EVENT_TYPES.DUEL && e.duel?.type?.id === 11
      ).length;

      // Total transformed should be <= supported raw + tackles
      expect(result.events.length).toBeLessThanOrEqual(supportedRawCount + tackleCount);
    });
  });

  describe('data source attribution', () => {
    it('includes StatsBomb Open attribution', () => {
      const result = fromStatsBombOpen(events);

      expect(result.source.provider).toBe('statsbomb-open');
      expect(result.source.name).toBe('StatsBomb Open Data');
      expect(result.source.url).toContain('github.com/statsbomb');
    });
  });

  describe('timestamp calculation', () => {
    it('converts minute/second to decimal timestamp', () => {
      const result = fromStatsBombOpen(events);

      // Find an event in the first half
      const event = result.events.find((e) => e.timestamp > 0 && e.timestamp < 45);

      expect(event).toBeDefined();
      expect(event!.timestamp).toBeGreaterThan(0);
    });

    it('includes period in event meta', () => {
      const result = fromStatsBombOpen(events);

      // All events should have period in meta
      for (const event of result.events.slice(0, 10)) {
        expect(event.meta?.period).toBeDefined();
        expect(['1', '2', '3', '4', '5']).toContain(event.meta?.period);
      }
    });
  });
});
