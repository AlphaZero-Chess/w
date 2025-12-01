// ==UserScript==
// @name         Lichess Bot - AlphaZero Ultimate
// @description  True AlphaZero-style: hyper-aggressive, deep tactics, pawn storms, prophylaxis, flawless endgames
// @author       AlphaZero - Ultimate Edition
// @version      3.0.0-ULTIMATE
// @match        *://lichess.org/*
// @run-at       document-start
// @grant        none
// @require      https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════════════════════
// ALPHAZERO CONFIGURATION - Hyper-Aggressive, Strategic, Ruthless
// ═══════════════════════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing (slightly faster for aggression)
    thinkingTimeMin: 180,
    thinkingTimeMax: 1400,
    humanMistakeRate: 0.02, // Lower - AlphaZero doesn't make mistakes
    
    // Depth Configuration (deeper for precision)
    baseDepth: 12,
    tacticalDepth: 15,      // Deep tactics
    positionalDepth: 14,    // Strategic webs
    endgameDepth: 16,       // Flawless endgame
    openingDepth: 11,
    sacrificeDepth: 16,     // Deep sacrifice calculation
    pawnStormDepth: 14,     // Pawn storm evaluation
    
    // Speed multipliers
    openingSpeed: 0.35,
    earlyMidSpeed: 0.70,
    middlegameSpeed: 0.85,
    lateMidSpeed: 0.80,
    endgameSpeed: 0.75,
    criticalSpeed: 1.3,     // More time on critical positions
    sacrificeSpeed: 1.4,    // Extra time for sacrifices
    
    // Time thresholds
    panicThreshold: 8000,
    criticalThreshold: 15000,
    
    // AlphaZero Style Parameters
    aggressionFactor: 0.85,      // High aggression (0-1)
    initiativeWeight: 1.4,       // Value initiative highly
    activityBonus: 1.3,          // Piece activity over material
    pawnStormBonus: 1.5,         // Love pawn storms
    prophylaxisWeight: 1.2,      // Deep prophylaxis
    exchangeSacrificeThreshold: 0.7, // Willing to sacrifice exchanges
    grindingPatience: 0.95,      // Patient grinding in equal positions
    kingSafetyAggressor: 1.6,    // Attack opponent's king
    spaceAdvantageWeight: 1.3,   // Value space
    
    // Contempt Settings (force wins, avoid draws)
    contemptValue: 50,           // High contempt - play for win
    drawContempt: 40,            // Avoid draws aggressively
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// ALPHAZERO OPENING BOOK - All ECO Codes with Aggressive Lines
// ═══════════════════════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // ═══════════════════════════════════════════════════════════════════════
    // STARTING POSITION - White's Choices (AlphaZero preferred 1.d4 and 1.e4)
    // ═══════════════════════════════════════════════════════════════════════
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.40 },  // AlphaZero's favorite
            { move: "e2e4", weight: 0.35 },  // Classical aggression
            { move: "c2c4", weight: 0.12 },  // English - flexible
            { move: "g1f3", weight: 0.08 },  // Reti - hypermodern
            { move: "f2f4", weight: 0.03 },  // Bird - surprising
            { move: "b2b3", weight: 0.02 },  // Larsen - unconventional
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // E00-E99: QUEEN'S PAWN - INDIAN DEFENSES (AlphaZero's Domain)
    // ═══════════════════════════════════════════════════════════════════════
    
    // After 1.d4
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.45 },  // Indian setups
            { move: "d7d5", weight: 0.30 },  // Classical
            { move: "e7e6", weight: 0.12 },  // French-like
            { move: "c7c5", weight: 0.08 },  // Benoni spirit
            { move: "f7f5", weight: 0.05 },  // Dutch aggression
        ]
    },
    
    // 1.d4 Nf6
    "rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "c2c4", weight: 0.55 },  // Main line
            { move: "g1f3", weight: 0.25 },  // Solid
            { move: "c1g5", weight: 0.12 },  // Trompowsky Attack!
            { move: "b1c3", weight: 0.08 },  // Veresov
        ]
    },
    
    // 1.d4 Nf6 2.c4 - Indian Game Base
    "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.30 },  // Nimzo/QID
            { move: "g7g6", weight: 0.35 },  // King's Indian/Grunfeld - AlphaZero loves this
            { move: "c7c5", weight: 0.15 },  // Benoni
            { move: "e7e5", weight: 0.12 },  // Budapest Gambit!
            { move: "c7c6", weight: 0.08 },  // Slav structure
        ]
    },
    
    // King's Indian Defense - AlphaZero's playground
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Main line
            { move: "g1f3", weight: 0.30 },  // Classical
            { move: "f2f3", weight: 0.12 },  // Samisch - pawn storm!
            { move: "g2g3", weight: 0.08 },  // Fianchetto
        ]
    },
    
    // King's Indian - Classical setup
    "rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR b KQkq e3": {
        black: [
            { move: "e8g8", weight: 0.45 },  // Castle and attack!
            { move: "e7e5", weight: 0.40 },  // Central break
            { move: "c7c5", weight: 0.10 },  // Benoni transformation
            { move: "b8d7", weight: 0.05 },
        ]
    },
    
    // King's Indian - Bayonet Attack position
    "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP2BPPP/R1BQK2R b KQ -": {
        black: [
            { move: "e7e5", weight: 0.55 },  // Strike!
            { move: "c7c5", weight: 0.25 },
            { move: "b8d7", weight: 0.12 },
            { move: "c7c6", weight: 0.08 },
        ]
    },
    
    // Grunfeld Defense
    "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
        white: [
            { move: "c4d5", weight: 0.40 },  // Exchange - AlphaZero style
            { move: "g1f3", weight: 0.30 },
            { move: "c1f4", weight: 0.18 },  // Aggressive
            { move: "d1b3", weight: 0.12 },  // Pressure
        ]
    },
    
    // Nimzo-Indian Defense
    "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "e2e3", weight: 0.35 },  // Rubinstein
            { move: "d1c2", weight: 0.30 },  // Classical
            { move: "c1g5", weight: 0.20 },  // Leningrad
            { move: "f2f3", weight: 0.15 },  // Samisch - aggressive!
        ]
    },
    
    // Queen's Indian Defense
    "rnbqkb1r/p1pp1ppp/1p2pn2/8/2PP4/5N2/PP2PPPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "g2g3", weight: 0.40 },  // Fianchetto
            { move: "a2a3", weight: 0.25 },  // Petrosian
            { move: "b1c3", weight: 0.20 },
            { move: "c1f4", weight: 0.15 },  // Aggressive
        ]
    },
    
    // Catalan Opening - AlphaZero loves this!
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.50 },  // Classical
            { move: "f8b4", weight: 0.25 },  // Check
            { move: "c7c5", weight: 0.15 },
            { move: "b7b6", weight: 0.10 },
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // B00-B99: SEMI-OPEN GAMES (1.e4 without 1...e5)
    // ═══════════════════════════════════════════════════════════════════════
    
    // After 1.e4
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.40 },  // Sicilian - fighting chess
            { move: "e7e5", weight: 0.30 },  // Open game
            { move: "e7e6", weight: 0.12 },  // French
            { move: "c7c6", weight: 0.10 },  // Caro-Kann
            { move: "d7d5", weight: 0.05 },  // Scandinavian
            { move: "g7g6", weight: 0.03 },  // Modern/Pirc
        ]
    },
    
    // SICILIAN DEFENSE - AlphaZero's aggression shines
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.50 },  // Open Sicilian
            { move: "b1c3", weight: 0.20 },  // Closed
            { move: "c2c3", weight: 0.15 },  // Alapin
            { move: "f2f4", weight: 0.10 },  // Grand Prix Attack!
            { move: "b2b4", weight: 0.05 },  // Wing Gambit - aggressive
        ]
    },
    
    // Sicilian - Open
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.40 },  // Najdorf/Dragon territory
            { move: "b8c6", weight: 0.30 },  // Classical
            { move: "e7e6", weight: 0.20 },  // Scheveningen/Kan
            { move: "g7g6", weight: 0.10 },  // Accelerated Dragon
        ]
    },
    
    // Sicilian Najdorf - The fighting defense
    "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "c1g5", weight: 0.35 },  // English Attack
            { move: "f2f3", weight: 0.30 },  // English Attack setup
            { move: "c1e3", weight: 0.20 },  // English Attack
            { move: "f1c4", weight: 0.10 },  // Fischer's favorite
            { move: "f1e2", weight: 0.05 },
        ]
    },
    
    // Sicilian Dragon
    "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "f2f3", weight: 0.40 },  // Yugoslav Attack - pawn storm!
            { move: "c1e3", weight: 0.35 },  // Yugoslav prep
            { move: "f1c4", weight: 0.15 },  // Classical
            { move: "f1e2", weight: 0.10 },
        ]
    },
    
    // Dragon Yugoslav Attack - PAWN STORM TIME
    "r1bqk2r/pp2ppbp/2np1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R b KQkq -": {
        black: [
            { move: "e8g8", weight: 0.50 },  // Castle into the storm!
            { move: "a7a6", weight: 0.25 },
            { move: "b8d7", weight: 0.15 },
            { move: "d8a5", weight: 0.10 },
        ]
    },
    
    // FRENCH DEFENSE
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },  // Main line
            { move: "d2d3", weight: 0.20 },  // King's Indian Attack
            { move: "b1c3", weight: 0.15 },
            { move: "g1f3", weight: 0.10 },
        ]
    },
    
    // French - Advance Variation (space advantage)
    "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.55 },  // Strike the center!
            { move: "c8d7", weight: 0.20 },
            { move: "b8c6", weight: 0.15 },
            { move: "d8b6", weight: 0.10 },
        ]
    },
    
    // CARO-KANN DEFENSE
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },  // Main line
            { move: "b1c3", weight: 0.25 },  // Two Knights
            { move: "g1f3", weight: 0.15 },
            { move: "f2f3", weight: 0.10 },  // Fantasy Variation!
        ]
    },
    
    // Caro-Kann Advance
    "rnbqkbnr/pp2pppp/2p5/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "c8f5", weight: 0.45 },  // Short Variation
            { move: "c7c5", weight: 0.30 },  // Strike!
            { move: "e7e6", weight: 0.15 },
            { move: "b8a6", weight: 0.10 },
        ]
    },
    
    // PIRC/MODERN DEFENSE
    "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },  // Classical
            { move: "b1c3", weight: 0.25 },
            { move: "g1f3", weight: 0.15 },
            { move: "f2f4", weight: 0.10 },  // Austrian Attack!
        ]
    },
    
    // Pirc - Austrian Attack (aggressive!)
    "rnbqkb1r/ppp1pp1p/3p1np1/8/3PPP2/2N5/PPP3PP/R1BQKBNR b KQkq f3": {
        black: [
            { move: "f8g7", weight: 0.50 },
            { move: "c7c5", weight: 0.30 },
            { move: "e8g8", weight: 0.20 },
        ]
    },
    
    // ALEKHINE DEFENSE
    "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e4e5", weight: 0.55 },  // Chase the knight!
            { move: "b1c3", weight: 0.25 },
            { move: "d2d3", weight: 0.20 },
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // C00-C99: OPEN GAMES (1.e4 e5)
    // ═══════════════════════════════════════════════════════════════════════
    
    // 1.e4 e5
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6": {
        white: [
            { move: "g1f3", weight: 0.55 },  // King's Knight
            { move: "f1c4", weight: 0.20 },  // Italian Game
            { move: "f2f4", weight: 0.15 },  // King's Gambit!
            { move: "b1c3", weight: 0.10 },  // Vienna
        ]
    },
    
    // King's Gambit - AlphaZero aggression
    "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
        black: [
            { move: "e5f4", weight: 0.50 },  // Accept!
            { move: "f8c5", weight: 0.25 },  // Decline
            { move: "d7d5", weight: 0.15 },  // Falkbeer Counter
            { move: "b8c6", weight: 0.10 },
        ]
    },
    
    // Italian Game
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "f8c5", weight: 0.40 },  // Giuoco Piano
            { move: "g8f6", weight: 0.35 },  // Two Knights
            { move: "f8e7", weight: 0.15 },  // Hungarian
            { move: "d7d6", weight: 0.10 },
        ]
    },
    
    // Giuoco Piano
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "c2c3", weight: 0.40 },  // Main line - preparing d4
            { move: "b2b4", weight: 0.25 },  // Evans Gambit!
            { move: "d2d3", weight: 0.20 },  // Giuoco Pianissimo
            { move: "e1g1", weight: 0.15 },
        ]
    },
    
    // Evans Gambit - Sacrificial aggression
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/1PB1P3/5N2/P1PP1PPP/RNBQK2R b KQkq b3": {
        black: [
            { move: "c5b4", weight: 0.55 },  // Accept
            { move: "c5b6", weight: 0.25 },  // Decline
            { move: "c5e7", weight: 0.20 },
        ]
    },
    
    // Two Knights Defense
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "g1f3", weight: 0.35 },
            { move: "d2d4", weight: 0.30 },  // Open it up!
            { move: "f3g5", weight: 0.25 },  // Fried Liver territory!
            { move: "b1c3", weight: 0.10 },
        ]
    },
    
    // Ruy Lopez - Spanish Game
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.45 },  // Morphy Defense
            { move: "g8f6", weight: 0.25 },  // Berlin
            { move: "f8c5", weight: 0.15 },  // Classical
            { move: "d7d6", weight: 0.10 },  // Steinitz
            { move: "f7f5", weight: 0.05 },  // Schliemann Gambit!
        ]
    },
    
    // Ruy Lopez - Morphy Defense
    "r1bqkbnr/1ppp1ppp/p1n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "b5a4", weight: 0.55 },  // Main line
            { move: "b5c6", weight: 0.30 },  // Exchange Variation
            { move: "d2d4", weight: 0.15 },  // Central attack
        ]
    },
    
    // Berlin Defense (drawing weapon - AlphaZero finds ways!)
    "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "e1g1", weight: 0.50 },  // Castle
            { move: "d2d3", weight: 0.25 },
            { move: "f3e5", weight: 0.15 },  // Aggressive!
            { move: "b1c3", weight: 0.10 },
        ]
    },
    
    // Scotch Game
    "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "e5d4", weight: 0.55 },  // Main line
            { move: "d7d6", weight: 0.25 },
            { move: "f8c5", weight: 0.20 },
        ]
    },
    
    // Petrov Defense
    "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f3e5", weight: 0.45 },  // Main line
            { move: "b1c3", weight: 0.30 },  // Three Knights
            { move: "d2d4", weight: 0.25 },  // Steinitz Attack
        ]
    },
    
    // Four Knights Game
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "f1b5", weight: 0.40 },  // Spanish
            { move: "f1c4", weight: 0.30 },  // Italian
            { move: "d2d4", weight: 0.20 },  // Scotch
            { move: "g2g3", weight: 0.10 },
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // A00-A99: FLANK OPENINGS
    // ═══════════════════════════════════════════════════════════════════════
    
    // English Opening
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e5", weight: 0.35 },  // Reversed Sicilian
            { move: "g8f6", weight: 0.30 },
            { move: "c7c5", weight: 0.20 },  // Symmetrical
            { move: "e7e6", weight: 0.10 },
            { move: "g7g6", weight: 0.05 },
        ]
    },
    
    // English - Reversed Sicilian
    "rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq e6": {
        white: [
            { move: "b1c3", weight: 0.40 },
            { move: "g2g3", weight: 0.35 },  // Fianchetto
            { move: "g1f3", weight: 0.25 },
        ]
    },
    
    // Reti Opening
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.40 },
            { move: "g8f6", weight: 0.35 },
            { move: "c7c5", weight: 0.15 },
            { move: "e7e6", weight: 0.10 },
        ]
    },
    
    // Bird's Opening
    "rnbqkbnr/pppppppp/8/8/5P2/8/PPPPP1PP/RNBQKBNR b KQkq f3": {
        black: [
            { move: "d7d5", weight: 0.45 },
            { move: "e7e5", weight: 0.25 },  // From Gambit
            { move: "g8f6", weight: 0.20 },
            { move: "c7c5", weight: 0.10 },
        ]
    },
    
    // Dutch Defense (aggressive for Black)
    "rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR w KQkq f6": {
        white: [
            { move: "g2g3", weight: 0.40 },  // Leningrad
            { move: "c2c4", weight: 0.35 },
            { move: "c1g5", weight: 0.15 },  // Aggressive
            { move: "e2e4", weight: 0.10 },  // Staunton Gambit!
        ]
    },
    
    // Leningrad Dutch
    "rnbqkb1r/ppppp2p/5np1/5p2/2PP4/6P1/PP2PP1P/RNBQKBNR w KQkq -": {
        white: [
            { move: "f1g2", weight: 0.50 },
            { move: "g1f3", weight: 0.30 },
            { move: "b1c3", weight: 0.20 },
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // D00-D99: QUEEN'S PAWN GAMES
    // ═══════════════════════════════════════════════════════════════════════
    
    // Queen's Gambit
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.35 },  // QGD
            { move: "c7c6", weight: 0.30 },  // Slav
            { move: "d5c4", weight: 0.20 },  // QGA
            { move: "g8f6", weight: 0.10 },
            { move: "c7c5", weight: 0.05 },  // Symmetrical
        ]
    },
    
    // Queen's Gambit Declined
    "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.40 },
            { move: "g1f3", weight: 0.35 },
            { move: "c1g5", weight: 0.15 },  // Aggressive
            { move: "c4d5", weight: 0.10 },  // Exchange
        ]
    },
    
    // QGD - Orthodox Defense
    "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "c1g5", weight: 0.45 },  // Main line
            { move: "g1f3", weight: 0.30 },
            { move: "c4d5", weight: 0.15 },  // Exchange
            { move: "c1f4", weight: 0.10 },
        ]
    },
    
    // Slav Defense
    "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g1f3", weight: 0.40 },
            { move: "b1c3", weight: 0.30 },
            { move: "c4d5", weight: 0.20 },  // Exchange
            { move: "e2e3", weight: 0.10 },
        ]
    },
    
    // Semi-Slav Defense
    "rnbqkb1r/pp3ppp/2p1pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "e2e3", weight: 0.40 },  // Meran
            { move: "c1g5", weight: 0.35 },  // Anti-Meran
            { move: "d1c2", weight: 0.15 },
            { move: "g2g3", weight: 0.10 },
        ]
    },
    
    // Queen's Gambit Accepted
    "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g1f3", weight: 0.45 },
            { move: "e2e4", weight: 0.30 },  // Central control
            { move: "e2e3", weight: 0.25 },
        ]
    },
    
    // London System (solid but AlphaZero plays aggressively)
    "rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.40 },  // Challenge!
            { move: "e7e6", weight: 0.30 },
            { move: "c8f5", weight: 0.20 },  // Mirror
            { move: "c7c6", weight: 0.10 },
        ]
    },
    
    // Trompowsky Attack
    "rnbqkb1r/pppppppp/5n2/6B1/3P4/8/PPP1PPPP/RN1QKBNR b KQkq -": {
        black: [
            { move: "f6e4", weight: 0.40 },  // Active!
            { move: "e7e6", weight: 0.30 },
            { move: "d7d5", weight: 0.20 },
            { move: "c7c5", weight: 0.10 },
        ]
    },
    
    // Benoni Defense
    "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.45 },
            { move: "g1f3", weight: 0.30 },
            { move: "e2e4", weight: 0.25 },  // Space!
        ]
    },
    
    // Modern Benoni
    "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "e6d5", weight: 0.50 },  // Open it!
            { move: "d7d6", weight: 0.30 },
            { move: "f8e7", weight: 0.20 },
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // ADDITIONAL AGGRESSIVE LINES
    // ═══════════════════════════════════════════════════════════════════════
    
    // Scandinavian Defense
    "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "e4d5", weight: 0.65 },  // Take it!
            { move: "b1c3", weight: 0.20 },
            { move: "e4e5", weight: 0.15 },
        ]
    },
    
    // Vienna Game
    "rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.45 },
            { move: "b8c6", weight: 0.30 },
            { move: "f8c5", weight: 0.25 },
        ]
    },
    
    // Vienna Gambit
    "rnbqkbnr/pppp1ppp/8/4p3/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq f3": {
        black: [
            { move: "e5f4", weight: 0.45 },  // Accept
            { move: "d7d5", weight: 0.35 },  // Counter
            { move: "f8c5", weight: 0.20 },
        ]
    },
    
    // King's Indian Attack (White system)
    "rnbqkbnr/ppp1pppp/8/3p4/8/5NP1/PPPPPP1P/RNBQKB1R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.40 },
            { move: "c7c5", weight: 0.30 },
            { move: "b8c6", weight: 0.20 },
            { move: "c8g4", weight: 0.10 },
        ]
    },
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// ALPHAZERO STRATEGIC PATTERNS - Pawn Storms, Prophylaxis, Sacrifices
// ═══════════════════════════════════════════════════════════════════════════════════════

