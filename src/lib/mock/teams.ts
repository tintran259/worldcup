import type { ExtendedTeam } from './types'

// ── Helper ────────────────────────────────────────────────────────────────────

const t = (
  id: string,
  name: string,
  shortName: string,
  code: string,
  confederation: ExtendedTeam['confederation'],
  fifaRank: number,
  group: string,
  manager: string,
  captain: string,
  homeColor: string,
  awayColor: string,
  pot: ExtendedTeam['pot'],
): ExtendedTeam => ({
  id,
  name,
  shortName,
  code,
  flagUrl: `https://flagcdn.com/w40/${code.toLowerCase()}.png`,
  confederation,
  fifaRank,
  group,
  manager,
  captain,
  homeColor,
  awayColor,
  pot,
  qualified: true,
  ranking: fifaRank,
})

// ── 48 qualified nations — FIFA World Cup 2026 ────────────────────────────────

export const ALL_TEAMS: ExtendedTeam[] = [
  // ── Group A ────────────────────────────────────────────────────────────────
  t('USA',  'United States', 'USA',  'us', 'CONCACAF', 11, 'A', 'Gregg Berhalter',   'Tyler Adams',        '#002868', '#BF0A30', 1),
  t('ENG',  'England',       'ENG',  'gb', 'UEFA',      4,  'A', 'Gareth Southgate',  'Harry Kane',         '#FFFFFF', '#003090', 1),
  t('IRN',  'Iran',          'IRN',  'ir', 'AFC',       24, 'A', 'Amir Ghalenoei',    'Alireza Jahanbakhsh','#239F40', '#FFFFFF', 3),
  t('TUN',  'Tunisia',       'TUN',  'tn', 'CAF',       32, 'A', 'Jalel Kadri',       'Youssef Msakni',     '#E70013', '#FFFFFF', 4),

  // ── Group B ────────────────────────────────────────────────────────────────
  t('ARG',  'Argentina',     'ARG',  'ar', 'CONMEBOL',  3, 'B', 'Lionel Scaloni',    'Lionel Messi',       '#74ACDF', '#FFFFFF', 1),
  t('MEX',  'Mexico',        'MEX',  'mx', 'CONCACAF', 14, 'B', 'Jaime Lozano',      'Guillermo Ochoa',    '#006847', '#FFFFFF', 2),
  t('ECU',  'Ecuador',       'ECU',  'ec', 'CONMEBOL', 28, 'B', 'Félix Sánchez',     'Enner Valencia',     '#FFD100', '#003087', 3),
  t('POL',  'Poland',        'POL',  'pl', 'UEFA',      26, 'B', 'Michał Probierz',   'Robert Lewandowski', '#DC143C', '#FFFFFF', 4),

  // ── Group C ────────────────────────────────────────────────────────────────
  t('BRA',  'Brazil',        'BRA',  'br', 'CONMEBOL',  1, 'C', 'Dorival Júnior',    'Marquinhos',         '#009C3B', '#002776', 1),
  t('FRA',  'France',        'FRA',  'fr', 'UEFA',      2, 'C', 'Didier Deschamps',  'Kylian Mbappé',      '#002395', '#FFFFFF', 1),
  t('SEN',  'Senegal',       'SEN',  'sn', 'CAF',       20, 'C', 'Aliou Cissé',       'Kalidou Koulibaly',  '#00853F', '#FFFFFF', 3),
  t('CMR',  'Cameroon',      'CMR',  'cm', 'CAF',       33, 'C', 'Marc Brys',         'Eric Maxim C.U.',    '#007A5E', '#CE1126', 4),

  // ── Group D ────────────────────────────────────────────────────────────────
  t('ESP',  'Spain',         'ESP',  'es', 'UEFA',      5, 'D', 'Luis de la Fuente', 'Álvaro Morata',      '#AA151B', '#F1BF00', 1),
  t('GER',  'Germany',       'GER',  'de', 'UEFA',      6, 'D', 'Julian Nagelsmann', 'Ilkay Gündoğan',     '#000000', '#DD0000', 2),
  t('JPN',  'Japan',         'JPN',  'jp', 'AFC',       18, 'D', 'Hajime Moriyasu',   'Maya Yoshida',       '#003087', '#FFFFFF', 3),
  t('AUS',  'Australia',     'AUS',  'au', 'AFC',       25, 'D', 'Graham Arnold',     'Mat Ryan',           '#FFCD00', '#00843D', 4),

  // ── Group E ────────────────────────────────────────────────────────────────
  t('POR',  'Portugal',      'POR',  'pt', 'UEFA',      7, 'E', 'Roberto Martínez',  'Cristiano Ronaldo',  '#006600', '#FF0000', 1),
  t('NED',  'Netherlands',   'NED',  'nl', 'UEFA',      8, 'E', 'Ronald Koeman',     'Virgil van Dijk',    '#FF6600', '#FFFFFF', 2),
  t('CMR',  'Cameroon',      'CMR',  'cm', 'CAF',       33, 'E', 'Marc Brys',         'Eric Maxim C.U.',    '#007A5E', '#CE1126', 4),
  t('GHA',  'Ghana',         'GHA',  'gh', 'CAF',       30, 'E', 'Chris Hughton',     'Thomas Partey',      '#006B3F', '#FCD116', 3),

  // ── Group F ────────────────────────────────────────────────────────────────
  t('BEL',  'Belgium',       'BEL',  'be', 'UEFA',      9, 'F', 'Domenico Tedesco',  'Kevin De Bruyne',    '#000000', '#FDDA24', 2),
  t('CRO',  'Croatia',       'CRO',  'hr', 'UEFA',      10,'F', 'Zlatko Dalić',      'Luka Modrić',        '#FF0000', '#FFFFFF', 2),
  t('URU',  'Uruguay',       'URU',  'uy', 'CONMEBOL', 12, 'F', 'Marcelo Bielsa',    'Luis Suárez',        '#5AAFD3', '#FFFFFF', 2),
  t('COL',  'Colombia',      'COL',  'co', 'CONMEBOL', 16, 'F', 'Néstor Lorenzo',    'James Rodríguez',    '#FCD116', '#003087', 3),

  // ── Group G ────────────────────────────────────────────────────────────────
  t('KOR',  'South Korea',   'KOR',  'kr', 'AFC',       22, 'G', 'Jürgen Klinsmann',  'Heung-min Son',      '#C9151E', '#FFFFFF', 3),
  t('DEN',  'Denmark',       'DEN',  'dk', 'UEFA',      17, 'G', 'Kasper Hjulmand',   'Simon Kjær',         '#C60C30', '#FFFFFF', 3),
  t('MAR',  'Morocco',       'MAR',  'ma', 'CAF',       13, 'G', 'Walid Regragui',    'Romain Saïss',       '#C1272D', '#006233', 2),
  t('CAN',  'Canada',        'CAN',  'ca', 'CONCACAF', 34, 'G', 'Jesse Marsch',       'Atiba Hutchinson',   '#FF0000', '#FFFFFF', 4),

  // ── Group H ────────────────────────────────────────────────────────────────
  t('SUI',  'Switzerland',   'SUI',  'ch', 'UEFA',      19, 'H', 'Murat Yakin',       'Granit Xhaka',       '#FF0000', '#FFFFFF', 3),
  t('SRB',  'Serbia',        'SRB',  'rs', 'UEFA',      23, 'H', 'Dragan Stojković',  'Aleksandar Mitrović','#C6363C', '#FFFFFF', 3),
  t('NGA',  'Nigeria',       'NGA',  'ng', 'CAF',       29, 'H', 'José Peseiro',      'William Troost-Ekong','#008751','#FFFFFF', 3),
  t('WAL',  'Wales',         'WAL',  'gb', 'UEFA',      27, 'H', 'Robert Page',       'Gareth Bale',        '#D01012', '#FFFFFF', 4),

  // ── Group I ────────────────────────────────────────────────────────────────
  t('CHI',  'Chile',         'CHI',  'cl', 'CONMEBOL', 31, 'I', 'Eduardo Berizzo',   'Arturo Vidal',       '#D52B1E', '#FFFFFF', 4),
  t('TUR',  'Turkey',        'TUR',  'tr', 'UEFA',      35, 'I', 'Stefan Kuntz',      'Hakan Çalhanoğlu',   '#E30A17', '#FFFFFF', 3),
  t('EGY',  'Egypt',         'EGY',  'eg', 'CAF',       36, 'I', 'Rui Vitória',       'Mohamed Salah',      '#CC1600', '#FFFFFF', 4),
  t('AUT',  'Austria',       'AUT',  'at', 'UEFA',      34, 'I', 'Ralf Rangnick',     'David Alaba',        '#ED2939', '#FFFFFF', 3),

  // ── Group J ────────────────────────────────────────────────────────────────
  t('QAT',  'Qatar',         'QAT',  'qa', 'AFC',       37, 'J', 'Carlos Queiroz',    'Hassan Al-Haydos',   '#8D1B3D', '#FFFFFF', 4),
  t('UKR',  'Ukraine',       'UKR',  'ua', 'UEFA',      24, 'J', 'Serhiy Rebrov',     'Andriy Yarmolenko',  '#005BBB', '#FFD700', 3),
  t('PAR',  'Paraguay',      'PAR',  'py', 'CONMEBOL', 38, 'J', 'Guillermo Barros',  'Miguel Almirón',     '#D52B1E', '#FFFFFF', 4),
  t('CRC',  'Costa Rica',    'CRC',  'cr', 'CONCACAF', 39, 'J', 'Luis Fernando Suárez','Keylor Navas',     '#002B7F', '#FFFFFF', 4),

  // ── Group K ────────────────────────────────────────────────────────────────
  t('CIV',  'Ivory Coast',   'CIV',  'ci', 'CAF',       41, 'K', 'Jean-Louis Gasset', 'Sébastien Haller',  '#F77F00', '#009A44', 3),
  t('BOL',  'Bolivia',       'BOL',  'bo', 'CONMEBOL', 40, 'K', 'Gustavo Costas',    'Marcelo Moreno',     '#D52B1E', '#F4E400', 4),
  t('KSA',  'Saudi Arabia',  'KSA',  'sa', 'AFC',       56, 'K', 'Roberto Mancini',   'Salem Al-Dawsari',   '#006C35', '#FFFFFF', 4),
  t('ROM',  'Romania',       'ROM',  'ro', 'UEFA',      43, 'K', 'Edward Iordănescu',  'Florin Andone',     '#002B7F', '#CE1126', 4),

  // ── Group L ────────────────────────────────────────────────────────────────
  t('PER',  'Peru',          'PER',  'pe', 'CONMEBOL', 44, 'L', 'Jorge Fossati',     'Christian Cueva',    '#D91023', '#FFFFFF', 4),
  t('ALG',  'Algeria',       'ALG',  'dz', 'CAF',       42, 'L', 'Djamel Belmadi',   'Riyad Mahrez',       '#006233', '#FFFFFF', 3),
  t('PAN',  'Panama',        'PAN',  'pa', 'CONCACAF', 45, 'L', 'Thomas Christiansen','Roman Torres',      '#005293', '#FFFFFF', 4),
  t('IDN',  'Indonesia',     'IDN',  'id', 'AFC',       46, 'L', 'Shin Tae-yong',    'Evan Dimas',         '#CE1126', '#FFFFFF', 4),
]

/** Lookup a team by ID */
export const getTeam = (id: string): ExtendedTeam | undefined =>
  ALL_TEAMS.find((t) => t.id === id)

/** Teams that qualified for the knockout bracket (R32) */
export const QUALIFIED_TEAMS: ExtendedTeam[] = ALL_TEAMS.filter((t) =>
  [
    'BRA','FRA','ARG','ENG','ESP','GER','POR','USA',
    'MEX','NED','BEL','URU','CRO','SEN','MAR','JPN',
    'KOR','AUS','ECU','SUI','POL','DEN','CMR','GHA',
    'SRB','IRN','WAL','COL','TUN','NGA','CHI','CAN',
  ].includes(t.id)
)

/** Map for O(1) lookup */
export const TEAM_MAP: ReadonlyMap<string, ExtendedTeam> = new Map(
  ALL_TEAMS.map((t) => [t.id, t])
)
