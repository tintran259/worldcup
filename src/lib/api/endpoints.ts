export const endpoints = {
  tournament: {
    bracket: '/tournament/bracket',
    standings: '/tournament/standings',
  },
  matches: {
    list: (status?: string) => `/matches${status ? `?status=${status}` : ''}`,
    detail: (id: string) => `/matches/${id}`,
    live: '/matches?status=live',
  },
  teams: {
    detail: (id: string) => `/teams/${id}`,
    stats: (id: string) => `/teams/${id}/stats`,
  },
} as const
