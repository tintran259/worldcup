/**
 * Squad generator — sinh 15-man squad deterministic cho team không có squad viết tay.
 *
 * Mục tiêu: modal team detail luôn có data đầy đủ (1 GK + 4 DEF + 5 MID + 5 FWD)
 * dù team đó không có entry trong `players.ts`.
 *
 * Cách hoạt động:
 *   - Mỗi team có 1 captain thật từ ALL_TEAMS (dùng làm 1 trong 15 player).
 *   - 14 player còn lại sinh từ pool tên theo confederation (UEFA, CONMEBOL...).
 *   - Lựa chọn deterministic theo hash team ID → cùng team luôn ra cùng squad.
 *   - Stats (goals, assists, rating...) cũng deterministic, scale theo FIFA rank.
 */

import type { ExtendedTeam, StarPlayer, Confederation } from './types'

// ── Name pools theo confederation ─────────────────────────────────────────────

interface NamePool {
  first: string[]
  last:  string[]
}

const NAME_POOLS: Record<Confederation, NamePool> = {
  UEFA: {
    first: ['Lukas', 'Niklas', 'Mateusz', 'Marko', 'Stefan', 'Andriy', 'Marco', 'Sven', 'Ivan', 'David', 'Tomáš', 'Filip', 'Robert', 'Daniel', 'Andreas'],
    last:  ['Müller', 'Kovač', 'Novak', 'Petrović', 'Schmidt', 'Andersen', 'Janssen', 'Horváth', 'Popov', 'Krause', 'Nagy', 'Wójcik', 'Larsson', 'Olsen', 'Marković'],
  },
  CONMEBOL: {
    first: ['Carlos', 'Diego', 'Pablo', 'Sergio', 'Andrés', 'Ricardo', 'Felipe', 'Joaquín', 'Matías', 'Esteban', 'Gonzalo', 'Lucas', 'Fernando', 'Hernán', 'Bruno'],
    last:  ['González', 'Rodríguez', 'Silva', 'Pereira', 'Vargas', 'Mendoza', 'Castro', 'Ramírez', 'Torres', 'Romero', 'Suárez', 'Herrera', 'Acosta', 'Cabrera', 'Quintero'],
  },
  CONCACAF: {
    first: ['Carlos', 'Luis', 'Jonathan', 'Ricardo', 'Edgar', 'Javier', 'Roberto', 'Anthony', 'Marco', 'Gabriel', 'Andrés', 'Sergio', 'David', 'Diego', 'Erick'],
    last:  ['Hernández', 'Martínez', 'López', 'Sánchez', 'Vela', 'Gómez', 'Bryan', 'Cordova', 'Cooper', 'Ruiz', 'Wright-Phillips', 'Cervantes', 'Murillo', 'Carrasco', 'Wynder'],
  },
  CAF: {
    first: ['Mohamed', 'Ahmed', 'Youssef', 'Karim', 'Yassine', 'Ismail', 'Omar', 'Hassan', 'Ibrahim', 'Achraf', 'Samuel', 'Kwame', 'Sadio', 'Riyad', 'Mostafa'],
    last:  ['Diallo', 'Touré', 'Ndiaye', 'El-Sayed', 'Boateng', 'Mensah', 'Kamara', 'Ouattara', 'Mahrez', 'Salah', 'Mané', 'Ziyech', 'Aboubakar', 'Onyeka', 'Asamoah'],
  },
  AFC: {
    first: ['Takumi', 'Hiroki', 'Min-jae', 'Heung-min', 'Ali', 'Akram', 'Yusuke', 'Ryotaro', 'Salem', 'Salman', 'Sardar', 'Mehdi', 'Ali Reza', 'Wu', 'Chanathip'],
    last:  ['Tanaka', 'Yamamoto', 'Kim', 'Park', 'Al-Dawsari', 'Al-Owais', 'Al-Sahafi', 'Azmoun', 'Taremi', 'Jahanbakhsh', 'Lei', 'Songkrasin', 'Murakami', 'Ito', 'Kang'],
  },
  OFC: {
    first: ['Roy', 'Chris', 'Liam', 'Sam', 'Andrew', 'Marco', 'Joe', 'Ethan', 'Daniel', 'Ben', 'Tom', 'Jake', 'Will', 'Oliver', 'Lewis'],
    last:  ['Krishna', 'Wood', 'Garbutt', 'Brotherton', 'Najok', 'Dunn', 'Bell', 'Stamenić', 'Singh', 'Mata', 'Just', 'Boxall', 'McGree', 'Goodwin', 'Rufer'],
  },
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = (h * 16777619) >>> 0
  }
  return h
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

// Squad đầy đủ chuẩn WC: 3 GK + 7 DEF + 7 MID + 6 FWD = 23 players.
const SQUAD_BLUEPRINT: Array<{ position: StarPlayer['position']; shirtNumber: number }> = [
  // GK
  { position: 'GK',  shirtNumber: 1 },
  { position: 'GK',  shirtNumber: 12 },
  { position: 'GK',  shirtNumber: 23 },
  // DEF
  { position: 'DEF', shirtNumber: 2 },
  { position: 'DEF', shirtNumber: 3 },
  { position: 'DEF', shirtNumber: 4 },
  { position: 'DEF', shirtNumber: 5 },
  { position: 'DEF', shirtNumber: 13 },
  { position: 'DEF', shirtNumber: 15 },
  { position: 'DEF', shirtNumber: 16 },
  // MID
  { position: 'MID', shirtNumber: 6 },
  { position: 'MID', shirtNumber: 8 },
  { position: 'MID', shirtNumber: 10 },
  { position: 'MID', shirtNumber: 14 },
  { position: 'MID', shirtNumber: 17 },
  { position: 'MID', shirtNumber: 18 },
  { position: 'MID', shirtNumber: 20 },
  // FWD
  { position: 'FWD', shirtNumber: 7 },
  { position: 'FWD', shirtNumber: 9 },
  { position: 'FWD', shirtNumber: 11 },
  { position: 'FWD', shirtNumber: 19 },
  { position: 'FWD', shirtNumber: 21 },
  { position: 'FWD', shirtNumber: 22 },
]

