'use client'

import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'

/**
 * AppDropdown
 * A standardized wrapper for the DropdownMenu system to maintain architectural layering.
 */
export const AppDropdown = DropdownMenu
export const AppDropdownTrigger = DropdownMenuTrigger
export const AppDropdownContent = DropdownMenuContent
export const AppDropdownItem = DropdownMenuItem
export const AppDropdownLabel = DropdownMenuLabel
export const AppDropdownSeparator = DropdownMenuSeparator
export const AppDropdownGroup = DropdownMenuGroup
export const AppDropdownSub = DropdownMenuSub
export const AppDropdownSubContent = DropdownMenuSubContent
export const AppDropdownSubTrigger = DropdownMenuSubTrigger
export const AppDropdownPortal = DropdownMenuPortal
