/**
 * Template adapter tests.
 *
 * These are placeholder tests using .todo() - implement them for your adapter.
 */

import { describe, it, expect } from 'vitest';
import { fromTemplate } from './adapter.js';
import type { TemplateMatch } from './types.js';
import { safeValidateMatchData } from '#/core/index.js';

// Sample fixture - replace with real data from your provider
const sampleMatch: TemplateMatch = {
  matchId: 'test-match-1',
  homeTeam: { id: 'home-1', name: 'Home FC' },
  awayTeam: { id: 'away-1', name: 'Away United' },
  events: [
    { id: 'evt-1', type: 'pass', minute: 1, second: 30, x: 50, y: 50 },
    { id: 'evt-2', type: 'shot', minute: 12, second: 0, x: 90, y: 40 },
    { id: 'evt-3', type: 'carry', minute: 15, second: 45, x: 60, y: 30 },
  ],
};

describe('Template adapter', () => {
  describe('fromTemplate', () => {
    it('transforms match data into normalised schema', () => {
      const result = fromTemplate(sampleMatch);

      expect(result).toMatchObject({
        matchId: 'test-match-1',
        homeTeam: { id: 'home-1', name: 'Home FC' },
        awayTeam: { id: 'away-1', name: 'Away United' },
        events: expect.any(Array),
        source: expect.objectContaining({ provider: 'template' }),
      });
    });

    it('passes schema validation', () => {
      const result = fromTemplate(sampleMatch);
      const validation = safeValidateMatchData(result);

      expect(validation.success).toBe(true);
    });

    it('applies team overrides', () => {
      const result = fromTemplate(sampleMatch, {
        homeTeam: { shortName: 'HFC' },
        awayTeam: { shortName: 'AWY' },
      });

      expect(result.homeTeam.shortName).toBe('HFC');
      expect(result.awayTeam.shortName).toBe('AWY');
    });
  });

  describe('coordinate normalisation', () => {
    it.todo('transforms provider coordinates to BTL (0-100)');
  });

  describe('event type mapping', () => {
    it.todo('maps shot events correctly');
    it.todo('maps pass events correctly');
    it.todo('maps carry events correctly');
    it.todo('filters unsupported event types');
  });

  describe('enum mappings', () => {
    it.todo('maps shot outcomes');
    it.todo('maps pass heights');
    it.todo('maps body parts');
  });
});
