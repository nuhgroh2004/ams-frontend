/**
 * Permission System - RBAC
 *
 * Centralized permission checks for UI access control.
 * DO NOT hardcode roles in components.
 *
 * Usage:
 * if (canViewAsset()) { ... }
 * if (canEditAsset()) { ... }
 * if (canApproveWorkflow()) { ... }
 */

import { useAuthStore } from '@/modules/store';

/**
 * Get current user from auth store
 */
function getCurrentUser() {
  return useAuthStore.getState().user;
}

/**
 * Check if user has specific permission
 */
function hasPermission(permission: string): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.permissions.includes(permission);
}

// ============================================================
// Asset Permissions
// ============================================================

export function canViewAsset(): boolean {
  return hasPermission('asset:view');
}

export function canCreateAsset(): boolean {
  return hasPermission('asset:create');
}

export function canEditAsset(): boolean {
  return hasPermission('asset:edit');
}

export function canDeleteAsset(): boolean {
  return hasPermission('asset:delete');
}

export function canExportAsset(): boolean {
  return hasPermission('asset:export');
}

// ============================================================
// Loan Permissions
// ============================================================

export function canViewLoan(): boolean {
  return hasPermission('loan:view');
}

export function canCreateLoan(): boolean {
  return hasPermission('loan:create');
}

export function canEditLoan(): boolean {
  return hasPermission('loan:edit');
}

export function canCancelLoan(): boolean {
  return hasPermission('loan:cancel');
}

export function canReturnLoan(): boolean {
  return hasPermission('loan:return');
}

// ============================================================
// Workflow Permissions
// ============================================================

export function canApproveWorkflow(): boolean {
  return hasPermission('workflow:approve');
}

export function canRejectWorkflow(): boolean {
  return hasPermission('workflow:reject');
}

export function canViewWorkflow(): boolean {
  return hasPermission('workflow:view');
}

// ============================================================
// Transfer Permissions
// ============================================================

export function canViewTransfer(): boolean {
  return hasPermission('transfer:view');
}

export function canCreateTransfer(): boolean {
  return hasPermission('transfer:create');
}

export function canApproveTransfer(): boolean {
  return hasPermission('transfer:approve');
}

// ============================================================
// Maintenance Permissions
// ============================================================

export function canViewMaintenance(): boolean {
  return hasPermission('maintenance:view');
}

export function canCreateMaintenance(): boolean {
  return hasPermission('maintenance:create');
}

export function canCompleteMaintenance(): boolean {
  return hasPermission('maintenance:complete');
}

// ============================================================
// Disposal Permissions
// ============================================================

export function canViewDisposal(): boolean {
  return hasPermission('disposal:view');
}

export function canCreateDisposal(): boolean {
  return hasPermission('disposal:create');
}

export function canApproveDisposal(): boolean {
  return hasPermission('disposal:approve');
}

// ============================================================
// Loss Permissions
// ============================================================

export function canViewLoss(): boolean {
  return hasPermission('loss:view');
}

export function canReportLoss(): boolean {
  return hasPermission('loss:report');
}

export function canApproveLoss(): boolean {
  return hasPermission('loss:approve');
}

// ============================================================
// User Management Permissions
// ============================================================

export function canViewUsers(): boolean {
  return hasPermission('user:view');
}

export function canCreateUser(): boolean {
  return hasPermission('user:create');
}

export function canEditUser(): boolean {
  return hasPermission('user:edit');
}

export function canDeleteUser(): boolean {
  return hasPermission('user:delete');
}

export function canManageRoles(): boolean {
  return hasPermission('role:manage');
}

// ============================================================
// Reporting Permissions
// ============================================================

export function canViewReports(): boolean {
  return hasPermission('report:view');
}

export function canGenerateReport(): boolean {
  return hasPermission('report:generate');
}

export function canExportReport(): boolean {
  return hasPermission('report:export');
}

// ============================================================
// Helper: Check multiple permissions (AND)
// ============================================================

export function hasAllPermissions(...permissions: string[]): boolean {
  return permissions.every((p) => hasPermission(p));
}

// ============================================================
// Helper: Check multiple permissions (OR)
// ============================================================

export function hasAnyPermission(...permissions: string[]): boolean {
  return permissions.some((p) => hasPermission(p));
}