const STRATEGIC_PATTERNS = {
    // Pawn storm patterns (kingside)
    kingsidePawnStorm: {
        triggers: ['h4', 'g4', 'f4', 'h5', 'g5'],
        bonus: 0.25,
        description: "Kingside pawn storm initiated"
    },
    // Pawn storm patterns (queenside)
    queensidePawnStorm: {
        triggers: ['a4', 'b4', 'c4', 'a5', 'b5'],
        bonus: 0.20,
        description: "Queenside pawn storm initiated"
    },
    // Central breakthrough
    centralBreak: {
        triggers: ['d4', 'd5', 'e4', 'e5', 'c4', 'c5'],
        bonus: 0.15,
        description: "Central pawn break"
    },
    // Piece activity moves
    pieceActivity: {
        triggers: ['outpost', 'centralize', 'activate'],
        bonus: 0.20,
        description: "Piece activation priority"
    }
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// ENDGAME MASTERY PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════════════

const ENDGAME_PATTERNS = {
    // King activity in endgame
    kingActivity: {
        priority: 'highest',
        description: "Activate king in endgame"
    },
    // Passed pawn creation
    passedPawns: {
        priority: 'very_high',
        description: "Create and push passed pawns"
    },
    // Rook activity
    rookActivity: {
        priority: 'high',
        description: "Rooks behind passed pawns or on 7th rank"
    },
    // Opposition
    opposition: {
        priority: 'high',
        description: "Gain opposition in king endgames"
    },
    // Zugzwang recognition
    zugzwang: {
        priority: 'medium',
        description: "Force opponent into zugzwang"
    }
};

// ═══════════════════════════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════════════════════════════

let chessEngine;
let currentFen = "";
let bestMove;
let webSocketWrapper = null;
let gamePhase = "opening";
let positionType = "normal";
let multiPVLines = [];
let myColor = null;
let moveCount = 0;
let timeRemaining = 30000;
let lastMoves = [];
let pawnStructure = {};
let attackingPatterns = [];

// ═══════════════════════════════════════════════════════════════════════════════════════
// OPTIMIZED ALPHAZERO-STYLE HELPERS
// ═══════════════════════════════════════════════════════════════════════════════════════

/**
 * Fast piece counting (optimized)
 */
function countPieces(fen) {
    let count = 0;
    const board = fen.split(' ')[0];
    for (let i = 0; i < board.length; i++) {
        const char = board[i];
        if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            count++;
        }
    }
    return count;
}

