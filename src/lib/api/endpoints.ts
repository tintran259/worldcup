export const endpoints = {
  tournament: {
    bracket: '/tournament/bracket',
    standings: '/standings',
  },
  matches: {
    list: (status?: string) => `/matches${status ? `?status=${status}` : ''}`,
    byTeam: (teamId: string) => `/matches?teamId=${teamId}`,
    detail: (id: string) => `/matches/${encodeURIComponent(id)}`,
    live: '/matches?status=live',
  },
  teams: {
    detail: (id: string) => `/teams/${encodeURIComponent(id)}`,
    withSquad: (id: string) => `/teams/${encodeURIComponent(id)}?squad=1`,
    stats: (id: string) => `/teams/${encodeURIComponent(id)}/stats`,
  },
  standings: {
    all: '/standings',
    group: (id: string) => `/standings?group=${id}`,
  },
} as const
