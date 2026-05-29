import type { StarPlayer } from './types'

// ── Helper ────────────────────────────────────────────────────────────────────

let _pid = 1
const p = (
  teamId: string,
  name: string,
  position: StarPlayer['position'],
  shirtNumber: number,
  age: number,
  club: string,
  clubLeague: string,
  isCaptain: boolean,
  goals: number,
  assists: number,
  matches: number,
  rating: number,
  marketValue: string,
  yellowCards = 0,
  redCards = 0,
): StarPlayer => ({
  id: `p${_pid++}`,
  name,
  teamId,
  position,
  shirtNumber,
  age,
  club,
  clubLeague,
  isCaptain,
  goals,
  assists,
  matchesPlayed: matches,
  minutesPlayed: matches * 85,
  tournamentGoals: goals,
  tournamentAssists: assists,
  tournamentYellowCards: yellowCards,
  tournamentRedCards: redCards,
  rating,
  marketValue,
  yellowCards,
  redCards,
})

// ── Brazil ────────────────────────────────────────────────────────────────────

export const BRA_PLAYERS: StarPlayer[] = [
  p('BRA', 'Vinícius Jr.',    'FWD', 7,  23, 'Real Madrid',    'La Liga',    false, 3, 2, 5, 9.1, '€180M'),
  p('BRA', 'Rodrygo',         'FWD', 11, 23, 'Real Madrid',    'La Liga',    false, 2, 1, 5, 8.4, '€120M'),
  p('BRA', 'Marquinhos',      'DEF', 4,  29, 'Paris SG',       'Ligue 1',    true,  0, 0, 5, 8.2, '€50M'),
  p('BRA', 'Bruno Guimarães', 'MID', 5,  26, 'Newcastle Utd',  'Premier League', false, 1, 3, 5, 8.6, '€90M'),
  p('BRA', 'Alisson',         'GK',  1,  31, 'Liverpool',      'Premier League', false, 0, 0, 5, 8.7, '€50M'),
  p('BRA', 'Endrick',         'FWD', 9,  17, 'Real Madrid',    'La Liga',    false, 1, 0, 4, 7.9, '€80M'),
]

// ── France ────────────────────────────────────────────────────────────────────

export const FRA_PLAYERS: StarPlayer[] = [
  p('FRA', 'Kylian Mbappé',   'FWD', 10, 25, 'Real Madrid',    'La Liga',    true,  4, 1, 5, 9.4, '€200M'),
  p('FRA', 'Antoine Griezmann','MID', 7,  32, 'Atlético Madrid','La Liga',   false, 2, 3, 5, 8.8, '€30M'),
  p('FRA', 'Raphaël Varane',  'DEF', 4,  31, 'Como 1907',      'Serie A',    false, 0, 0, 5, 7.6, '€20M'),
  p('FRA', 'Aurélien Tchouaméni','MID',8, 24, 'Real Madrid',    'La Liga',    false, 0, 1, 5, 8.3, '€80M'),
  p('FRA', 'Mike Maignan',    'GK',  16, 28, 'AC Milan',       'Serie A',    false, 0, 0, 5, 8.9, '€50M'),
]

// ── Argentina ─────────────────────────────────────────────────────────────────

export const ARG_PLAYERS: StarPlayer[] = [
  p('ARG', 'Lionel Messi',    'FWD', 10, 37, 'Inter Miami',    'MLS',        true,  5, 4, 5, 9.6, '€40M'),
  p('ARG', 'Julián Álvarez',  'FWD', 9,  24, 'Atlético Madrid','La Liga',    false, 3, 2, 5, 9.0, '€120M'),
  p('ARG', 'Enzo Fernández',  'MID', 24, 23, 'Chelsea',        'Premier League', false, 1, 2, 5, 8.5, '€100M'),
  p('ARG', 'Rodrigo De Paul', 'MID', 7,  30, 'Atlético Madrid','La Liga',    false, 0, 2, 5, 7.9, '€35M'),
  p('ARG', 'Emiliano Martínez','GK', 23, 31, 'Aston Villa',    'Premier League', false, 0, 0, 5, 9.1, '€30M'),
]

// ── England ───────────────────────────────────────────────────────────────────

export const ENG_PLAYERS: StarPlayer[] = [
  p('ENG', 'Harry Kane',      'FWD', 9,  30, 'Bayern Munich',  'Bundesliga', true,  4, 1, 5, 9.0, '€80M'),
  p('ENG', 'Bukayo Saka',     'MID', 7,  22, 'Arsenal',        'Premier League', false, 2, 3, 5, 9.2, '€150M'),
  p('ENG', 'Phil Foden',      'MID', 47, 24, 'Man City',       'Premier League', false, 1, 2, 5, 8.8, '€150M'),
  p('ENG', 'Jude Bellingham', 'MID', 22, 21, 'Real Madrid',    'La Liga',    false, 3, 2, 5, 9.3, '€180M'),
  p('ENG', 'Jordan Pickford', 'GK',  1,  30, 'Everton',        'Premier League', false, 0, 0, 5, 8.0, '€30M'),
]