/**
 * Count specific piece types
 */
function countPieceTypes(fen) {
    const board = fen.split(' ')[0];
    const counts = {
        whitePawns: 0, blackPawns: 0,
        whiteKnights: 0, blackKnights: 0,
        whiteBishops: 0, blackBishops: 0,
        whiteRooks: 0, blackRooks: 0,
        whiteQueens: 0, blackQueens: 0,
        total: 0
    };
    
    for (let i = 0; i < board.length; i++) {
        const char = board[i];
        switch(char) {
            case 'P': counts.whitePawns++; counts.total++; break;
            case 'p': counts.blackPawns++; counts.total++; break;
            case 'N': counts.whiteKnights++; counts.total++; break;
            case 'n': counts.blackKnights++; counts.total++; break;
            case 'B': counts.whiteBishops++; counts.total++; break;
            case 'b': counts.blackBishops++; counts.total++; break;
            case 'R': counts.whiteRooks++; counts.total++; break;
            case 'r': counts.blackRooks++; counts.total++; break;
            case 'Q': counts.whiteQueens++; counts.total++; break;
            case 'q': counts.blackQueens++; counts.total++; break;
        }
    }
    return counts;
}

/**
 * Enhanced game phase detection (7 phases for AlphaZero precision)
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const pieceCounts = countPieceTypes(fen);
    
    // Opening phase
    if (moveNum <= 8) return "opening";
    if (moveNum <= 12 && pieces > 28) return "early-middlegame";
    
    // Check for early endgame conditions
    const hasQueens = pieceCounts.whiteQueens > 0 || pieceCounts.blackQueens > 0;
    
    if (!hasQueens && pieces <= 16) return "endgame";
    if (pieces > 22) return "middlegame";
    if (pieces > 16) return "late-middlegame";
    if (pieces > 10) return "early-endgame";
    if (pieces > 6) return "endgame";
    
    return "deep-endgame";
}

/**
 * AlphaZero-style position type detection
 */
