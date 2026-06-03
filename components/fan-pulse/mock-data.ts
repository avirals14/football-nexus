/* ================================================================== */
/*  Types — mirroring the FastAPI response schemas from backend/app   */
/* ================================================================== */

export interface MatchInfo {
  id: string;
  home_team: string;
  away_team: string;
  home_flag: string;
  away_flag: string;
  competition: string;
  match_date: string;
  status: "upcoming" | "live" | "finished";
  total_content_items?: number;
}

export interface MatchListResponse {
  matches: MatchInfo[];
}

export interface OverallSentiment {
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
  total_items: number;
  mood_label: string;
}

export interface MatchDetailResponse {
  match: MatchInfo;
  overall_sentiment: OverallSentiment;
}

export interface TimelinePoint {
  window_start: string;
  window_end: string;
  positive_pct: number;
  negative_pct: number;
  neutral_pct: number;
  total_items: number;
}

export interface TeamSentiment {
  positive_pct: number;
  negative_pct: number;
  neutral_pct: number;
  total_items: number;
}

export interface TopPlayer {
  name: string;
  mentions: number;
  avg_sentiment_score: number;
}

export interface SentimentResponse {
  timeline: TimelinePoint[];
  teams: Record<string, TeamSentiment>;
  top_players: TopPlayer[];
  top_keywords: string[];
}

export interface ContentItemData {
  id: string;
  source: string;
  text: string;
  url: string;
  sentiment: "positive" | "negative" | "neutral";
  sentiment_score: number;
  entities: { name: string; type: string }[];
  keywords: string[];
  published_at: string;
}

export interface ContentResponse {
  items: ContentItemData[];
  total: number;
  has_more: boolean;
}

export interface SummaryResponse {
  summary: {
    text: string;
    generated_at: string;
    covers_from: string;
    covers_to: string;
  };
}

/* ================================================================== */
/*  Mock data — high-fidelity simulation for offline previewing       */
/* ================================================================== */

const now = new Date();
const fiveMinAgo = (n: number) =>
  new Date(now.getTime() - n * 5 * 60_000).toISOString();
const minsAgo = (n: number) =>
  new Date(now.getTime() - n * 60_000).toISOString();

/* ---- Matches ---------------------------------------------------- */

export const MOCK_MATCHES: MatchListResponse = {
  matches: [
    {
      id: "mock-arg-bra",
      home_team: "Argentina",
      away_team: "Brazil",
      home_flag: "🇦🇷",
      away_flag: "🇧🇷",
      competition: "World Cup 2026 Qualifier",
      match_date: "2026-06-15T20:00:00Z",
      status: "live",
      total_content_items: 347,
    },
    {
      id: "mock-esp-fra",
      home_team: "Spain",
      away_team: "France",
      home_flag: "🇪🇸",
      away_flag: "🇫🇷",
      competition: "World Cup 2026 Qualifier",
      match_date: "2026-06-16T19:00:00Z",
      status: "upcoming",
      total_content_items: 89,
    },
    {
      id: "mock-mci-rma",
      home_team: "Manchester City",
      away_team: "Real Madrid",
      home_flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      away_flag: "🇪🇸",
      competition: "Champions League",
      match_date: "2026-06-20T20:00:00Z",
      status: "upcoming",
      total_content_items: 124,
    },
  ],
};

/* ---- Match details ---------------------------------------------- */

export const MOCK_MATCH_DETAILS: Record<string, MatchDetailResponse> = {
  "mock-arg-bra": {
    match: MOCK_MATCHES.matches[0],
    overall_sentiment: {
      positive_pct: 68.2,
      neutral_pct: 14.5,
      negative_pct: 17.3,
      total_items: 347,
      mood_label: "Positive",
    },
  },
  "mock-esp-fra": {
    match: MOCK_MATCHES.matches[1],
    overall_sentiment: {
      positive_pct: 55.8,
      neutral_pct: 28.4,
      negative_pct: 15.8,
      total_items: 89,
      mood_label: "Positive",
    },
  },
  "mock-mci-rma": {
    match: MOCK_MATCHES.matches[2],
    overall_sentiment: {
      positive_pct: 48.2,
      neutral_pct: 32.1,
      negative_pct: 19.7,
      total_items: 124,
      mood_label: "Mixed",
    },
  },
};

