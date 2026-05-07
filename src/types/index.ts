/**
 * Base Types for AMS System
 *
 * All types should be kept in sync with GraphQL schema.
 * These types represent domain models used across the app.
 */

// ============================================================
// Export all database types
// ============================================================

export * from './database';

// ============================================================
// Common Types
// ============================================================

export interface BasePaginationParams {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
}

// ============================================================
// Workflow & Approval Types
// ============================================================

export interface ApprovalRecord {
    id: number;
    action: 'approved' | 'rejected' | 'commented';
    approverName: string;
    timestamp: Date | string;
    comment?: string | null;
}