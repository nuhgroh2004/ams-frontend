/**
 * Asset Service
 *
 * This service contains ONLY GraphQL queries and mutations.
 * Execution logic is handled by hooks using Apollo's useQuery/useMutation.
 *
 * Pattern:
 * - Hooks (useQuery/useMutation) → Apollo queries/mutations in this file
 * - No manual data fetching or execution
 *
 * For examples, see:
 * - src/graphql/queries/asset.query.ts
 * - src/graphql/mutations/asset.mutation.ts
 * - src/hooks/useAssets.ts (hook using queries)
 */

export { 
  GET_ASSETS, 
  GET_ASSET_BY_ID, 
  GET_ASSET_CATEGORIES 
} from './asset.query';

export { 
  CREATE_ASSET, 
  UPDATE_ASSET, 
  DELETE_ASSET 
} from './asset.mutation';

