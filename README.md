# @breakingthelines/data-adapters

Transform external sports data formats into BTL's normalised schema.

## Installation

```bash
# Configure npm for GitHub Packages (one-time)
echo "@breakingthelines:registry=https://npm.pkg.github.com" >> ~/.npmrc

# Install
bun add @breakingthelines/data-adapters
```

## Usage

### StatsBomb Open Data

```typescript
import { fromStatsBombOpen } from '@breakingthelines/data-adapters/statsbomb-open';

const events = await fetch('path/to/statsbomb-events.json').then(r => r.json());

const matchData = fromStatsBombOpen(events, {
  homeTeam: { shortName: 'ARG', primaryColor: '#75AADB' },
  awayTeam: { shortName: 'FRA', primaryColor: '#002654' },
});

// matchData is now in BTL's normalised schema
console.log(matchData.events.filter(e => e.type === 'shot'));
```

### Validation

```typescript
import { validateMatchData, safeValidateMatchData } from '@breakingthelines/data-adapters/core';

// Throws on invalid data
const validated = validateMatchData(matchData);

// Returns { success: boolean, data?, error? }
const result = safeValidateMatchData(matchData);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### Type Guards

```typescript
import { isShotEvent, isPassEvent } from '@breakingthelines/data-adapters/core';

for (const event of matchData.events) {
  if (isShotEvent(event)) {
    console.log(`Shot with xG: ${event.eventData.xg}`);
  }
  if (isPassEvent(event)) {
    console.log(`Pass to: ${event.eventData.recipient?.name}`);
  }
}
```

## Supported Providers

| Provider                                                 | Import                                           | Status |
| -------------------------------------------------------- | ------------------------------------------------ | ------ |
| [StatsBomb Open](https://github.com/statsbomb/open-data) | `@breakingthelines/data-adapters/statsbomb-open` | Stable |

## Normalised Schema

All adapters output data conforming to `btl/game/v1/types/football/football.proto`:

```typescript
interface NormalizedMatchData {
  matchId: string;
  homeTeam: Team;
  awayTeam: Team;
  events: MatchEvent[];
  source: DataSource;
  meta?: Record<string, string>;
}

interface MatchEvent {
  id: string;
  type: 'shot' | 'pass' | 'tackle' | 'carry' | 'interception';
  timestamp: number;  // Match minute (e.g., 45.5)
  player?: Player;
  team?: Team;
  location?: PitchCoordinates;  // 0-100 normalised
  eventData?: ShotEventData | PassEventData | ...;
}
```

## Coordinate System

All coordinates are normalised to **0-100** for both axes:

- **X**: 0 = own goal line, 100 = opposition goal line
- **Y**: 0 = left touchline, 100 = right touchline

## Adding New Providers

See [`src/template/README.md`](./src/template/README.md) for a guide on creating new adapters.

## Development

```bash
# Install dependencies
bun install

# Run tests
bun test

# Type check
bun run check

# Lint
bun run lint

# Format
bun run format

# Build
bun run build
```

## License

AGPL-3.0