// Club + league pools — chia theo confederation
const CLUB_POOLS: Record<Confederation, Array<{ club: string; league: string }>> = {
  UEFA: [
    { club: 'FC Barcelona', league: 'La Liga' },
    { club: 'Real Madrid', league: 'La Liga' },
    { club: 'Bayern Munich', league: 'Bundesliga' },
    { club: 'Inter', league: 'Serie A' },
    { club: 'Ajax', league: 'Eredivisie' },
    { club: 'PSV', league: 'Eredivisie' },
    { club: 'Benfica', league: 'Primeira Liga' },
    { club: 'Galatasaray', league: 'Süper Lig' },
    { club: 'Dynamo Kyiv', league: 'Ukrainian PL' },
  ],
  CONMEBOL: [
    { club: 'Flamengo', league: 'Brasileirão' },
    { club: 'Boca Juniors', league: 'Liga Profesional' },
    { club: 'River Plate', league: 'Liga Profesional' },
    { club: 'Palmeiras', league: 'Brasileirão' },
    { club: 'Peñarol', league: 'Primera División' },
    { club: 'Colo-Colo', league: 'Primera División' },
  ],
  CONCACAF: [
    { club: 'Club América', league: 'Liga MX' },
    { club: 'LAFC', league: 'MLS' },
    { club: 'CF Monterrey', league: 'Liga MX' },
    { club: 'Tigres UANL', league: 'Liga MX' },
    { club: 'Toronto FC', league: 'MLS' },
  ],
  CAF: [
    { club: 'Al Ahly', league: 'Egyptian PL' },
    { club: 'Wydad AC', league: 'Botola Pro' },
    { club: 'Mamelodi Sundowns', league: 'PSL' },
    { club: 'Espérance ST', league: 'Ligue 1 Tunisia' },
    { club: 'TP Mazembe', league: 'LINAFOOT' },
  ],
  AFC: [
    { club: 'Al Hilal', league: 'Saudi Pro' },
    { club: 'Urawa Reds', league: 'J-League' },
    { club: 'Ulsan HD', league: 'K League 1' },
    { club: 'Persepolis', league: 'Persian Gulf PL' },
    { club: 'Al Sadd', league: 'QSL' },
  ],
  OFC: [
    { club: 'Auckland City', league: 'NZ Premiership' },
    { club: 'AS Pirae', league: 'Tahiti Ligue 1' },
  ],
}

// ── Main generator ────────────────────────────────────────────────────────────

/**
 * Sinh 15-man squad cho 1 team. Deterministic theo team.id.
 */
export function generateSquad(team: ExtendedTeam): StarPlayer[] {
  const pool   = NAME_POOLS[team.confederation]
  const clubs  = CLUB_POOLS[team.confederation]
  const seed   = hash(team.id)

  // Captain assigned to slot with shirtNumber 10 (typical playmaker number).
  const captainIdx = SQUAD_BLUEPRINT.findIndex(s => s.shirtNumber === 10)

  return SQUAD_BLUEPRINT.map((slot, idx) => {
    const slotSeed = seed + idx * 31

    const isCaptain = idx === captainIdx
    const name = isCaptain
      ? team.captain
      : `${pick(pool.first, slotSeed)} ${pick(pool.last, slotSeed + 7)}`

    const club  = pick(clubs, slotSeed + 13)
    const age   = 21 + (slotSeed % 14)              // 21..34
    const goals = slot.position === 'FWD'
      ? (slotSeed % 5)                              // 0..4
      : slot.position === 'MID'
        ? (slotSeed % 3)                            // 0..2
        : 0
    const assists = slot.position === 'GK' ? 0 : (slotSeed % 4)
    const matches = 3 + (slotSeed % 3)              // 3..5
    const yellows = slotSeed % 3                    // 0..2

    // Rating scale theo FIFA rank — đội mạnh có player rating cao hơn
    const baseRating = 8.5 - Math.min(team.fifaRank / 15, 2)  // top10≈8.5, rank40≈5.8
    const rating = Math.round((baseRating + (slotSeed % 100) / 200) * 10) / 10

    // Market value cũng scale theo rank + position
    const positionMultiplier = slot.position === 'FWD' ? 3 : slot.position === 'MID' ? 2 : 1
    const baseValue = Math.max(5, 80 - team.fifaRank) * positionMultiplier
    const valueM = baseValue + (slotSeed % 20)

    const playerId = `${team.id}-gen-${idx + 1}`
    return {
      id:               playerId,
      name,
      teamId:           team.id,
      position:         slot.position,
      shirtNumber:      slot.shirtNumber,
      age,
      club:             club.club,
      clubLeague:       club.league,
      isCaptain,
      goals,
      assists,
      matchesPlayed:    matches,
      minutesPlayed:    matches * 85,
      tournamentGoals:  goals,
      tournamentAssists: assists,
      tournamentYellowCards: yellows,
      tournamentRedCards:    0,
      yellowCards:      yellows,
      redCards:         0,
      rating,
      marketValue:      `€${valueM}M`,
      // DiceBear avatar — deterministic theo player ID, không cần fetch
      photoUrl:         `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(playerId)}&backgroundColor=b6e3f4,c0aede,d1d4f9&backgroundType=gradientLinear`,
    }
  })
}
