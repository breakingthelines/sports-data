/**
 * Template adapter tests.
 *
 * Copy this file when creating a new adapter.
 * Replace placeholder tests with real test data from your provider.
 */

import { describe, it, expect } from 'vitest';

import { fromTemplate } from './adapter.js';
import type { TemplateEvent } from './types.js';
import { isShot, isPass, isCarry, EventType } from '#/core/index.js';

// =============================================================================
// TEST FIXTURES
// =============================================================================

/**
 * Minimal test fixture.
 * Replace with real sample data from your provider.
 */
const createMockEvent = (overrides: Partial<TemplateEvent> = {}): TemplateEvent => ({
  id: 'test-event-1',
  type: { id: 1, name: 'Shot' },
  timestamp: 10.5,
  player: { id: 1, name: 'Test Player' },
  team: { id: 1, name: 'Test Team' },
  location: [50, 50],
  ...overrides,
});

// =============================================================================
// TESTS
// =============================================================================

describe('Template adapter', () => {
  describe('fromTemplate', () => {
    it.todo('transforms events into normalised match data', () => {
      const events: TemplateEvent[] = [createMockEvent()];
      const result = fromTemplate(events);

      expect(result.matchId).toBeDefined();
      expect(result.homeTeam).toBeDefined();
      expect(result.awayTeam).toBeDefined();
      expect(result.events.length).toBeGreaterThan(0);
      expect(result.source).toBeDefined();
    });

    it.todo('extracts teams correctly', () => {
      // TODO: Test team extraction logic
    });

    it.todo('applies team overrides from options', () => {
      const events: TemplateEvent[] = [createMockEvent()];
      const result = fromTemplate(events, {
        homeTeam: { shortName: 'HME', primaryColor: '#FF0000' },
        awayTeam: { shortName: 'AWY', primaryColor: '#0000FF' },
      });

      expect(result.homeTeam?.shortName).toBe('HME');
      expect(result.homeTeam?.primaryColor).toBe('#FF0000');
    });

    it.todo('includes custom meta', () => {
      const events: TemplateEvent[] = [createMockEvent()];
      const result = fromTemplate(events, {
        meta: { competition: 'Test League' },
      });

      expect(result.meta).toEqual({ competition: 'Test League' });
    });
  });

  describe('coordinate normalisation', () => {
    it.todo('transforms provider coordinates to BTL (0-100)', () => {
      // TODO: Test coordinate transformation
      // Verify all coordinates are in 0-100 range
    });
  });

  describe('event type mapping', () => {
    it.todo('transforms shot events', () => {
      const events: TemplateEvent[] = [createMockEvent({ type: { id: 1, name: 'Shot' } })];
      const result = fromTemplate(events);
      const shots = result.events.filter(isShot);

      expect(shots.length).toBe(1);
      expect(shots[0].type).toBe(EventType.SHOT);
      expect(shots[0].eventData.case).toBe('shot');
    });

    it.todo('transforms pass events', () => {
      const events: TemplateEvent[] = [createMockEvent({ type: { id: 2, name: 'Pass' } })];
      const result = fromTemplate(events);
      const passes = result.events.filter(isPass);

      expect(passes.length).toBe(1);
      expect(passes[0].type).toBe(EventType.PASS);
    });

    it.todo('transforms carry events', () => {
      const events: TemplateEvent[] = [createMockEvent({ type: { id: 3, name: 'Carry' } })];
      const result = fromTemplate(events);
      const carries = result.events.filter(isCarry);

      expect(carries.length).toBe(1);
      expect(carries[0].type).toBe(EventType.CARRY);
    });

    it.todo('filters out unsupported event types', () => {
      const events: TemplateEvent[] = [createMockEvent({ type: { id: 999, name: 'Unknown' } })];
      const result = fromTemplate(events);

      expect(result.events.length).toBe(0);
    });
  });

  describe('data source attribution', () => {
    it.todo('includes provider attribution', () => {
      const events: TemplateEvent[] = [createMockEvent()];
      const result = fromTemplate(events);

      expect(result.source?.provider).toBe('template');
      expect(result.source?.name).toBeDefined();
    });
  });

  describe('enum mappings', () => {
    it.todo('maps shot outcomes correctly', () => {
      // TODO: Test shot outcome mapping
    });

    it.todo('maps pass heights correctly', () => {
      // TODO: Test pass height mapping
    });

    it.todo('maps body parts correctly', () => {
      // TODO: Test body part mapping
    });
  });
});