function analyzePositionType(fen, moveHistory) {
    // Check for tactical indicators
    if (fen.indexOf("+") !== -1) return "tactical";
    
    const board = fen.split(' ')[0];
    const pieceCounts = countPieceTypes(fen);
    
    // Detect attacking formations (pawn storms)
    const kingsidePawnStorm = detectPawnStorm(board, 'kingside');
    const queensidePawnStorm = detectPawnStorm(board, 'queenside');
    
    if (kingsidePawnStorm || queensidePawnStorm) {
        return "attacking";
    }
    
    // Check for opposite-side castling (attack mode!)
    if (detectOppositeCastling(fen)) {
        return "opposite-castling-attack";
    }
    
    // Check for open files toward king
    if (detectOpenFilesTowardKing(board)) {
        return "tactical";
    }
    
    // Check for central tension
    if (detectCentralTension(board)) {
        return "dynamic";
    }
    
    // Piece activity check
    const minorPieces = pieceCounts.whiteKnights + pieceCounts.whiteBishops + 
                        pieceCounts.blackKnights + pieceCounts.blackBishops;
    
    if (minorPieces <= 2 && pieceCounts.total <= 12) {
        return "technical-endgame";
    }
    
    // Check for closed position
    if (detectClosedPosition(board)) {
        return "positional";
    }
    
    return "normal";
}

