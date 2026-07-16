/**
 * Permission System - RBAC
 *
 * Centralized permission checks for UI access control.
 * Based on ROLE_MATRIX.md as single source of truth.
 *
 * IMPORTANT: hasPermission() reads from Zustand store snapshot.
 * For React components, prefer hasPermissionForUser(user, permission)
 * and pass the reactive `user` from useAuthStore((state) => state.user).
 */

import { useAuthStore } from '@/modules/store';

// Centralized permission matrix based on ROLE_MATRIX.md
const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN_SISTEM: [
    'asset:view', 'asset:create', 'asset:edit', 'asset:delete', 'asset:export', 'asset:import',
    'loan:view', 'loan:create', 'loan:edit', 'loan:cancel', 'loan:return', 'loan:approve',
    'workflow:view', 'workflow:approve', 'workflow:reject',
    'transfer:view', 'transfer:create', 'transfer:approve', 'transfer:bast',
    'maintenance:view', 'maintenance:create', 'maintenance:complete',
    'disposal:view', 'disposal:approve',
    'loss:view', 'loss:approve',
    'user:view', 'user:create', 'user:edit', 'user:delete', 'role:manage',
    'report:view', 'report:generate', 'report:export', 'report:depreciation',
    'location:view', 'location:create', 'location:edit', 'location:delete',
    'unit:view',
    'procurement:view', 'procurement:create', 'procurement:delete',
    'inventory:view',
    'audit:view',
    'settings:view', 'settings:edit',
  ],
  OPERATOR_BMN: [
    'asset:view', 'asset:create', 'asset:edit', 'asset:delete', 'asset:export', 'asset:import',
    'loan:view', 'loan:create', 'loan:edit', 'loan:cancel', 'loan:return', 'loan:approve',
    'workflow:view', 'workflow:approve', 'workflow:reject',
    'transfer:view', 'transfer:create', 'transfer:approve', 'transfer:bast',
    'maintenance:view', 'maintenance:create', 'maintenance:complete',
    'disposal:view', 'disposal:create', 'disposal:approve',
    'loss:view', 'loss:approve',
    'user:view',
    'report:view', 'report:generate', 'report:export', 'report:depreciation',
    'location:view',
    'unit:view',
    'procurement:view', 'procurement:create', 'procurement:delete',
    'inventory:view', 'inventory:create', 'inventory:edit', 'inventory:bast',
    'settings:view',
  ],
  KEPALA_UNIT_KERJA: [
    'asset:view', 'asset:export',
    'loan:view', 'loan:create', 'loan:approve',
    'workflow:view', 'workflow:approve', 'workflow:reject',
    'transfer:view', 'transfer:create', 'transfer:approve', 'transfer:bast',
    'maintenance:view',
    'disposal:view', 'disposal:approve',
    'loss:view', 'loss:approve',
    'user:view',
    'report:view', 'report:generate', 'report:export',
    'location:view',
    'unit:view',
    'procurement:view',
    'inventory:view',
    'settings:view',
  ],
  USER_UMUM: [
    // Dashboard — limited view only
    // Assets — own assets only (backend enforces data scope)
    'asset:view',
    // Loans — create own + cancel own
    'loan:view', 'loan:create', 'loan:cancel',
    // Transfer (Mutasi) — create own proposal
    'transfer:view', 'transfer:create',
    // Loss Report — report own losses
    'loss:view', 'loss:report',
    // Settings — read only
    'settings:view',
    // NOTE: USER_UMUM does NOT have:
    //   procurement:view  → Procurement is admin/operator only
    //   inventory:view    → Inventory management is admin/operator only
    //   maintenance:view  → Maintenance is admin/operator only (USER_UMUM is read-only informational)
    //   disposal:view     → Disposal workflow is admin/operator/kepala only
    //   workflow:view     → Workflow inbox is for approvers only
    //   report:view       → Reports & Export is for management only
    //   audit:view        → Audit log is admin only
    //   location:view     → Location management is not needed by end users
    //   unit:view         → Unit management is not needed by end users
    //   user:view         → User management is not needed by end users
  ],
}

/**
 * Extract role names from a user object.
 * Supports user.roles[].nama_role and user.role string.
 */
function extractRoles(user: any): string[] {
  const roles: string[] = [];
  if (!user) return roles;

  if (Array.isArray(user.roles)) {
    user.roles.forEach((r: any) => {
      if (r && r.nama_role) roles.push(r.nama_role.toUpperCase());
    });
  }
  // Fallback: single role string field
  if (typeof user.role === 'string' && user.role) {
    roles.push(user.role.toUpperCase());
  }

  return roles;
}

/**
 * Reactive permission check — accepts user object explicitly.
 * Use this inside React components where user comes from useAuthStore((s) => s.user).
 * This ensures re-renders when the store updates after hydration.
 */
export function hasPermissionForUser(user: any, permission: string): boolean {
  if (!user) return false;

  const roles = extractRoles(user);

  if (roles.length === 0) {
    console.warn('[RBAC] No roles found for user:', user);
    return false;
  }

  const result = roles.some((roleName) => {
    const list = ROLE_PERMISSIONS[roleName] || [];
    return list.includes(permission);
  });

  console.debug(`[RBAC] user="${user.nama_lengkap}" roles=[${roles.join(',')}] permission="${permission}" → ${result}`);
  return result;
}