// ── Spain ─────────────────────────────────────────────────────────────────────

export const ESP_PLAYERS: StarPlayer[] = [
  p('ESP', 'Pedri',           'MID', 16, 22, 'FC Barcelona',   'La Liga',    false, 1, 3, 5, 9.0, '€100M'),
  p('ESP', 'Gavi',            'MID', 6,  20, 'FC Barcelona',   'La Liga',    false, 0, 2, 4, 8.5, '€80M'),
  p('ESP', 'Ferran Torres',   'FWD', 11, 24, 'FC Barcelona',   'La Liga',    false, 2, 1, 5, 7.8, '€55M'),
  p('ESP', 'Lamine Yamal',    'FWD', 22, 17, 'FC Barcelona',   'La Liga',    false, 3, 2, 5, 9.1, '€180M'),
  p('ESP', 'Unai Simón',      'GK',  1,  27, 'Athletic Bilbao','La Liga',    false, 0, 0, 5, 8.0, '€25M'),
]

// ── Germany ───────────────────────────────────────────────────────────────────

export const GER_PLAYERS: StarPlayer[] = [
  p('GER', 'Jamal Musiala',   'MID', 10, 21, 'Bayern Munich',  'Bundesliga', false, 3, 3, 5, 9.3, '€150M'),
  p('GER', 'Kai Havertz',     'FWD', 7,  25, 'Arsenal',        'Premier League', false, 2, 1, 5, 8.2, '€70M'),
  p('GER', 'Florian Wirtz',   'MID', 8,  21, 'Bayer Leverkusen','Bundesliga', false, 2, 2, 5, 9.0, '€130M'),
  p('GER', 'Ilkay Gündoğan', 'MID', 21, 33, 'FC Barcelona',   'La Liga',    true,  1, 2, 5, 8.0, '€20M'),
  p('GER', 'Manuel Neuer',    'GK',  1,  38, 'Bayern Munich',  'Bundesliga', false, 0, 0, 4, 7.8, '€10M'),
]

// ── Portugal ──────────────────────────────────────────────────────────────────

export const POR_PLAYERS: StarPlayer[] = [
  p('POR', 'Cristiano Ronaldo','FWD',7,  39, 'Al Nassr',       'Saudi Pro',  true,  4, 1, 5, 8.6, '€20M'),
  p('POR', 'Bruno Fernandes', 'MID', 8,  29, 'Man United',     'Premier League', false, 2, 4, 5, 9.0, '€70M'),
  p('POR', 'Rafael Leão',     'FWD', 11, 25, 'AC Milan',       'Serie A',    false, 3, 2, 5, 8.9, '€90M'),
  p('POR', 'Bernardo Silva',  'MID', 10, 30, 'Man City',       'Premier League', false, 1, 3, 5, 8.7, '€70M'),
  p('POR', 'Diogo Costa',     'GK',  1,  24, 'FC Porto',       'Primeira Liga', false, 0, 0, 5, 8.5, '€35M'),
]

// ── Netherlands ───────────────────────────────────────────────────────────────

export const NED_PLAYERS: StarPlayer[] = [
  p('NED', 'Virgil van Dijk', 'DEF', 4,  32, 'Liverpool',      'Premier League', true, 0, 1, 5, 8.8, '€30M'),
  p('NED', 'Frenkie de Jong', 'MID', 21, 27, 'FC Barcelona',   'La Liga',    false, 1, 2, 5, 8.4, '€60M'),
  p('NED', 'Cody Gakpo',      'FWD', 11, 25, 'Liverpool',      'Premier League', false, 3, 1, 5, 8.7, '€90M'),
  p('NED', 'Xavi Simons',     'MID', 7,  21, 'RB Leipzig',     'Bundesliga', false, 2, 2, 5, 8.8, '€100M'),
]

// ── USA ───────────────────────────────────────────────────────────────────────

export const USA_PLAYERS: StarPlayer[] = [
  p('USA', 'Christian Pulisic','FWD',10, 25, 'AC Milan',       'Serie A',    false, 2, 2, 5, 8.5, '€45M'),
  p('USA', 'Tyler Adams',      'MID', 4,  25, 'Bournemouth',   'Premier League', true,  0, 1, 5, 7.8, '€20M'),
  p('USA', 'Gio Reyna',        'MID', 7,  21, 'Nottm Forest',  'Premier League', false, 1, 2, 4, 7.9, '€25M'),
  p('USA', 'Ricardo Pepi',     'FWD', 9,  21, 'PSV',           'Eredivisie', false, 2, 0, 5, 7.7, '€20M'),
  p('USA', 'Matt Turner',      'GK',  1,  29, 'Crystal Palace','Premier League', false, 0, 0, 5, 7.5, '€10M'),
]

