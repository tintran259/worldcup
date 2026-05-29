export const queryKeys = {
  tournament: {
    all: ['tournament'] as const,
    bracket: () => [...queryKeys.tournament.all, 'bracket'] as const,
    standings: () => [...queryKeys.tournament.all, 'standings'] as const,
  },
  matches: {
    all: ['matches'] as const,
    list: (status?: string) => [...queryKeys.matches.all, { status }] as const,
    detail: (id: string) => [...queryKeys.matches.all, id] as const,
    live: () => [...queryKeys.matches.all, 'live'] as const,
  },
  teams: {
    all: ['teams'] as const,
    detail: (id: string) => [...queryKeys.teams.all, id] as const,
    stats: (id: string) => [...queryKeys.teams.all, id, 'stats'] as const,
  },
} as const