/**
 * Static snapshot permission check — reads from Zustand store directly.
 * Use ONLY in non-React contexts (e.g. route guards in useEffect, utility functions).
 * NOT suitable for reactive UI rendering — use hasPermissionForUser() in render logic instead.
 */
export function hasPermission(permission: string): boolean {
  const user = useAuthStore.getState().user as any;
  return hasPermissionForUser(user, permission);
}

// ============================================================
// Asset Permissions
// ============================================================

export function canViewAsset(): boolean { return hasPermission('asset:view'); }
export function canCreateAsset(): boolean { return hasPermission('asset:create'); }
export function canEditAsset(): boolean { return hasPermission('asset:edit'); }
export function canDeleteAsset(): boolean { return hasPermission('asset:delete'); }
export function canExportAsset(): boolean { return hasPermission('asset:export'); }
export function canImportAsset(): boolean { return hasPermission('asset:import'); }

// ============================================================
// Loan Permissions
// ============================================================

export function canViewLoan(): boolean { return hasPermission('loan:view'); }
export function canCreateLoan(): boolean { return hasPermission('loan:create'); }
export function canEditLoan(): boolean { return hasPermission('loan:edit'); }
export function canCancelLoan(): boolean { return hasPermission('loan:cancel'); }
export function canReturnLoan(): boolean { return hasPermission('loan:return'); }
export function canApproveLoan(): boolean { return hasPermission('loan:approve'); }

// ============================================================
// Workflow Permissions
// ============================================================

export function canApproveWorkflow(): boolean { return hasPermission('workflow:approve'); }
export function canRejectWorkflow(): boolean { return hasPermission('workflow:reject'); }
export function canViewWorkflow(): boolean { return hasPermission('workflow:view'); }

// ============================================================
// Transfer Permissions
// ============================================================

export function canViewTransfer(): boolean { return hasPermission('transfer:view'); }
export function canCreateTransfer(): boolean { return hasPermission('transfer:create'); }
export function canApproveTransfer(): boolean { return hasPermission('transfer:approve'); }
export function canDownloadBASTTransfer(): boolean { return hasPermission('transfer:bast'); }

// ============================================================
// Maintenance Permissions
// ============================================================

export function canViewMaintenance(): boolean { return hasPermission('maintenance:view'); }
export function canCreateMaintenance(): boolean { return hasPermission('maintenance:create'); }
export function canCompleteMaintenance(): boolean { return hasPermission('maintenance:complete'); }

// ============================================================
// Disposal Permissions
// ============================================================

export function canViewDisposal(): boolean { return hasPermission('disposal:view'); }
export function canCreateDisposal(): boolean { return hasPermission('disposal:create'); }
export function canApproveDisposal(): boolean { return hasPermission('disposal:approve'); }

// ============================================================
// Loss Permissions
// ============================================================

export function canViewLoss(): boolean { return hasPermission('loss:view'); }
export function canReportLoss(): boolean { return hasPermission('loss:report'); }
export function canApproveLoss(): boolean { return hasPermission('loss:approve'); }

// ============================================================
// User Management Permissions
// ============================================================

export function canViewUsers(): boolean { return hasPermission('user:view'); }
export function canCreateUser(): boolean { return hasPermission('user:create'); }
export function canEditUser(): boolean { return hasPermission('user:edit'); }
export function canDeleteUser(): boolean { return hasPermission('user:delete'); }
export function canManageRoles(): boolean { return hasPermission('role:manage'); }

// ============================================================
// Location & Room Permissions
// ============================================================

export function canViewLocation(): boolean { return hasPermission('location:view'); }
export function canCreateLocation(): boolean { return hasPermission('location:create'); }
export function canEditLocation(): boolean { return hasPermission('location:edit'); }
export function canDeleteLocation(): boolean { return hasPermission('location:delete'); }

// ============================================================
// Unit Kerja Permissions
// ============================================================

export function canViewUnit(): boolean { return hasPermission('unit:view'); }

// ============================================================
// Procurement Permissions
// ============================================================

export function canViewProcurement(): boolean { return hasPermission('procurement:view'); }
export function canCreateProcurement(): boolean { return hasPermission('procurement:create'); }
export function canDeleteProcurement(): boolean { return hasPermission('procurement:delete'); }

// ============================================================
// Stock Opname (Inventory) Permissions
// ============================================================

export function canViewInventory(): boolean { return hasPermission('inventory:view'); }
export function canCreateInventory(): boolean { return hasPermission('inventory:create'); }
export function canEditInventory(): boolean { return hasPermission('inventory:edit'); }
export function canSignBASTInventory(): boolean { return hasPermission('inventory:bast'); }

// ============================================================
// Audit Logs Permissions
// ============================================================

export function canViewAuditLog(): boolean { return hasPermission('audit:view'); }

// ============================================================
// Settings Permissions
// ============================================================

export function canViewSettings(): boolean { return hasPermission('settings:view'); }
export function canEditSettings(): boolean { return hasPermission('settings:edit'); }

// ============================================================
// Reporting Permissions
// ============================================================

export function canViewReports(): boolean { return hasPermission('report:view'); }
export function canGenerateReport(): boolean { return hasPermission('report:generate'); }
export function canExportReport(): boolean { return hasPermission('report:export'); }

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