// ── Morocco ───────────────────────────────────────────────────────────────────

export const MAR_PLAYERS: StarPlayer[] = [
  p('MAR', 'Hakim Ziyech',    'MID', 7,  31, 'Galatasaray',    'Süper Lig',  false, 2, 2, 5, 8.2, '€20M'),
  p('MAR', 'Achraf Hakimi',   'DEF', 2,  25, 'Paris SG',       'Ligue 1',    false, 1, 3, 5, 8.9, '€70M'),
  p('MAR', 'Sofyan Amrabat',  'MID', 4,  27, 'Fiorentina',     'Serie A',    false, 0, 1, 5, 8.4, '€30M'),
  p('MAR', 'Bono',            'GK',  13, 33, 'Sevilla',        'La Liga',    false, 0, 0, 5, 8.7, '€15M', 1),
]

// ── Japan ─────────────────────────────────────────────────────────────────────

export const JPN_PLAYERS: StarPlayer[] = [
  p('JPN', 'Takumi Minamino', 'FWD', 10, 29, 'Monaco',         'Ligue 1',    false, 2, 1, 5, 7.9, '€25M'),
  p('JPN', 'Ritsu Doan',      'MID', 8,  26, 'Freiburg',       'Bundesliga', false, 1, 2, 5, 8.0, '€20M'),
  p('JPN', 'Hiroki Ito',      'DEF', 5,  24, 'Bayern Munich',  'Bundesliga', false, 0, 0, 5, 7.8, '€25M'),
  p('JPN', 'Shuichi Gonda',   'GK',  1,  34, 'Shimizu S-Pulse','J-League',  false, 0, 0, 5, 7.5, '€3M'),
]

// ── Senegal ───────────────────────────────────────────────────────────────────

export const SEN_PLAYERS: StarPlayer[] = [
  p('SEN', 'Sadio Mané',      'FWD', 10, 32, 'Al Nassr',       'Saudi Pro',  false, 3, 1, 5, 8.3, '€20M'),
  p('SEN', 'Kalidou Koulibaly','DEF',3,  32, 'Al Hilal',       'Saudi Pro',  true,  0, 0, 5, 7.9, '€15M'),
  p('SEN', 'Idrissa Gueye',   'MID', 5,  34, 'Al Qadsiah',     'Saudi Pro',  false, 0, 1, 5, 7.5, '€5M'),
  p('SEN', 'Édouard Mendy',   'GK',  16, 32, 'Al-Ahli',        'Saudi Pro',  false, 0, 0, 5, 7.8, '€10M'),
]

// ── Uruguay ───────────────────────────────────────────────────────────────────

export const URU_PLAYERS: StarPlayer[] = [
  p('URU', 'Darwin Núñez',    'FWD', 11, 24, 'Liverpool',      'Premier League', false, 3, 1, 5, 8.5, '€80M'),
  p('URU', 'Federico Valverde','MID', 14, 25, 'Real Madrid',   'La Liga',    false, 2, 3, 5, 9.0, '€120M'),
  p('URU', 'Rodrigo Bentancur','MID', 38, 26, 'Tottenham',     'Premier League', false, 0, 1, 5, 7.8, '€30M', 1),
]

// ── Consolidated export ───────────────────────────────────────────────────────

export const ALL_PLAYERS: StarPlayer[] = [
  ...BRA_PLAYERS,
  ...FRA_PLAYERS,
  ...ARG_PLAYERS,
  ...ENG_PLAYERS,
  ...ESP_PLAYERS,
  ...GER_PLAYERS,
  ...POR_PLAYERS,
  ...NED_PLAYERS,
  ...USA_PLAYERS,
  ...MAR_PLAYERS,
  ...JPN_PLAYERS,
  ...SEN_PLAYERS,
  ...URU_PLAYERS,
]

/** O(1) lookup by player id */
export const PLAYER_MAP: ReadonlyMap<string, StarPlayer> = new Map(
  ALL_PLAYERS.map((p) => [p.id, p])
)

/** Get all players for a team */
export const getTeamPlayers = (teamId: string): StarPlayer[] =>
  ALL_PLAYERS.filter((p) => p.teamId === teamId)

/** Top scorers sorted by goals */
export const TOP_SCORERS: StarPlayer[] = [...ALL_PLAYERS]
  .filter((p) => p.tournamentGoals > 0)
  .sort((a, b) => b.tournamentGoals - a.tournamentGoals || b.tournamentAssists - a.tournamentAssists)
