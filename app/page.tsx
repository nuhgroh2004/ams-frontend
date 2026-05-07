import React from 'react';
import { AppButton } from '@/components/primitives';
import { Box } from 'lucide-react';
import App from 'next/app';
/**
 * Home Page - Foundation Status
 *
 * This page displays the foundation setup status.
 * In production, this will be replaced with the dashboard.
 *
 * DO NOT build business features on this page.
 * This is for foundation verification only.
 */

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            AMS Frontend Foundation
          </h1>
          <p className="mt-4 text-xl text-green-600 dark:text-gray-400">
            Asset Management System - Foundation Setup Complete
          </p>

         
        </div>
  <div className="mt-8 flex flex-wrap justify-center gap-4">
            <AppButton>Primary (Navy)</AppButton>
            <AppButton variant="secondary">Secondary (Blue)</AppButton>
            <AppButton className="bg-success text-white">Success (Green)</AppButton>
            <AppButton className="bg-warning text-white">Warning (Yellow)</AppButton>
            <AppButton variant="danger">Destructive (Red)</AppButton>
          </div>
          
        {/* Foundation Status */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Project Structure',
              status: '✓',
              items: ['src/ folder', 'modules/', 'components/', 'lib/', 'store/', 'hooks/', 'types/'],
            },
            {
              title: 'Core Stack',
              status: '✓',
              items: ['Next.js (App Router)', 'TypeScript', 'Tailwind CSS', 'Apollo Client', 'Zustand'],
            },
            {
              title: 'Base Systems',
              status: '✓',
              items: ['Apollo Client configured', 'Zustand stores ready', 'Permission system', 'DataTable', 'FormWrapper'],
            },
            {
              title: 'Data Flow',
              status: '✓',
              items: ['Component → Hook → Service', 'Apollo Client setup', 'Service layer structure', 'Schema validation (Zod)'],
            },
            {
              title: 'State Management',
              status: '✓',
              items: [
                'Auth store (Zustand)',
                'UI store (Zustand)',
                'Apollo cache',
                'Global filters support',
              ],
            },
            {
              title: 'Workflow UI',
              status: '⏳',
              items: ['ApprovalTimeline component', 'ApprovalAction component', 'Workflow integration (TBD)'],
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {item.title}
                </h3>
                <span
                  className={`text-2xl ${
                    item.status === '✓' ? 'text-green-500' : 'text-yellow-500'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <ul className="mt-4 space-y-2">
                {item.items.map((i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                    • {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="mt-16 rounded-lg border-2 border-blue-200 bg-blue-50 p-8 dark:border-blue-900 dark:bg-blue-900/20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Next Steps</h2>
          <ul className="mt-4 space-y-3 text-gray-700 dark:text-gray-300">
            <li>
              1. <strong>Setup Environment:</strong> Copy `.env.local.example` to `.env.local` and configure
              GraphQL endpoint
            </li>
            <li>
              2. <strong>Setup Backend:</strong> Connect to actual GraphQL backend when available
            </li>
            <li>
              3. <strong>Implement Services:</strong> Replace service placeholders with actual GraphQL queries
            </li>
            <li>
              4. <strong>Build Features:</strong> Start building feature modules following the foundation architecture
            </li>
            <li>
              5. <strong>Navigation:</strong> Build sidebar navigation and routing structure
            </li>
          </ul>
        </div>

        {/* Architecture Reference */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Data Flow Architecture</h2>
          <div className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-8 font-mono text-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-gray-700 dark:text-gray-300">
              <div>Component</div>
              <div className="ml-4 text-gray-500">↓</div>
              <div>Custom Hook (useAssets, useLoans, etc.)</div>
              <div className="ml-4 text-gray-500">↓</div>
              <div>Service Layer (asset.service.ts, loan.service.ts)</div>
              <div className="ml-4 text-gray-500">↓</div>
              <div>Apollo Client</div>
              <div className="ml-4 text-gray-500">↓</div>
              <div>GraphQL Backend</div>
            </div>
          </div>
        </div>

        {/* Rules */}
        <div className="mt-16 rounded-lg border-2 border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-900/20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Foundation Rules</h2>
          <ul className="mt-4 space-y-2 text-gray-700 dark:text-gray-300">
            <li>✗ DO NOT put GraphQL queries directly in components</li>
            <li>✗ DO NOT hardcode roles/permissions in components</li>
            <li>✗ DO NOT mix business logic with UI</li>
            <li>✓ USE custom hooks for data fetching</li>
            <li>✓ USE service layer for API communication</li>
            <li>✓ USE permission system (lib/permissions)</li>
            <li>✓ USE Zustand for UI state only (auth, modals, sidebar)</li>
            <li>✓ USE Apollo for server data</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
