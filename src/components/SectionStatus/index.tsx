'use client'

import { StatusWrap, Spinner, StatusIcon, StatusTitle, StatusSub } from './styles'

export interface LoadingStateProps {
  title?: string
  sub?: string
}

export function LoadingState({
  title = 'Đang tải dữ liệu',
  sub,
}: LoadingStateProps) {
  return (
    <StatusWrap role="status" aria-live="polite" aria-busy="true">
      <Spinner aria-hidden="true" />
      <StatusTitle>{title}</StatusTitle>
      {sub && <StatusSub>{sub}</StatusSub>}
    </StatusWrap>
  )
}

export interface EmptyStateProps {
  title: string
  sub?: string
  icon?: string
}

export function EmptyState({ title, sub, icon }: EmptyStateProps) {
  return (
    <StatusWrap role="status" aria-live="polite">
      {icon && <StatusIcon aria-hidden="true">{icon}</StatusIcon>}
      <StatusTitle>{title}</StatusTitle>
      {sub && <StatusSub>{sub}</StatusSub>}
    </StatusWrap>
  )
}