/* ---- Sentiment timelines ---------------------------------------- */

const ARG_BRA_TIMELINE: TimelinePoint[] = [
  { pos: 62, neg: 20, neu: 18, items: 23 },
  { pos: 68, neg: 15, neu: 17, items: 28 },
  { pos: 72, neg: 12, neu: 16, items: 31 },
  { pos: 78, neg: 10, neu: 12, items: 26 },
  { pos: 85, neg: 8, neu: 7, items: 42 },
  { pos: 75, neg: 14, neu: 11, items: 35 },
  { pos: 60, neg: 25, neu: 15, items: 38 },
  { pos: 55, neg: 28, neu: 17, items: 33 },
  { pos: 52, neg: 30, neu: 18, items: 29 },
  { pos: 58, neg: 24, neu: 18, items: 25 },
  { pos: 65, neg: 18, neu: 17, items: 30 },
  { pos: 78, neg: 10, neu: 12, items: 37 },
].map((p, i) => ({
  window_start: fiveMinAgo(12 - i),
  window_end: fiveMinAgo(11 - i),
  positive_pct: p.pos,
  negative_pct: p.neg,
  neutral_pct: p.neu,
  total_items: p.items,
}));

const ESP_FRA_TIMELINE: TimelinePoint[] = [
  { pos: 50, neg: 18, neu: 32, items: 12 },
  { pos: 52, neg: 16, neu: 32, items: 15 },
  { pos: 55, neg: 14, neu: 31, items: 10 },
  { pos: 58, neg: 12, neu: 30, items: 14 },
  { pos: 54, neg: 17, neu: 29, items: 11 },
  { pos: 56, neg: 15, neu: 29, items: 13 },
].map((p, i) => ({
  window_start: fiveMinAgo(6 - i),
  window_end: fiveMinAgo(5 - i),
  positive_pct: p.pos,
  negative_pct: p.neg,
  neutral_pct: p.neu,
  total_items: p.items,
}));

const MCI_RMA_TIMELINE: TimelinePoint[] = [
  { pos: 45, neg: 22, neu: 33, items: 18 },
  { pos: 48, neg: 20, neu: 32, items: 22 },
  { pos: 50, neg: 18, neu: 32, items: 20 },
  { pos: 46, neg: 24, neu: 30, items: 17 },
  { pos: 49, neg: 19, neu: 32, items: 21 },
  { pos: 52, neg: 16, neu: 32, items: 19 },
  { pos: 48, neg: 21, neu: 31, items: 16 },
  { pos: 47, neg: 22, neu: 31, items: 18 },
].map((p, i) => ({
  window_start: fiveMinAgo(8 - i),
  window_end: fiveMinAgo(7 - i),
  positive_pct: p.pos,
  negative_pct: p.neg,
  neutral_pct: p.neu,
  total_items: p.items,
}));