/**
 * Detect pawn storm on a flank
 */
function detectPawnStorm(board, side) {
    const rows = board.split('/');
    let advancedPawns = 0;
    
    if (side === 'kingside') {
        // Check f, g, h files for advanced pawns
        for (let i = 0; i < rows.length; i++) {
            const row = expandRow(rows[i]);
            // Check last 3 files
            for (let j = 5; j < 8; j++) {
                if (i < 4 && row[j] === 'P') advancedPawns++; // White pawns advanced
                if (i > 3 && row[j] === 'p') advancedPawns++; // Black pawns advanced
            }
        }
    } else {
        // Queenside - check a, b, c files
        for (let i = 0; i < rows.length; i++) {
            const row = expandRow(rows[i]);
            for (let j = 0; j < 3; j++) {
                if (i < 4 && row[j] === 'P') advancedPawns++;
                if (i > 3 && row[j] === 'p') advancedPawns++;
            }
        }
    }
    
    return advancedPawns >= 2;
}

/**
 * Expand FEN row (handle numbers)
 */
function expandRow(row) {
    let expanded = '';
    for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (char >= '1' && char <= '8') {
            expanded += '.'.repeat(parseInt(char));
        } else {
            expanded += char;
        }
    }
    return expanded;
}

/**
 * Detect opposite-side castling
 */
