import type { ReactNode } from 'react'

import { ACTION_BASE, ACTION_VARIANT, type ActionVariant } from '@/components/actionStyles'
import { cn } from '@/lib/cn'

interface ActionLinkProps {
  to: string
  variant?: ActionVariant
  className?: string
  children: ReactNode
}

/**
 * Navigating action. Shares its treatment with `ActionButton`.
 *
 * A plain anchor rather than a router link: this portfolio serves each page as
 * its own document, so every destination is a real navigation.
 */
export function ActionLink({ to, variant = 'primary', className, children }: ActionLinkProps) {
  return (
    <a href={to} className={cn(ACTION_BASE, ACTION_VARIANT[variant], className)}>
      {children}
    </a>
  )
}