export const MOCK_SENTIMENT: Record<string, SentimentResponse> = {
  "mock-arg-bra": {
    timeline: ARG_BRA_TIMELINE,
    teams: {
      Argentina: { positive_pct: 78.0, negative_pct: 12.0, neutral_pct: 10.0, total_items: 189 },
      Brazil: { positive_pct: 52.0, negative_pct: 28.0, neutral_pct: 20.0, total_items: 158 },
    },
    top_players: [
      { name: "Messi", mentions: 87, avg_sentiment_score: 0.87 },
      { name: "Scaloni", mentions: 34, avg_sentiment_score: 0.72 },
      { name: "Neymar", mentions: 29, avg_sentiment_score: 0.45 },
      { name: "Álvarez", mentions: 24, avg_sentiment_score: 0.82 },
      { name: "Vinícius Jr", mentions: 21, avg_sentiment_score: 0.38 },
      { name: "Casemiro", mentions: 18, avg_sentiment_score: 0.35 },
    ],
    top_keywords: ["goal", "penalty", "free-kick", "qualifier", "tactics", "transfer", "injury", "referee"],
  },
  "mock-esp-fra": {
    timeline: ESP_FRA_TIMELINE,
    teams: {
      Spain: { positive_pct: 62.0, negative_pct: 14.0, neutral_pct: 24.0, total_items: 52 },
      France: { positive_pct: 48.0, negative_pct: 18.0, neutral_pct: 34.0, total_items: 37 },
    },
    top_players: [
      { name: "Mbappé", mentions: 32, avg_sentiment_score: 0.55 },
      { name: "Yamal", mentions: 28, avg_sentiment_score: 0.78 },
      { name: "Pedri", mentions: 19, avg_sentiment_score: 0.74 },
      { name: "Dembélé", mentions: 14, avg_sentiment_score: 0.52 },
    ],
    top_keywords: ["tactics", "preview", "formation", "youth", "rivalry"],
  },
  "mock-mci-rma": {
    timeline: MCI_RMA_TIMELINE,
    teams: {
      "Manchester City": { positive_pct: 50.0, negative_pct: 22.0, neutral_pct: 28.0, total_items: 68 },
      "Real Madrid": { positive_pct: 46.0, negative_pct: 18.0, neutral_pct: 36.0, total_items: 56 },
    },
    top_players: [
      { name: "Haaland", mentions: 38, avg_sentiment_score: 0.68 },
      { name: "Vinícius Jr", mentions: 31, avg_sentiment_score: 0.62 },
      { name: "Guardiola", mentions: 25, avg_sentiment_score: 0.55 },
      { name: "Bellingham", mentions: 22, avg_sentiment_score: 0.71 },
      { name: "Ancelotti", mentions: 18, avg_sentiment_score: 0.60 },
    ],
    top_keywords: ["champions league", "tactics", "rivalry", "haaland", "transfer"],
  },
};

/* ---- Content (headlines) ---------------------------------------- */

