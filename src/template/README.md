# Template Adapter

This is a template for creating new data provider adapters.

## Creating a New Adapter

1. **Copy this directory** to `src/your-provider/`

2. **Define raw types** in `types.ts`:
   - Model your provider's JSON/API response structure
   - Include all fields you need for transformation

3. **Implement the adapter** in `adapter.ts`:
   - Coordinate normalisation (convert to 0-100)
   - Event type mapping
   - Enum mappings (outcomes, body parts, etc.)
   - Player/team transformation

4. **Write tests** in `adapter.test.ts`:
   - Use real fixture data from your provider
   - Test schema validation passes
   - Test coordinate normalisation
   - Test all event type mappings

5. **Add documentation** in `README.md`:
   - Provider information and data license
   - Coordinate system details
   - Supported event types
   - Usage examples

6. **Export from package**:
   - Create `index.ts` with exports
   - Add to `src/index.ts`
   - Add export path to `package.json`

## Coordinate Systems

Different providers use different coordinate systems. Common examples:

| Provider  | Dimensions | Origin      |
| --------- | ---------- | ----------- |
| StatsBomb | 120x80     | Bottom-left |
| Opta      | 100x100    | Bottom-left |
| Wyscout   | 100x100    | Top-left    |
| Metrica   | Variable   | Center      |

BTL normalises to **0-100** for both axes:

- X: 0 = own goal line, 100 = opposition goal line
- Y: 0 = left touchline, 100 = right touchline

## Checklist

- [ ] Raw types defined in `types.ts`
- [ ] Coordinate normalisation implemented
- [ ] Event types mapped to BTL schema
- [ ] Enums mapped (outcomes, body parts, heights)
- [ ] Player and team transformation
- [ ] Data source attribution included
- [ ] Tests written with real fixtures
- [ ] Schema validation passes
- [ ] README documentation complete
- [ ] Exported from package