function detectOppositeCastling(fen) {
    const board = fen.split(' ')[0];
    const rows = board.split('/');
    
    let whiteKingFile = -1;
    let blackKingFile = -1;
    
    // Find kings
    for (let i = 0; i < rows.length; i++) {
        const row = expandRow(rows[i]);
        for (let j = 0; j < 8; j++) {
            if (row[j] === 'K') whiteKingFile = j;
            if (row[j] === 'k') blackKingFile = j;
        }
    }
    
    // Opposite sides: one king on files 0-2 (queenside), other on 5-7 (kingside)
    const whiteQueenside = whiteKingFile <= 2;
    const whiteKingside = whiteKingFile >= 5;
    const blackQueenside = blackKingFile <= 2;
    const blackKingside = blackKingFile >= 5;
    
    return (whiteQueenside && blackKingside) || (whiteKingside && blackQueenside);
}

/**
 * Detect open files toward enemy king
 */
function detectOpenFilesTowardKing(board) {
    // Simplified check for open files
    const rows = board.split('/');
    let openFiles = 0;
    
    for (let file = 0; file < 8; file++) {
        let hasPawn = false;
        for (let rank = 0; rank < 8; rank++) {
            const row = expandRow(rows[rank]);
            if (row[file] === 'P' || row[file] === 'p') {
                hasPawn = true;
                break;
            }
        }
        if (!hasPawn) openFiles++;
    }
    
    return openFiles >= 2;
}

/**
 * Detect central tension
 */
function detectCentralTension(board) {
    const rows = board.split('/');
    // Check central squares (d4, d5, e4, e5)
    const rank4 = expandRow(rows[4]);
    const rank3 = expandRow(rows[3]);
    
    let centralPawns = 0;
    if (rank4[3] === 'P' || rank4[3] === 'p') centralPawns++;
    if (rank4[4] === 'P' || rank4[4] === 'p') centralPawns++;
    if (rank3[3] === 'P' || rank3[3] === 'p') centralPawns++;
    if (rank3[4] === 'P' || rank3[4] === 'p') centralPawns++;
    
    return centralPawns >= 2;
}

/**
 * Detect closed position
 */
