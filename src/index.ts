/**
 * @breakingthelines/data-adapters
 *
 * Transform external sports data formats into BTL's normalised schema.
 */

// Core types and validation
export * from './core/index.js';

// StatsBomb Open Data adapter
export * from './statsbomb-open/index.js';

// Template adapter (for creating new providers)
export * from './template/index.js';