export const MOCK_CONTENT: Record<string, ContentResponse> = {
  "mock-arg-bra": {
    items: [
      { id: "c1", source: "bbc", text: "Messi scores stunning free-kick as Argentina dominate qualifier", url: "#", sentiment: "positive", sentiment_score: 0.94, entities: [{ name: "Messi", type: "player" }, { name: "Argentina", type: "team" }], keywords: ["goal", "free-kick", "qualifier"], published_at: minsAgo(2) },
      { id: "c2", source: "espn", text: "Argentina's midfield masterclass leaves Brazil struggling for answers", url: "#", sentiment: "positive", sentiment_score: 0.88, entities: [{ name: "Argentina", type: "team" }, { name: "Brazil", type: "team" }], keywords: ["tactics", "midfield", "qualifier"], published_at: minsAgo(5) },
      { id: "c3", source: "skysports", text: "Neymar injury doubt ahead of second half in crucial qualifier", url: "#", sentiment: "negative", sentiment_score: 0.82, entities: [{ name: "Neymar", type: "player" }], keywords: ["injury", "doubt"], published_at: minsAgo(8) },
      { id: "c4", source: "bbc", text: "Scaloni praises squad depth after dominant first-half display", url: "#", sentiment: "positive", sentiment_score: 0.85, entities: [{ name: "Scaloni", type: "manager" }, { name: "Argentina", type: "team" }], keywords: ["manager", "tactics"], published_at: minsAgo(12) },
      { id: "c5", source: "goal", text: "Brazil fans frustrated as team fails to create clear chances", url: "#", sentiment: "negative", sentiment_score: 0.78, entities: [{ name: "Brazil", type: "team" }], keywords: ["frustration", "attack"], published_at: minsAgo(14) },
      { id: "c6", source: "espn", text: "Álvarez double seals Argentina's convincing World Cup qualifier win", url: "#", sentiment: "positive", sentiment_score: 0.92, entities: [{ name: "Álvarez", type: "player" }, { name: "Argentina", type: "team" }], keywords: ["goal", "qualifier"], published_at: minsAgo(18) },
      { id: "c7", source: "skysports", text: "Casemiro receives yellow card for cynical foul on Messi", url: "#", sentiment: "neutral", sentiment_score: 0.51, entities: [{ name: "Casemiro", type: "player" }, { name: "Messi", type: "player" }], keywords: ["yellow card", "foul"], published_at: minsAgo(22) },
      { id: "c8", source: "bbc", text: "World Cup 2026 qualifier preview: Everything you need to know", url: "#", sentiment: "neutral", sentiment_score: 0.50, entities: [{ name: "Argentina", type: "team" }, { name: "Brazil", type: "team" }], keywords: ["preview", "qualifier"], published_at: minsAgo(30) },
      { id: "c9", source: "goal", text: "Vinícius Jr equaliser gives Brazil brief hope before collapse", url: "#", sentiment: "negative", sentiment_score: 0.65, entities: [{ name: "Vinícius Jr", type: "player" }, { name: "Brazil", type: "team" }], keywords: ["goal", "equaliser"], published_at: minsAgo(35) },
      { id: "c10", source: "espn", text: "Argentina's tactical evolution under Scaloni continues to impress analysts", url: "#", sentiment: "positive", sentiment_score: 0.86, entities: [{ name: "Scaloni", type: "manager" }, { name: "Argentina", type: "team" }], keywords: ["tactics", "analysis"], published_at: minsAgo(40) },
      { id: "c11", source: "skysports", text: "Brazil's defensive woes exposed once again in qualifier", url: "#", sentiment: "negative", sentiment_score: 0.74, entities: [{ name: "Brazil", type: "team" }], keywords: ["defence", "weakness"], published_at: minsAgo(45) },
      { id: "c12", source: "bbc", text: "Messi sets new record for most assists in World Cup qualifiers", url: "#", sentiment: "positive", sentiment_score: 0.95, entities: [{ name: "Messi", type: "player" }], keywords: ["record", "assist"], published_at: minsAgo(50) },
      { id: "c13", source: "goal", text: "Fans react: 'Messi is still the GOAT even at 38'", url: "#", sentiment: "positive", sentiment_score: 0.91, entities: [{ name: "Messi", type: "player" }], keywords: ["fans", "GOAT"], published_at: minsAgo(55) },
      { id: "c14", source: "espn", text: "Brazil manager under mounting pressure after another poor result", url: "#", sentiment: "negative", sentiment_score: 0.80, entities: [{ name: "Brazil", type: "team" }], keywords: ["manager", "pressure"], published_at: minsAgo(58) },
      { id: "c15", source: "skysports", text: "Argentina fans celebrate as team secures top spot in CONMEBOL group", url: "#", sentiment: "positive", sentiment_score: 0.89, entities: [{ name: "Argentina", type: "team" }], keywords: ["celebration", "group stage"], published_at: minsAgo(62) },
    ],
    total: 347,
    has_more: true,
  },
  "mock-esp-fra": {
    items: [
      { id: "s1", source: "bbc", text: "Spain vs France: Yamal tipped to star in highly anticipated qualifier", url: "#", sentiment: "positive", sentiment_score: 0.78, entities: [{ name: "Yamal", type: "player" }], keywords: ["preview", "youth"], published_at: minsAgo(10) },
      { id: "s2", source: "espn", text: "Mbappé fitness update: France star declared fit for Spain clash", url: "#", sentiment: "neutral", sentiment_score: 0.55, entities: [{ name: "Mbappé", type: "player" }], keywords: ["fitness", "update"], published_at: minsAgo(25) },
      { id: "s3", source: "goal", text: "Deschamps reveals tactical plan to neutralize Spain's midfield", url: "#", sentiment: "neutral", sentiment_score: 0.52, entities: [{ name: "Deschamps", type: "manager" }], keywords: ["tactics", "preview"], published_at: minsAgo(40) },
      { id: "s4", source: "skysports", text: "Pedri in outstanding form ahead of France showdown", url: "#", sentiment: "positive", sentiment_score: 0.82, entities: [{ name: "Pedri", type: "player" }], keywords: ["form", "preview"], published_at: minsAgo(55) },
    ],
    total: 89,
    has_more: true,
  },
  "mock-mci-rma": {
    items: [
      { id: "m1", source: "bbc", text: "Haaland vs Vinícius: The battle that could define the Champions League", url: "#", sentiment: "neutral", sentiment_score: 0.55, entities: [{ name: "Haaland", type: "player" }, { name: "Vinícius Jr", type: "player" }], keywords: ["preview", "champions league"], published_at: minsAgo(15) },
      { id: "m2", source: "espn", text: "Guardiola seeking tactical edge in Champions League rematch with Real Madrid", url: "#", sentiment: "neutral", sentiment_score: 0.58, entities: [{ name: "Guardiola", type: "manager" }], keywords: ["tactics", "champions league"], published_at: minsAgo(30) },
      { id: "m3", source: "goal", text: "Bellingham injury scare gives Man City hope ahead of clash", url: "#", sentiment: "negative", sentiment_score: 0.65, entities: [{ name: "Bellingham", type: "player" }], keywords: ["injury", "hope"], published_at: minsAgo(50) },
      { id: "m4", source: "skysports", text: "Ancelotti confident Real Madrid can overturn City's home advantage", url: "#", sentiment: "positive", sentiment_score: 0.72, entities: [{ name: "Ancelotti", type: "manager" }], keywords: ["confidence", "preview"], published_at: minsAgo(65) },
    ],
    total: 124,
    has_more: true,
  },
};