function detectClosedPosition(board) {
    const rows = board.split('/');
    let lockedPawns = 0;
    
    for (let rank = 1; rank < 7; rank++) {
        const currentRow = expandRow(rows[rank]);
        const nextRow = expandRow(rows[rank - 1]);
        
        for (let file = 0; file < 8; file++) {
            // White pawn blocked by black pawn
            if (currentRow[file] === 'P' && nextRow[file] === 'p') {
                lockedPawns++;
            }
        }
    }
    
    return lockedPawns >= 3;
}

/**
 * AlphaZero-style thinking time (strategic patience)
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // Phase-based timing
    switch(phase) {
        case "opening":
            speedMultiplier = CONFIG.openingSpeed;
            break;
        case "early-middlegame":
            speedMultiplier = CONFIG.earlyMidSpeed;
            break;
        case "middlegame":
            speedMultiplier = CONFIG.middlegameSpeed;
            break;
        case "late-middlegame":
            speedMultiplier = CONFIG.lateMidSpeed;
            break;
        case "early-endgame":
        case "endgame":
        case "deep-endgame":
            speedMultiplier = CONFIG.endgameSpeed;
            break;
    }
    
    // Position type adjustments (AlphaZero thinks more on attacks)
    switch(posType) {
        case "tactical":
        case "attacking":
            speedMultiplier *= CONFIG.criticalSpeed;
            break;
        case "opposite-castling-attack":
            speedMultiplier *= CONFIG.sacrificeSpeed;
            break;
        case "dynamic":
            speedMultiplier *= 1.15;
            break;
        case "technical-endgame":
            speedMultiplier *= 1.1;
            break;
        case "positional":
            speedMultiplier *= 1.05;
            break;
    }
    
    // Time pressure handling (AlphaZero stays calm)
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.60;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.45;
    if (timeLeft < 5000) speedMultiplier *= 0.35;
    if (timeLeft < 3000) speedMultiplier *= 0.28;
    if (timeLeft < 1500) speedMultiplier *= 0.20;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(120, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * AlphaZero-style adaptive depth (deeper on critical positions)
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // Phase-based depth
    switch(phase) {
        case "opening":
            depth = CONFIG.openingDepth;
            break;
        case "early-middlegame":
            depth = CONFIG.baseDepth;
            break;
        case "middlegame":
            depth = posType === "tactical" ? CONFIG.tacticalDepth : CONFIG.positionalDepth;
            break;
        case "late-middlegame":
            depth = CONFIG.positionalDepth;
            break;
        case "early-endgame":
        case "endgame":
        case "deep-endgame":
            depth = CONFIG.endgameDepth; // Flawless endgame!
            break;
    }
    
    // Position type depth boost
    switch(posType) {
        case "tactical":
        case "attacking":
            depth = Math.max(depth, CONFIG.tacticalDepth);
            break;
        case "opposite-castling-attack":
            depth = Math.max(depth, CONFIG.sacrificeDepth);
            break;
        case "technical-endgame":
            depth = Math.max(depth, CONFIG.endgameDepth);
            break;
    }
    
    // Time pressure depth reduction (but stay deep enough)
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(10, depth - 1);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(9, depth - 2);
    if (timeLeft < 5000) depth = Math.max(8, depth - 3);
    if (timeLeft < 3000) depth = Math.max(7, depth - 4);
    if (timeLeft < 1500) depth = Math.max(6, depth - 5);
    
    return depth;
}

/**
 * Weighted opening book selection (AlphaZero variety)
 */
function getBookMove(fen) {
    // Normalize FEN for lookup (first 4 parts)
    const fenParts = fen.split(' ');
    const fenKey = fenParts.slice(0, 4).join(' ');
    
    // Try exact match first
    let position = OPENINGS[fenKey];
    
    // Try without en passant square
    if (!position) {
        const fenKeyShort = fenParts.slice(0, 3).join(' ');
        for (const key of Object.keys(OPENINGS)) {
            if (key.startsWith(fenKeyShort)) {
                position = OPENINGS[key];
                break;
            }
        }
    }
    
    if (!position) return null;
    
    const moves = myColor === 'w' ? position.white : position.black;
    if (!moves || moves.length === 0) return null;
    
    // AlphaZero-style weighted selection with slight randomness
    const totalWeight = moves.reduce((sum, m) => sum + m.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let moveOption of moves) {
        random -= moveOption.weight;
        if (random <= 0) return moveOption.move;
    }
    
    return moves[0].move;
}

/**
 * AlphaZero-style move selection (minimal mistakes, strategic choices)
 */
function applyAlphaZeroStyle(bestMove, alternatives, posType) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    // Very low mistake rate for AlphaZero
    if (Math.random() < CONFIG.humanMistakeRate) {
        const secondBest = alternatives[1];
        const scoreDiff = Math.abs((alternatives[0].score || 0) - (secondBest.score || 0));
        
        // Only if moves are very close (within 0.3 pawns)
        if (scoreDiff < 30) {
            // Prefer aggressive/attacking moves in attacking positions
            if (posType === "attacking" || posType === "opposite-castling-attack") {
                const aggressiveMove = findAggressiveAlternative(alternatives);
                if (aggressiveMove) return aggressiveMove;
            }
            return secondBest.move;
        }
    }
    
    // AlphaZero prefers activity even at slight material cost
    if (posType === "positional" || posType === "normal") {
        const activeMove = findMostActiveMove(alternatives);
        if (activeMove && Math.random() < CONFIG.activityBonus - 1) {
            return activeMove;
        }
    }
    
    return bestMove;
}

