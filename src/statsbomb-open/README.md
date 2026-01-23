# StatsBomb Open Data Adapter

Transforms [StatsBomb Open Data](https://github.com/statsbomb/open-data) events into BTL's normalised schema.

## Usage

```typescript
import { fromStatsBombOpen } from '@breakingthelines/data-adapters/statsbomb-open';

// Load StatsBomb events JSON
const events = await fetch('path/to/events.json').then(r => r.json());

const matchData = fromStatsBombOpen(events, {
  homeTeam: { shortName: 'ARG', primaryColor: '#75AADB' },
  awayTeam: { shortName: 'FRA', primaryColor: '#002654' },
  meta: { competition: 'World Cup 2022' },
});
```

## Coordinate System

StatsBomb uses a **120x80** coordinate system where:

- X: 0-120 (left to right, attacking direction)
- Y: 0-80 (bottom to top)

BTL normalises to **0-100** for both axes:

- X: 0 = own goal line, 100 = opposition goal line
- Y: 0 = left touchline, 100 = right touchline

```
StatsBomb (120x80)              BTL (0-100)
┌────────────────────┐          ┌────────────────────┐
│         80         │          │        100         │
│                    │          │                    │
│ 0              120 │    →     │ 0               100│
│                    │          │                    │
│          0         │          │         0          │
└────────────────────┘          └────────────────────┘
```

## Supported Event Types

| StatsBomb Type    | BTL Type       | Notes                               |
| ----------------- | -------------- | ----------------------------------- |
| Shot (16)         | `shot`         | Includes xG, outcome, body part     |
| Pass (30)         | `pass`         | Includes height, recipient, outcome |
| Carry (43)        | `carry`        | Ball progression events             |
| Duel (4)          | `tackle`       | Only tackle duels (type.id=11)      |
| Interception (10) | `interception` | Won/lost outcome                    |

Other StatsBomb event types (clearances, fouls, etc.) are filtered out.

## Data Source Attribution

All transformed data includes StatsBomb attribution:

```typescript
{
  source: {
    provider: 'statsbomb-open',
    name: 'StatsBomb Open Data',
    logo: 'https://statsbomb.com/...',
    url: 'https://github.com/statsbomb/open-data',
  }
}
```

## Enum Mappings

### Shot Outcomes

| StatsBomb                      | BTL         |
| ------------------------------ | ----------- |
| Goal (97)                      | `'goal'`    |
| Saved (100, 115, 116)          | `'saved'`   |
| Off Target (98), Wayward (101) | `'missed'`  |
| Blocked (96)                   | `'blocked'` |
| Post (99)                      | `'post'`    |

### Pass Heights

| StatsBomb       | BTL        |
| --------------- | ---------- |
| Ground Pass (1) | `'ground'` |
| Low Pass (2)    | `'low'`    |
| High Pass (3)   | `'high'`   |

### Body Parts

| StatsBomb       | BTL            |
| --------------- | -------------- |
| Right Foot (40) | `'right_foot'` |
| Left Foot (38)  | `'left_foot'`  |
| Head (37)       | `'head'`       |
| Other           | `'other'`      |

## License

StatsBomb Open Data is provided under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
