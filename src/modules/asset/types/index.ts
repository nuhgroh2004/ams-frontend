/**
 * Asset Module Types
 *
 * Keep in sync with:
 * - GraphQL schema
 * - Backend API types
 * - Zod validation schemas
 */

export interface AssetDTO {
  id: string;
  code: string;
  name: string;
  description?: string;
  category: string;
  status: 'active' | 'inactive' | 'maintenance' | 'disposed';
  location: string;
  acquisitionDate: string;
  acquisitionCost: number;
  currentValue: number;
  owner: string;
  department: string;
  warrantyExpiry?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssetListResponse {
  items: AssetDTO[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
