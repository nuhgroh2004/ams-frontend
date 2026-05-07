/**
 * Asset Validation Schemas
 *
 * Using Zod for schema validation
 * These schemas are reusable across the application
 *
 * Note: Keep schemas in sync with GraphQL schema and API types
 */

import { z } from 'zod';

// Create Asset Schema
export const createAssetSchema = z.object({
  code: z.string().min(1, 'Code is required').max(50, 'Code must be less than 50 characters'),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(1, 'Location is required'),
  acquisitionCost: z.number().positive('Acquisition cost must be positive'),
  owner: z.string().min(1, 'Owner is required'),
  department: z.string().min(1, 'Department is required'),
  warrantyExpiry: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type CreateAssetInput = z.infer<typeof createAssetSchema>;

// Update Asset Schema
export const updateAssetSchema = createAssetSchema.partial();

export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;

// Filter Schema
export const assetFilterSchema = z.object({
  category: z.string().optional(),
  status: z.enum(['active', 'inactive', 'maintenance', 'disposed']).optional(),
  department: z.string().optional(),
  search: z.string().optional(),
});

export type AssetFilterInput = z.infer<typeof assetFilterSchema>;