/* ---- AI summaries ----------------------------------------------- */

export const MOCK_SUMMARIES: Record<string, SummaryResponse> = {
  "mock-arg-bra": {
    summary: {
      text: "Football headlines are overwhelmingly positive around the Argentina vs Brazil qualifier. Messi's stunning free-kick in the 23rd minute has dominated discussion across all major outlets, with fans hailing his continued brilliance at 38. Brazil's defensive vulnerabilities have been a recurring theme, with Vinícius Jr's equalizer only temporarily shifting sentiment. Álvarez's second-half strike has sealed the narrative — Argentina's tactical evolution under Scaloni continues to impress analysts and fans alike.",
      generated_at: minsAgo(3),
      covers_from: minsAgo(60),
      covers_to: minsAgo(3),
    },
  },
  "mock-esp-fra": {
    summary: {
      text: "Pre-match sentiment for the Spain vs France qualifier is cautiously optimistic across outlets. Yamal's meteoric rise continues to generate excitement, while Mbappé's fitness confirmation has balanced the narrative. Tactical previews dominate the headlines, with both managers deploying strategic mind games through the press. The consensus: this could be the match of the qualifying round.",
      generated_at: minsAgo(15),
      covers_from: minsAgo(120),
      covers_to: minsAgo(15),
    },
  },
  "mock-mci-rma": {
    summary: {
      text: "The Champions League showdown between Manchester City and Real Madrid is generating evenly split sentiment. Haaland's goal-scoring form excites City fans, but Bellingham's injury concern has shifted the balance slightly. Guardiola and Ancelotti's tactical chess match is a dominant narrative across all outlets, with pundits unable to call a clear favorite.",
      generated_at: minsAgo(20),
      covers_from: minsAgo(180),
      covers_to: minsAgo(20),
    },
  },
};
