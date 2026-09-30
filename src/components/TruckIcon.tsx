type Props = { className?: string }

// caminhão em vista lateral, cabine à direita (sentido da rota)
export function TruckIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 64 32"
      fill="none"
      stroke="var(--color-upper-2)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="5" width="36" height="19" rx="1.5" fill="var(--color-panel)" />
      <path d="M38 10h11l7 7v7H38z" fill="var(--color-panel)" />
      <path d="M42 13h6l4 4h-10z" />
      <path d="M2 24h58" />
      <circle cx="13" cy="26" r="3.5" fill="var(--color-ink)" />
      <circle cx="47" cy="26" r="3.5" fill="var(--color-ink)" />
    </svg>
  )
}
