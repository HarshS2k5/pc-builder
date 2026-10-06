// ─────────────────────────────────────────────────────────────────────────────
// GameRank – Scalable Game Data Model (Normalized and Extensible)
// ─────────────────────────────────────────────────────────────────────────────

export interface SystemRequirementSpec {
  os?: string
  cpu?: string
  gpu?: string
  ram?: string
  storage?: string
}

export interface SystemRequirements {
  minimum?: SystemRequirementSpec
  recommended?: SystemRequirementSpec
}

export type ReleaseStatus = 'Released' | 'Coming Soon' | 'Announced' | 'TBA' | 'Delayed'

export interface GameRecord {
  id: string | number
  name: string
  slug: string
  coverImage: string        // Vertical box-art / official poster (3:4 ratio)
  backgroundImage: string   // Landscape banner / wallpaper (16:9 ratio)
  thumbnailImage?: string   // Compact thumbnail preview (header/square)
  description: string
  releaseDate: string
  releaseStatus?: ReleaseStatus
  previousReleaseDate?: string
  dateChangeNote?: string
  developer: string
  publisher: string
  platforms: string[]       // 'PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X|S', 'Xbox One', 'Nintendo Switch', 'Android', 'iOS'
  genres: string[]          // 'Action', 'RPG', 'Shooter', 'Open World', etc.
  tags: string[]
  criticScore: number       // 0-100 (Metacritic or verified reviews)
  playerScore: number       // 0-10 (Community ratings)
  gameRankScore: number     // 0-100 (Calculated by GameRank Algorithm)
  popularity: number        // Engagement metric
  trendingScore: number     // 0-100
  singlePlayer: boolean
  multiplayer: boolean
  coOp: boolean
  crossPlay: boolean
  freeToPlay: boolean
  openWorld?: boolean
  controllerSupport?: boolean
  playtimeHours?: number
  ageRating?: string        // 'ESRB: Mature 17+', 'ESRB: Everyone 10+', 'ESRB: Teen', etc.
  officialWebsite?: string
  trailer?: string          // Official YouTube or video embed URL
  screenshots: string[]
  systemRequirements?: SystemRequirements
}

export type PlatformFilter = 
  | 'all'
  | 'pc' 
  | 'playstation' 
  | 'xbox' 
  | 'nintendo' 
  | 'mobile' 
  | 'android'
  | 'ios'
  | 'cross-platform'

export type GenreFilter =
  | 'all'
  | 'action'
  | 'adventure'
  | 'rpg'
  | 'action-rpg'
  | 'fps'
  | 'tps'
  | 'battle-royale'
  | 'fighting'
  | 'racing'
  | 'sports'
  | 'strategy'
  | 'simulation'
  | 'survival'
  | 'horror'
  | 'open-world'
  | 'sandbox'
  | 'platformer'
  | 'puzzle'
  | 'roguelike'
  | 'mmorpg'
  | 'moba'
  | 'indie'
  | 'party'
  | 'co-op'
