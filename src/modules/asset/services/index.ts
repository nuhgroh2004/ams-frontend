/**
 * Service Layer Structure
 *
 * Services contain all business logic and API communication.
 * Services use Apollo Client for GraphQL queries/mutations.
 *
 * Pattern: Service → Apollo → Backend
 *
 * Services should NOT be imported directly in components.
 * Always use hooks as the abstraction layer.
 */

export * as assetService from './asset.service';