/**
 * Find most aggressive alternative
 */
function findAggressiveAlternative(alternatives) {
    for (const alt of alternatives) {
        const move = alt.move;
        // Checks, captures toward king, pawn advances
        if (move && (move.includes('+') || move.includes('x'))) {
            return move;
        }
    }
    return null;
}

/**
 * Find most active move
 */
function findMostActiveMove(alternatives) {
    // Prioritize central squares and piece development
    const centralSquares = ['d4', 'd5', 'e4', 'e5', 'c4', 'c5', 'f4', 'f5'];
    
    for (const alt of alternatives.slice(0, 3)) {
        const move = alt.move;
        if (move) {
            const toSquare = move.slice(2, 4);
            if (centralSquares.includes(toSquare)) {
                return move;
            }
        }
    }
    return null;
}

/**
 * Fast multi-PV parsing
 */
function parseMultiPV(output) {
    const lines = output.split('\n');
    const pvLines = [];
    
    for (let line of lines) {
        if (line.indexOf('multipv') !== -1) {
            const pvMatch = line.match(/pv\s+(\w+)/);
            const scoreMatch = line.match(/score\s+cp\s+(-?\d+)/);
            const mateMatch = line.match(/score\s+mate\s+(-?\d+)/);
            
            if (pvMatch) {
                let score = 0;
                if (scoreMatch) {
                    score = parseInt(scoreMatch[1]);
                } else if (mateMatch) {
                    // Mate scores (positive = winning, negative = losing)
                    const mateIn = parseInt(mateMatch[1]);
                    score = mateIn > 0 ? 10000 - mateIn : -10000 - mateIn;
                }
                
                pvLines.push({
                    move: pvMatch[1],
                    score: score
                });
            }
        }
    }
    
    return pvLines.sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - AlphaZero-optimized Settings (Stable)
// ═══════════════════════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    chessEngine.postMessage("setoption name MultiPV value 3");
    chessEngine.postMessage("setoption name Contempt value " + CONFIG.contemptValue);
    chessEngine.postMessage("setoption name Move Overhead value 40");
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION
// ═══════════════════════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    let webSocket = window.WebSocket;
    
    const webSocketProxy = new Proxy(webSocket, {
        construct: function(target, args) {
            let wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;
            
            wrappedWebSocket.addEventListener("message", function(event) {
                let message = JSON.parse(event.data);
                
                if (message.d && typeof message.d.fen === "string" && typeof message.v === "number") {
                    currentFen = message.d.fen;
                    
                    let isWhitesTurn = message.v % 2 === 0;
                    myColor = isWhitesTurn ? 'w' : 'b';
                    
                    if (isWhitesTurn) {
                        currentFen += " w";
                    } else {
                        currentFen += " b";
                    }
                    
                    moveCount = Math.floor(message.v / 2) + 1;
                    
                    if (message.d.wc !== undefined) {
                        timeRemaining = isWhitesTurn ? message.d.wc : message.d.bc;
                    }
                    
                    gamePhase = getGamePhase(moveCount, currentFen);
                    positionType = analyzePositionType(currentFen, lastMoves);
                    
                    calculateMove();
                }
            });
            
            return wrappedWebSocket;
        }
    });
    
    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - AlphaZero Style
// ═══════════════════════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book with variety
    if (gamePhase === "opening" || (gamePhase === "early-middlegame" && moveCount <= 15)) {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // Quick book move with slight delay for realism
            const thinkTime = Math.random() * 350 + 200;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // Engine calculation
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    // Clear previous analysis
    multiPVLines = [];
    
    // Send position to engine
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage("go depth " + depth);
    
    // The actual move will be sent by the engine message handler
}

/**
 * Send move to Lichess
 */
function sendMove(move) {
    if (!webSocketWrapper || !move) return;
    
    lastMoves.push(move);
    if (lastMoves.length > 20) lastMoves.shift();
    
    webSocketWrapper.send(JSON.stringify({
        t: "move",
        d: {
            u: move,
            b: 1,
            l: Math.floor(Math.random() * 25) + 15,
            a: 1
        }
    }));
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER
// ═══════════════════════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function(event) {
        const message = typeof event === 'string' ? event : (event.data || event);
        
        engineOutput += message + "\n";
        
        // Parse multi-PV information
        if (message.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(message);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        // Handle best move
        if (message && message.indexOf('bestmove') !== -1) {
            const moveParts = message.split(" ");
            bestMove = moveParts[1];
            
            let finalMove = bestMove;
            
            // Apply AlphaZero-style selection
            if (multiPVLines.length > 1) {
                finalMove = applyAlphaZeroStyle(bestMove, multiPVLines, positionType);
            }
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
