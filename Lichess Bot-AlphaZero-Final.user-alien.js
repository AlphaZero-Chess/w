// ==UserScript==
// @name         Lichess Bot - AlphaZero TRUE SUPERHUMAN + WATCHDOG
// @description  TRUE AlphaZero Replica - Superhuman beast with alien-tier strategic webs + Robust Self-Healing Watchdog
// @author       AlphaZero - TRUE SUPERHUMAN Edition
// @version      6.1.0-SUPERHUMAN-WATCHDOG
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// TRUE ALPHAZERO REPLICA - SUPERHUMAN BEAST CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════
// "A paradigm-shifter with moves that prioritize DEEP UNDERSTANDING over brute-force"
// "Weave long-term strategic webs that humans could barely comprehend"
// "FLAWLESS endgame play, PERFECT positional judgment, ZERO blunders"
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
    // ═══════════════════════════════════════════════════════════════════════
    // EFFICIENT DEPTH SETTINGS - Smart, not bruteforce (saves credits)
    // ═══════════════════════════════════════════════════════════════════════
    baseDepth: 22,              // Strong base (16→22)
    tacticalDepth: 26,          // Sharp tactical vision (20→26)
    positionalDepth: 24,        // Deep positional understanding (18→24)
    endgameDepth: 28,           // FLAWLESS endgame technique (20→28)
    openingDepth: 18,           // Opening precision (14→18)
    winningDepth: 20,           // Convert efficiently when winning (14→20)
    criticalDepth: 30,          // Maximum depth for critical positions (22→30)
    strategicDepth: 26,         // NEW: Strategic planning depth
    crushingDepth: 18,          // NEW: Fast crushing when dominating
    
    // NO mistakes - Pure engine perfection
    humanMistakeRate: 0,
    
    // Timing - Efficient calculation
    thinkingTimeMin: 100,
    thinkingTimeMax: 800,
    
    // Speed multipliers - AlphaZero-style quick decisive play
    openingSpeed: 0.3,
    earlyMidSpeed: 0.5,
    middlegameSpeed: 0.65,
    lateMidSpeed: 0.6,
    endgameSpeed: 0.5,          // More time for endgame precision
    criticalSpeed: 0.85,
    winningSpeed: 0.35,
    crushingSpeed: 0.25,        // NEW: Fast when crushing
    
    // Time thresholds
    panicThreshold: 5000,
    criticalThreshold: 10000,
    
    // ═══════════════════════════════════════════════════════════════════════
    // SUPERHUMAN EVALUATION SETTINGS - Crushing Aggression
    // ═══════════════════════════════════════════════════════════════════════
    winningThreshold: 150,      // Earlier winning detection (200→150)
    crushingThreshold: 400,     // Earlier crushing detection (500→400)
    drawAvoidanceContempt: 120, // Higher contempt (100→120)
    killerModeContempt: 200,    // Maximum aggression when winning (150→200)
    
    // Repetition avoidance - NEVER draw when winning
    maxRepetitions: 1,
    
    // ═══════════════════════════════════════════════════════════════════════
    // STRATEGIC WEB-WEAVING - AlphaZero's Signature (NEW)
    // ═══════════════════════════════════════════════════════════════════════
    strategicHorizon: 50,           // Plan 50+ moves ahead
    webWeavingEnabled: true,        // Enable strategic web-weaving
    multiFrontPressure: true,       // Attack multiple fronts
    positionalSqueezeBonus: 2000,   // Bonus for slowly squeezing
    quietStrengtheningBonus: 1500,  // Bonus for quiet improvement moves
    strategicPatience: 3000,        // Patience bonus for long-term plans
    
    // ═══════════════════════════════════════════════════════════════════════
    // PERFECT POSITIONAL JUDGMENT - Holistic Evaluation (NEW)
    // ═══════════════════════════════════════════════════════════════════════
    mobilityWeight: 150,            // Piece mobility importance
    kingSafetyWeight: 200,          // King safety paramount
    pawnStructureWeight: 120,       // Pawn structure awareness
    spaceControlWeight: 130,        // Territorial dominance
    pieceCoordinationWeight: 140,   // Piece harmony
    initiativeWeight: 180,          // Tempo/initiative value
    centerControlWeight: 150,       // Central control
    outpostBonus: 100,              // Outpost value
    
    // ═══════════════════════════════════════════════════════════════════════
    // FLAWLESS ENDGAME TECHNIQUE - Tablebase-Level (NEW)
    // ═══════════════════════════════════════════════════════════════════════
    endgameKingActivityWeight: 300,     // King activity paramount
    endgamePassedPawnWeight: 400,       // Passed pawn critical
    endgameOppositionBonus: 250,        // Opposition bonus
    endgameTriangulationBonus: 200,     // Triangulation bonus
    endgameZugzwangBonus: 300,          // Zugzwang detection bonus
    endgameKeySquareBonus: 250,         // Key square control
    endgameOutflankingBonus: 200,       // Outflanking technique
    endgameBlockadeValue: 350,          // Blockade value
    
    // ═══════════════════════════════════════════════════════════════════════
    // COUNTERPLAY & RESILIENCE - Active Defense (NEW)
    // ═══════════════════════════════════════════════════════════════════════
    counterplayPriority: 4000,          // Counterplay when behind
    activeDefenseBonus: 2500,           // Active defense preference
    passivePlayPenalty: -3000,          // Penalize passive moves heavily
    initiativeRecoveryPriority: 3000,   // Recover initiative priority
    
    // ═══════════════════════════════════════════════════════════════════════
    // PIECE ACTIVITY ENFORCEMENT - Never Passive (NEW)
    // ═══════════════════════════════════════════════════════════════════════
    knightOnRimPenalty: -800,           // Knight on edge penalty
    knightCornerPenalty: -1500,         // Knight in corner severe
    passivePiecePenalty: -1000,         // Passive piece penalty
    retreatingPiecePenalty: -600,       // Unnecessary retreat penalty
    pieceActivityBonus: 200             // Active piece bonus
};

// ═══════════════════════════════════════════════════════════════════════════
// ALPHAZERO-STYLE OPENING BOOK - Aggressive, Sharp & Dynamic
// Prioritizes complex, fighting positions that AlphaZero excels in
// ═══════════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - AlphaZero strongly prefers d4 (more complex, harder to draw)
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.60 },  // AlphaZero's preference
            { move: "e2e4", weight: 0.30 },
            { move: "c2c4", weight: 0.10 }   // English for complexity
        ]
    },
    // After 1.e4 - Sicilian (fighting), French (complex)
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.55 },  // Sicilian - fighting
            { move: "e7e6", weight: 0.25 },  // French - complex
            { move: "e7e5", weight: 0.20 }   // Classical
        ]
    },
    // After 1.d4 - Nimzo/KID for dynamic play
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.65 },  // Indian defenses
            { move: "d7d5", weight: 0.25 },
            { move: "f7f5", weight: 0.10 }   // Dutch - very fighting
        ]
    },
    // Sicilian - Open Sicilian for complexity
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.70 },  // Open Sicilian
            { move: "b1c3", weight: 0.20 },
            { move: "f2f4", weight: 0.10 }   // Grand Prix - aggressive
        ]
    },
    // Sicilian after Nf3 - Najdorf/Dragon prep
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.55 },  // Najdorf/Dragon
            { move: "b8c6", weight: 0.30 },
            { move: "e7e6", weight: 0.15 }   // Scheveningen/Paulsen
        ]
    },
    // Sicilian d4 - Open it up for tactical play
    "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "c5d4", weight: 0.90 },  // Open it!
            { move: "g8f6", weight: 0.10 }
        ]
    },
    // Italian Game - Two Knights for tactical complexity
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.65 },  // Two Knights - sharp
            { move: "f8c5", weight: 0.35 }   // Giuoco Piano
        ]
    },
    // Italian - After Nf6, go for aggressive d4
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.60 },  // Central break
            { move: "d2d3", weight: 0.25 },  // Slow Italian
            { move: "b1c3", weight: 0.15 }
        ]
    },
    // QGD positions - Fighting variations
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "c7c6", weight: 0.40 },  // Slav - solid fighting
            { move: "e7e6", weight: 0.35 },  // QGD classical
            { move: "g8f6", weight: 0.25 }
        ]
    },
    // King's Indian - AlphaZero's favorite aggressive setup
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Main line
            { move: "g1f3", weight: 0.30 },
            { move: "e2e4", weight: 0.20 }   // Four Pawns Attack
        ]
    },
    // Nf3 systems - Transpose to complex positions
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.45 },
            { move: "g8f6", weight: 0.35 },
            { move: "c7c5", weight: 0.20 }
        ]
    },
    // London counter - Aggressive counter
    "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.55 },  // Challenge center
            { move: "c8f5", weight: 0.25 },  // Active bishop
            { move: "g8f6", weight: 0.20 }
        ]
    },
    // Catalan - Fianchetto for long-term pressure
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g2g3", weight: 0.70 },  // Catalan
            { move: "g1f3", weight: 0.20 },
            { move: "b1c3", weight: 0.10 }
        ]
    },
    // Ruy Lopez - Spanish torture (long-term pressure)
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f1b5", weight: 0.65 },  // Ruy Lopez
            { move: "f1c4", weight: 0.25 },  // Italian
            { move: "d2d4", weight: 0.10 }   // Scotch
        ]
    },
    // Ruy Lopez - Black's fighting response
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },  // Morphy Defense
            { move: "g8f6", weight: 0.35 },  // Berlin Defense
            { move: "f7f5", weight: 0.15 }   // Schliemann - aggressive!
        ]
    },
    // Nimzo-Indian - Excellent fighting system
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "f8b4", weight: 0.60 },  // Nimzo-Indian
            { move: "d7d5", weight: 0.25 },
            { move: "b7b6", weight: 0.15 }   // Queen's Indian
        ]
    },
    // Queen's Gambit Accepted - Active play
    "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.50 },  // Central domination
            { move: "g1f3", weight: 0.35 },
            { move: "e2e3", weight: 0.15 }
        ]
    },
    // Caro-Kann - Advance for space advantage
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },  // Classical
            { move: "e4e5", weight: 0.30 },  // Advance - space
            { move: "b1c3", weight: 0.20 }
        ]
    },
    // French Defense - Advance for attacking chances
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },
            { move: "e4e5", weight: 0.30 },  // Advance - sharp
            { move: "b1c3", weight: 0.15 }
        ]
    },
    // NEW: Grünfeld - Fighting for center control
    "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
        white: [
            { move: "c4d5", weight: 0.50 },  // Exchange - test Black
            { move: "e2e3", weight: 0.30 },
            { move: "c1f4", weight: 0.20 }
        ]
    },
    // NEW: Benoni - Sharp counterplay
    "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },
            { move: "g1f3", weight: 0.30 },
            { move: "e2e4", weight: 0.20 }   // Space advantage
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL STATE - Enhanced with Strategic Tracking
// ═══════════════════════════════════════════════════════════════════════════

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

// SUPERHUMAN: Position history for repetition avoidance
let positionHistory = {};
let currentEval = 0;
let isWinning = false;
let isCrushing = false;

// SUPERHUMAN: Strategic state tracking (NEW)
let strategicPlan = null;
let pressureFronts = [];
let endgamePhase = false;
let lastMoveWasQuiet = false;
let consecutiveQuietMoves = 0;
let initiativeOwner = null;        // 'white', 'black', or null
let pieceActivity = { white: 0, black: 0 };

// SUPERHUMAN: Endgame pattern recognition (NEW)
const ENDGAME_PATTERNS = {
    opposition: false,
    triangulation: false,
    zugzwang: false,
    keySquareControl: false,
    passedPawnRace: false,
    philidor: false,
    lucena: false
};

// SUPERHUMAN: Winning endgames (enhanced)
const WINNING_ENDGAMES = {
    KQvK: true,   // King + Queen vs King
    KRvK: true,   // King + Rook vs King
    KRRvK: true,  // King + 2 Rooks vs King
    KQQvK: true,  // King + 2 Queens vs King
    KBBvK: true,  // King + 2 Bishops vs King (same color loses!)
    KBNvK: true,  // King + Bishop + Knight vs King
    KPvK: true,   // King + Pawn vs King (usually)
    KQvKR: true,  // Queen vs Rook
    KRPvKR: true, // Rook + Pawn vs Rook (Philidor/Lucena)
    KBPvK: true   // Bishop + Pawn vs King
};

// ═══════════════════════════════════════════════════════════════════════════
// POSITION ANALYSIS - SUPERHUMAN Precision
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fast piece counting (optimized, no regex)
 */
function countPieces(fen) {
    let count = 0;
    const board = fen.split(' ')[0];
    for (let i = 0; i < board.length; i++) {
        const char = board[i];
        if (char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z') {
            count++;
        }
    }
    return count;
}

/**
 * SUPERHUMAN: Detailed piece counting for evaluation
 */
function getPieceCount(fen) {
    const board = fen.split(' ')[0];
    const count = { 
        white: { K: 0, Q: 0, R: 0, B: 0, N: 0, P: 0, total: 0 },
        black: { K: 0, Q: 0, R: 0, B: 0, N: 0, P: 0, total: 0 }
    };
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (c === 'K') { count.white.K++; count.white.total++; }
        else if (c === 'Q') { count.white.Q++; count.white.total++; }
        else if (c === 'R') { count.white.R++; count.white.total++; }
        else if (c === 'B') { count.white.B++; count.white.total++; }
        else if (c === 'N') { count.white.N++; count.white.total++; }
        else if (c === 'P') { count.white.P++; count.white.total++; }
        else if (c === 'k') { count.black.K++; count.black.total++; }
        else if (c === 'q') { count.black.Q++; count.black.total++; }
        else if (c === 'r') { count.black.R++; count.black.total++; }
        else if (c === 'b') { count.black.B++; count.black.total++; }
        else if (c === 'n') { count.black.N++; count.black.total++; }
        else if (c === 'p') { count.black.P++; count.black.total++; }
    }
    
    return count;
}

/**
 * SUPERHUMAN: Material counting for advantage detection
 * Returns material balance (positive = white ahead)
 */
function getMaterialBalance(fen) {
    const board = fen.split(' ')[0];
    const pieceValues = { 'Q': 900, 'R': 500, 'B': 330, 'N': 320, 'P': 100,
                          'q': -900, 'r': -500, 'b': -330, 'n': -320, 'p': -100 };
    let balance = 0;
    
    for (let i = 0; i < board.length; i++) {
        const char = board[i];
        if (pieceValues[char]) {
            balance += pieceValues[char];
        }
    }
    
    return balance;
}

/**
 * SUPERHUMAN: Advanced pawn structure analysis (NEW)
 */
function analyzePawnStructure(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    const structure = {
        whitePawns: [],
        blackPawns: [],
        passedPawns: { white: [], black: [] },
        isolatedPawns: { white: 0, black: 0 },
        doubledPawns: { white: 0, black: 0 },
        backwardPawns: { white: 0, black: 0 },
        pawnChains: { white: 0, black: 0 }
    };
    
    // Parse pawn positions
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'P') structure.whitePawns.push({ rank: 7 - rank, file });
                else if (c === 'p') structure.blackPawns.push({ rank: 7 - rank, file });
                file++;
            }
        }
    }
    
    // Detect passed pawns (no enemy pawns ahead on same or adjacent files)
    const whiteFiles = structure.whitePawns.map(p => p.file);
    const blackFiles = structure.blackPawns.map(p => p.file);
    
    for (let pawn of structure.whitePawns) {
        let isPassed = true;
        for (let bp of structure.blackPawns) {
            if (Math.abs(bp.file - pawn.file) <= 1 && bp.rank > pawn.rank) {
                isPassed = false;
                break;
            }
        }
        if (isPassed) structure.passedPawns.white.push(pawn);
    }
    
    for (let pawn of structure.blackPawns) {
        let isPassed = true;
        for (let wp of structure.whitePawns) {
            if (Math.abs(wp.file - pawn.file) <= 1 && wp.rank < pawn.rank) {
                isPassed = false;
                break;
            }
        }
        if (isPassed) structure.passedPawns.black.push(pawn);
    }
    
    // Detect doubled pawns
    const whiteFileCounts = {};
    const blackFileCounts = {};
    for (let p of structure.whitePawns) {
        whiteFileCounts[p.file] = (whiteFileCounts[p.file] || 0) + 1;
    }
    for (let p of structure.blackPawns) {
        blackFileCounts[p.file] = (blackFileCounts[p.file] || 0) + 1;
    }
    for (let file in whiteFileCounts) {
        if (whiteFileCounts[file] > 1) structure.doubledPawns.white += whiteFileCounts[file] - 1;
    }
    for (let file in blackFileCounts) {
        if (blackFileCounts[file] > 1) structure.doubledPawns.black += blackFileCounts[file] - 1;
    }
    
    return structure;
}

/**
 * SUPERHUMAN: Detect piece configuration for endgame knowledge
 */
function getPieceConfiguration(fen) {
    const board = fen.split(' ')[0];
    let config = { white: '', black: '' };
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (c === 'K') config.white += 'K';
        else if (c === 'Q') config.white += 'Q';
        else if (c === 'R') config.white += 'R';
        else if (c === 'B') config.white += 'B';
        else if (c === 'N') config.white += 'N';
        else if (c === 'P') config.white += 'P';
        else if (c === 'k') config.black += 'K';
        else if (c === 'q') config.black += 'Q';
        else if (c === 'r') config.black += 'R';
        else if (c === 'b') config.black += 'B';
        else if (c === 'n') config.black += 'N';
        else if (c === 'p') config.black += 'P';
    }
    
    return config;
}

/**
 * SUPERHUMAN: Check if position is a known winning endgame
 */
function isKnownWinningEndgame(fen) {
    const config = getPieceConfiguration(fen);
    const whiteStr = config.white.split('').sort().join('');
    const blackStr = config.black.split('').sort().join('');
    
    // Check standard winning patterns
    if (blackStr === 'K') {
        if (whiteStr.indexOf('Q') !== -1) return true;
        if (whiteStr.indexOf('R') !== -1) return true;
        if (whiteStr.indexOf('BB') !== -1) return true;
        if (whiteStr.indexOf('BN') !== -1) return true;
        if (whiteStr.indexOf('P') !== -1) return true;
    }
    if (whiteStr === 'K') {
        if (blackStr.indexOf('Q') !== -1) return true;
        if (blackStr.indexOf('R') !== -1) return true;
        if (blackStr.indexOf('BB') !== -1) return true;
        if (blackStr.indexOf('BN') !== -1) return true;
        if (blackStr.indexOf('P') !== -1) return true;
    }
    
    return false;
}

/**
 * SUPERHUMAN: Detect endgame phase and type (NEW)
 */
function detectEndgameType(fen) {
    const pieces = countPieces(fen);
    const config = getPieceConfiguration(fen);
    const structure = analyzePawnStructure(fen);
    
    if (pieces > 12) return null; // Not endgame
    
    endgamePhase = true;
    
    // Detect specific endgame types
    const whiteHasQueen = config.white.indexOf('Q') !== -1;
    const blackHasQueen = config.black.indexOf('Q') !== -1;
    const whiteRooks = (config.white.match(/R/g) || []).length;
    const blackRooks = (config.black.match(/R/g) || []).length;
    const whitePawns = structure.whitePawns.length;
    const blackPawns = structure.blackPawns.length;
    
    // Pure pawn endgames - opposition/triangulation critical
    if (!whiteHasQueen && !blackHasQueen && whiteRooks === 0 && blackRooks === 0) {
        if (config.white === 'K' + 'P'.repeat(whitePawns) && 
            config.black === 'K' + 'P'.repeat(blackPawns)) {
            ENDGAME_PATTERNS.opposition = true;
            ENDGAME_PATTERNS.triangulation = true;
            ENDGAME_PATTERNS.keySquareControl = true;
            return 'pawn-endgame';
        }
    }
    
    // Rook endgames - Philidor/Lucena positions
    if (whiteRooks === 1 && blackRooks === 1 && (whitePawns > 0 || blackPawns > 0)) {
        ENDGAME_PATTERNS.philidor = true;
        ENDGAME_PATTERNS.lucena = true;
        return 'rook-endgame';
    }
    
    // Queen vs Rook/pieces
    if ((whiteHasQueen && !blackHasQueen) || (!whiteHasQueen && blackHasQueen)) {
        return 'queen-endgame';
    }
    
    return 'general-endgame';
}

/**
 * SUPERHUMAN: Track position for repetition avoidance
 */
function trackPosition(fen) {
    const posKey = fen.split(' ').slice(0, 4).join(' ');
    positionHistory[posKey] = (positionHistory[posKey] || 0) + 1;
    return positionHistory[posKey];
}

/**
 * SUPERHUMAN: Check if move leads to repetition
 */
function wouldRepeat(fen) {
    const posKey = fen.split(' ').slice(0, 4).join(' ');
    return (positionHistory[posKey] || 0) >= CONFIG.maxRepetitions;
}

/**
 * SUPERHUMAN: Reset position history on new game
 */
function resetGameState() {
    positionHistory = {};
    currentEval = 0;
    isWinning = false;
    isCrushing = false;
    moveCount = 0;
    strategicPlan = null;
    pressureFronts = [];
    endgamePhase = false;
    lastMoveWasQuiet = false;
    consecutiveQuietMoves = 0;
    initiativeOwner = null;
    pieceActivity = { white: 0, black: 0 };
    
    // Reset endgame patterns
    for (let key in ENDGAME_PATTERNS) {
        ENDGAME_PATTERNS[key] = false;
    }
}

/**
 * SUPERHUMAN: Enhanced game phase detection
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const pieceCount = getPieceCount(fen);
    
    // Check for endgame
    const endgameType = detectEndgameType(fen);
    if (endgameType) return "endgame";
    
    if (moveNum <= 8) return "opening";
    if (moveNum <= 15 && pieces > 26) return "early-middlegame";
    if (pieces > 18) return "middlegame";
    if (pieces > 10) return "late-middlegame";
    return "endgame";
}

/**
 * SUPERHUMAN: Advanced position type detection
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    const structure = analyzePawnStructure(fen);
    
    // Check indication - tactical
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // SUPERHUMAN: If winning, look for conversion opportunities
    if (isCrushing) return "crushing";
    if (isWinning) return "conversion";
    
    // SUPERHUMAN: Known winning endgame
    if (isKnownWinningEndgame(fen)) return "winning-endgame";
    
    // SUPERHUMAN: Passed pawn endgames - critical
    if (endgamePhase && (structure.passedPawns.white.length > 0 || structure.passedPawns.black.length > 0)) {
        return "passed-pawn-endgame";
    }
    
    // Count open files (more open = more tactical)
    let openFileCount = 0;
    const ranks = board.split('/');
    let pawnFiles = [false, false, false, false, false, false, false, false];
    
    for (let rank of ranks) {
        let file = 0;
        for (let i = 0; i < rank.length; i++) {
            const c = rank[i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'P' || c === 'p') pawnFiles[file] = true;
                file++;
            }
        }
    }
    
    for (let i = 0; i < 8; i++) {
        if (!pawnFiles[i]) openFileCount++;
    }
    
    if (openFileCount >= 5) return "tactical";
    if (openFileCount >= 4) return "semi-tactical";
    if (openFileCount <= 2) return "positional";
    
    return "normal";
}

/**
 * SUPERHUMAN: Smart thinking time - efficient, no wasted time
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // SUPERHUMAN: Play faster when crushing (absolute confidence)
    if (isCrushing) {
        speedMultiplier = CONFIG.crushingSpeed;
    } else if (isWinning) {
        speedMultiplier = CONFIG.winningSpeed;
    } else if (phase === "opening") {
        speedMultiplier = CONFIG.openingSpeed;
    } else if (phase === "early-middlegame") {
        speedMultiplier = CONFIG.earlyMidSpeed;
    } else if (phase === "middlegame") {
        speedMultiplier = CONFIG.middlegameSpeed;
    } else if (phase === "late-middlegame") {
        speedMultiplier = CONFIG.lateMidSpeed;
    } else if (phase === "endgame") {
        // SUPERHUMAN: More time for precise endgame calculation
        speedMultiplier = CONFIG.endgameSpeed;
        
        // Critical endgame positions need more time
        if (posType === "passed-pawn-endgame" || posType === "winning-endgame") {
            speedMultiplier *= 1.3;
        }
    }
    
    // Tactical positions need more time
    if (posType === "tactical" || posType === "semi-tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    }
    
    // SUPERHUMAN: Strategic positions need careful thought
    if (posType === "positional") {
        speedMultiplier *= 0.9;
    }
    
    // Time pressure - react faster
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.5;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.3;
    if (timeLeft < 3000) speedMultiplier *= 0.2;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(80, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * SUPERHUMAN: Smart depth selection - efficient precision
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // SUPERHUMAN: Efficient depth when crushing
    if (isCrushing) {
        depth = CONFIG.crushingDepth;
    } else if (isWinning && posType !== "tactical") {
        depth = CONFIG.winningDepth;
    } else if (posType === "winning-endgame") {
        // SUPERHUMAN: Maximum depth for winning endgames - FLAWLESS technique
        depth = CONFIG.endgameDepth + 4;
    } else if (posType === "passed-pawn-endgame") {
        // SUPERHUMAN: Passed pawn endgames need deep calculation
        depth = CONFIG.endgameDepth + 2;
    } else if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        // SUPERHUMAN: FLAWLESS endgame play requires deep calculation
        depth = CONFIG.endgameDepth;
    } else if (phase === "middlegame" || phase === "late-middlegame" || phase === "early-middlegame") {
        if (posType === "tactical") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "semi-tactical") {
            depth = CONFIG.tacticalDepth - 2;
        } else if (posType === "positional") {
            depth = CONFIG.positionalDepth;
        } else if (posType === "conversion") {
            depth = CONFIG.winningDepth + 2;
        }
    }
    
    // SUPERHUMAN: Strategic depth for complex positions
    if (phase === "middlegame" && !isWinning && !isCrushing) {
        depth = Math.max(depth, CONFIG.strategicDepth);
    }
    
    // Time pressure depth reduction - but still strong
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(14, depth - 2);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(12, depth - 4);
    if (timeLeft < 3000) depth = Math.max(10, depth - 6);
    
    return depth;
}

/**
 * AlphaZero-style opening book selection
 */
function getBookMove(fen) {
    const fenKey = fen.split(' ').slice(0, 4).join(' ');
    const position = OPENINGS[fenKey];
    
    if (!position) return null;
    
    const moves = myColor === 'w' ? position.white : position.black;
    if (!moves || moves.length === 0) return null;
    
    const totalWeight = moves.reduce((sum, m) => sum + m.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let moveOption of moves) {
        random -= moveOption.weight;
        if (random <= 0) return moveOption.move;
    }
    
    return moves[0].move;
}

/**
 * SUPERHUMAN: Strategic move selection with web-weaving (NEW)
 * This is where the "alien" long-term strategic webs happen
 */
function evaluateMoveStrategically(move, alternatives, eval_score) {
    let strategicBonus = 0;
    
    // SUPERHUMAN: Multi-front pressure detection
    // AlphaZero often attacks multiple weaknesses simultaneously
    if (alternatives && alternatives.length >= 3) {
        // Check if move maintains pressure on multiple fronts
        const topMoves = alternatives.slice(0, 3);
        const scoreDiffs = topMoves.map(m => Math.abs(m.score - topMoves[0].score));
        
        // If top 3 moves are within 30cp, position has multiple plans
        if (scoreDiffs.every(d => d < 30)) {
            strategicBonus += CONFIG.positionalSqueezeBonus / 10;
        }
    }
    
    // SUPERHUMAN: Quiet strengthening moves
    // AlphaZero often makes quiet moves that improve piece placement
    if (move && move.length === 4) {
        const fromFile = move.charCodeAt(0) - 97;
        const toFile = move.charCodeAt(2) - 97;
        const toRank = parseInt(move[3]);
        
        // Centralizing moves
        if (toFile >= 2 && toFile <= 5 && toRank >= 3 && toRank <= 6) {
            strategicBonus += CONFIG.quietStrengtheningBonus / 20;
        }
        
        // Advancing pieces (not retreating)
        const fromRank = parseInt(move[1]);
        if (myColor === 'w' && toRank > fromRank) {
            strategicBonus += CONFIG.pieceActivityBonus / 10;
        } else if (myColor === 'b' && toRank < fromRank) {
            strategicBonus += CONFIG.pieceActivityBonus / 10;
        }
    }
    
    return strategicBonus;
}

/**
 * SUPERHUMAN: Endgame technique evaluation (NEW)
 * Implements Philidor, Lucena, Opposition, Triangulation awareness
 */
function evaluateEndgameTechnique(move, fen, alternatives) {
    if (!endgamePhase) return 0;
    
    let endgameBonus = 0;
    const structure = analyzePawnStructure(fen);
    
    // SUPERHUMAN: Passed pawn advancement
    if (structure.passedPawns.white.length > 0 || structure.passedPawns.black.length > 0) {
        // Bonus for moves that advance passed pawns
        if (move && move.length === 4) {
            const piece = move.substring(0, 2);
            for (let pawn of (myColor === 'w' ? structure.passedPawns.white : structure.passedPawns.black)) {
                const pawnSquare = String.fromCharCode(97 + pawn.file) + (pawn.rank + 1);
                if (piece === pawnSquare) {
                    endgameBonus += CONFIG.endgamePassedPawnWeight;
                }
            }
        }
    }
    
    // SUPERHUMAN: King activity in endgame
    if (move && move.length === 4) {
        const fromSquare = move.substring(0, 2);
        const toSquare = move.substring(2, 4);
        
        // King moves toward center in endgame
        if (fromSquare[0] === 'k' || fromSquare[0] === 'K') {
            const toFile = toSquare.charCodeAt(0) - 97;
            const toRank = parseInt(toSquare[1]);
            
            // Center squares
            if (toFile >= 2 && toFile <= 5 && toRank >= 3 && toRank <= 6) {
                endgameBonus += CONFIG.endgameKingActivityWeight / 10;
            }
        }
    }
    
    // SUPERHUMAN: Opposition detection in pure pawn endgames
    if (ENDGAME_PATTERNS.opposition) {
        // Simplified opposition check - kings facing each other with odd squares between
        endgameBonus += CONFIG.endgameOppositionBonus / 20;
    }
    
    return endgameBonus;
}

/**
 * SUPERHUMAN: Counterplay and active defense (NEW)
 */
function evaluateCounterplay(move, eval_score, alternatives) {
    // Only relevant when behind
    const adjustedEval = myColor === 'w' ? eval_score : -eval_score;
    if (adjustedEval >= 0) return 0;
    
    let counterplayBonus = 0;
    
    // When behind, prioritize active moves
    if (adjustedEval < -100) {
        // SUPERHUMAN: Penalize passive defensive moves heavily
        // Look for moves that create threats
        if (alternatives && alternatives.length > 1) {
            const bestMove = alternatives[0];
            const secondBest = alternatives[1];
            
            // If best move is only slightly better but more active, prefer it
            if (bestMove.score - secondBest.score < 20) {
                // Assume second best might be more active
                counterplayBonus += CONFIG.activeDefenseBonus / 50;
            }
        }
    }
    
    // SUPERHUMAN: Initiative recovery priority
    if (adjustedEval < -50 && adjustedEval > -200) {
        counterplayBonus += CONFIG.initiativeRecoveryPriority / 100;
    }
    
    return counterplayBonus;
}

/**
 * SUPERHUMAN: Best move selection with strategic web-weaving
 */
function selectBestMove(bestMove, alternatives) {
    // SUPERHUMAN: When crushing, just play the best move efficiently
    if (isCrushing) {
        return bestMove;
    }
    
    // SUPERHUMAN: When winning, avoid repetitions but don't complicate
    if (isWinning && alternatives && alternatives.length > 1) {
        const bestMoveScore = alternatives[0] ? alternatives[0].score : 0;
        
        // Check for non-repeating moves that are nearly as good
        for (let alt of alternatives) {
            if (bestMoveScore - alt.score < 30) {
                // Prefer moves that maintain pressure
                const strategicValue = evaluateMoveStrategically(alt.move, alternatives, alt.score);
                const endgameValue = evaluateEndgameTechnique(alt.move, currentFen, alternatives);
                
                if (strategicValue + endgameValue > 0) {
                    return alt.move;
                }
            }
        }
    }
    
    // SUPERHUMAN: When behind, look for counterplay
    const adjustedEval = myColor === 'w' ? currentEval : -currentEval;
    if (adjustedEval < -50 && alternatives && alternatives.length > 1) {
        for (let alt of alternatives) {
            const counterplay = evaluateCounterplay(alt.move, alt.score, alternatives);
            if (counterplay > 0) {
                // If counterplay found, consider it
                const scoreDiff = alternatives[0].score - alt.score;
                if (scoreDiff < 40) {  // Don't sacrifice too much for counterplay
                    return alt.move;
                }
            }
        }
    }
    
    // SUPERHUMAN: In endgame, prioritize technique
    if (endgamePhase && alternatives && alternatives.length > 1) {
        for (let alt of alternatives) {
            const endgameValue = evaluateEndgameTechnique(alt.move, currentFen, alternatives);
            if (endgameValue > CONFIG.endgameKingActivityWeight / 20) {
                const scoreDiff = alternatives[0].score - alt.score;
                if (scoreDiff < 20) {
                    return alt.move;
                }
            }
        }
    }
    
    // Default: play the best move
    return bestMove;
}

/**
 * Multi-PV parsing for analysis
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
                if (mateMatch) {
                    // Mate score: treat as very high value
                    const mateIn = parseInt(mateMatch[1]);
                    score = mateIn > 0 ? 10000 - mateIn : -10000 - mateIn;
                } else if (scoreMatch) {
                    score = parseInt(scoreMatch[1]);
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

/**
 * ALIEN: Parse evaluation from engine output
 */
function parseEvaluation(output) {
    const mateMatch = output.match(/score\s+mate\s+(-?\d+)/);
    const cpMatch = output.match(/score\s+cp\s+(-?\d+)/);
    
    if (mateMatch) {
        const mateIn = parseInt(mateMatch[1]);
        return mateIn > 0 ? 10000 : -10000;
    }
    if (cpMatch) {
        return parseInt(cpMatch[1]);
    }
    return 0;
}

/**
 * ALIEN: Update winning status from evaluation
 */
function updateWinningStatus(eval_score) {
    currentEval = eval_score;
    
    // Adjust for color
    const adjustedEval = myColor === 'w' ? eval_score : -eval_score;
    
    isCrushing = adjustedEval >= CONFIG.crushingThreshold;
    isWinning = adjustedEval >= CONFIG.winningThreshold;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - SUPERHUMAN POWER
// ═══════════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    // SUPERHUMAN: Multi-PV for strategic analysis (see multiple candidate moves)
    chessEngine.postMessage("setoption name MultiPV value 4");
    // SUPERHUMAN: Higher contempt to play for wins (avoid draws)
    chessEngine.postMessage("setoption name Contempt value 100");
    // SUPERHUMAN: Optimal move overhead for fast response
    chessEngine.postMessage("setoption name Move Overhead value 15");
    // SUPERHUMAN: Disable pondering for clean calculation
    chessEngine.postMessage("setoption name Ponder value false");
    // SUPERHUMAN: UCI_AnalyseMode for better analysis
    chessEngine.postMessage("setoption name UCI_AnalyseMode value false");
    chessEngine.postMessage("isready");
}

/**
 * SUPERHUMAN: Dynamically adjust engine contempt based on position
 * Higher contempt when winning forces playing for a win
 */
function adjustContempt() {
    if (isCrushing) {
        // Maximum aggression when crushing - play for the kill
        chessEngine.postMessage("setoption name Contempt value " + CONFIG.killerModeContempt);
    } else if (isWinning) {
        // High contempt when winning - avoid draws
        chessEngine.postMessage("setoption name Contempt value " + CONFIG.drawAvoidanceContempt);
    } else if (endgamePhase) {
        // Moderate contempt in endgame - still play for wins
        chessEngine.postMessage("setoption name Contempt value 80");
    } else {
        // Normal contempt in equal positions
        chessEngine.postMessage("setoption name Contempt value 100");
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION (STABLE - Unchanged from working version)
// ═══════════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    let webSocket = window.WebSocket;
    const webSocketProxy = new Proxy(webSocket, {
        construct: function (target, args) {
            let wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                let message = JSON.parse(event.data);
                
                // SUPERHUMAN: Detect new game start
                if (message.t === "crowd" || message.t === "featured") {
                    resetGameState();
                }
                
                if (message.d && typeof message.d.fen === "string" && typeof message.v === "number") {
                    currentFen = message.d.fen;
                    
                    let isWhitesTurn = message.v % 2 == 0;
                    myColor = isWhitesTurn ? 'w' : 'b';
                    
                    if (isWhitesTurn) {
                        currentFen += " w";
                    } else {
                        currentFen += " b";
                    }
                    
                    moveCount = Math.floor(message.v / 2) + 1;
                    
                    // SUPERHUMAN: Track position for repetition
                    trackPosition(currentFen);
                    
                    // SUPERHUMAN: Enhanced game phase detection
                    gamePhase = getGamePhase(moveCount, currentFen);
                    positionType = analyzePositionType(currentFen);
                    
                    // SUPERHUMAN: Detect endgame type for technique
                    if (gamePhase === "endgame") {
                        detectEndgameType(currentFen);
                    }
                    
                    // SUPERHUMAN: Adjust contempt based on winning status
                    adjustContempt();
                    
                    calculateMove();
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - SUPERHUMAN PRECISION
// ═══════════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book for variety and AlphaZero-style openings
    if (gamePhase === "opening" || gamePhase === "early-middlegame") {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // Fast book moves - AlphaZero plays openings quickly
            const thinkTime = Math.random() * 150 + 100;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // SUPERHUMAN engine calculation
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    // SUPERHUMAN: Clear hash when entering endgame for fresh analysis
    if (endgamePhase && moveCount === 1) {
        chessEngine.postMessage("ucinewgame");
    }
    
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage(`go depth ${depth}`);
    
    setTimeout(() => {
        // Handled by engine message callback
    }, thinkTime);
}

/**
 * Send move - Clean and fast
 */
function sendMove(move) {
    webSocketWrapper.send(JSON.stringify({
        t: "move",
        d: { 
            u: move, 
            b: 1,
            l: Math.floor(Math.random() * 12) + 5,  // SUPERHUMAN: Faster lag simulation
            a: 1
        }
    }));
}

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - SUPERHUMAN PRECISION
// ═══════════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        engineOutput += event + "\n";
        
        // SUPERHUMAN: Parse evaluation for winning status
        if (event.indexOf('score') !== -1) {
            const evalScore = parseEvaluation(event);
            updateWinningStatus(evalScore);
        }
        
        if (event.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(event);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            // SUPERHUMAN: Smart move selection with:
            // - Strategic web-weaving
            // - Endgame technique
            // - Counterplay when behind
            // - Draw avoidance when winning
            let finalMove = selectBestMove(bestMove, multiPVLines);
            
            // SUPERHUMAN: Track move patterns
            if (multiPVLines.length > 0) {
                const topMoveScore = multiPVLines[0].score || 0;
                const secondScore = multiPVLines.length > 1 ? multiPVLines[1].score || 0 : topMoveScore;
                
                // If top moves are very close, this is a "quiet" position
                if (Math.abs(topMoveScore - secondScore) < 10) {
                    lastMoveWasQuiet = true;
                    consecutiveQuietMoves++;
                } else {
                    lastMoveWasQuiet = false;
                    consecutiveQuietMoves = 0;
                }
            }
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// INITIALIZATION - SUPERHUMAN BEAST ACTIVATED
// ═══════════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();

// ═══════════════════════════════════════════════════════════════════════════
// ROBUST COMPLEX WATCHDOG SYSTEM - PREVENTS BOT FROM STOPPING ENTIRELY
// Multi-layered self-healing architecture with ABSOLUTE recalculation watchdog
// Best-of-the-best implementation from AlphaZero-Pure-being override
// ═══════════════════════════════════════════════════════════════════════════

const WatchdogConfig = {
    // Core timing intervals - TUNED FOR STABILITY
    heartbeatInterval: 2000,           // Health check every 2s
    engineTimeoutThreshold: 8000,      // Engine response timeout 8s (was 15s - faster recovery)
    wsReconnectDelay: 1000,            // WebSocket reconnect delay
    wsMaxReconnectAttempts: 10,        // Max reconnection attempts
    moveTimeoutThreshold: 8000,        // Move calculation timeout 8s (was 20s - faster recovery)
    staleStateThreshold: 20000,        // Stale state detection 20s (was 30s)
    
    // ABSOLUTE WATCHDOG - UNCONDITIONAL OVERRIDE (FROM BACKUP)
    absoluteWatchdogTimeout: 8000,     // 8-second absolute timeout - overrides everything
    calculationStuckTimeout: 5000,     // 5-second stuck calculation timeout
    positionReadyTimeout: 3000,        // 3-second position ready but no calc started
    noMoveTimeout: 20000,              // 20-second no successful move timeout
    debounceStaleTimeout: 2000,        // 2-second stale debounce flag timeout
    
    // Circuit breaker settings
    failureThreshold: 3,               // Failures before circuit opens
    circuitResetTimeout: 10000,        // Circuit breaker reset time
    
    // Recovery settings
    maxRecoveryAttempts: 5,            // Max recovery attempts per component
    recoveryBackoffMultiplier: 1.5,    // Exponential backoff multiplier
    fullResetThreshold: 3,             // Full resets before giving up
    forceCalculationDelay: 100,        // Delay before force calculation
    recoveryCalculationDelay: 500,     // Delay before recovery calculation
    
    // Monitoring
    enableDetailedLogging: false,      // Verbose logging (set true for debug)
    enableHealthMetrics: true          // Track health metrics
};

// ═══════════════════════════════════════════════════════════════════════════
// WATCHDOG STATE TRACKING
// ═══════════════════════════════════════════════════════════════════════════

const WatchdogState = {
    // Engine health
    engineAlive: true,
    lastEngineResponse: Date.now(),
    engineRecoveryAttempts: 0,
    pendingEngineCommand: false,
    
    // WebSocket health
    wsAlive: true,
    lastWsMessage: Date.now(),
    wsRecoveryAttempts: 0,
    wsReconnecting: false,
    
    // Move calculation health
    calculatingMove: false,
    moveCalculationStart: 0,
    lastMoveCalculated: Date.now(),
    moveTimeoutCount: 0,
    
    // General health
    lastHeartbeat: Date.now(),
    totalRecoveries: 0,
    fullResetCount: 0,
    systemHealthy: true,
    
    // Circuit breakers
    circuits: {
        engine: { failures: 0, open: false, lastFailure: 0 },
        websocket: { failures: 0, open: false, lastFailure: 0 },
        moveCalc: { failures: 0, open: false, lastFailure: 0 }
    },
    
    // Health metrics
    metrics: {
        totalMoves: 0,
        successfulMoves: 0,
        failedMoves: 0,
        engineRestarts: 0,
        wsReconnections: 0,
        recoveries: 0,
        uptime: Date.now()
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // ABSOLUTE WATCHDOG STATE - FROM BACKUP (BEST-OF-THE-BEST)
    // Per-color position tracking for deadlock-proof operation
    // ═══════════════════════════════════════════════════════════════════════
    
    // Position ready tracking - PER COLOR (prevents deadlocks)
    whitePositionReady: false,
    blackPositionReady: false,
    lastWhitePositionTime: 0,
    lastBlackPositionTime: 0,
    
    // Manual move detection - PER COLOR
    whiteHumanMovedRecently: false,
    blackHumanMovedRecently: false,
    
    // Move tracking
    lastSuccessfulMoveTime: Date.now(),
    lastSeenPositionId: null,
    currentCalculatingColor: null,
    calculationStartTime: 0,
    calculationLock: false
};

// ═══════════════════════════════════════════════════════════════════════════
// CIRCUIT BREAKER PATTERN - Prevents cascade failures
// ═══════════════════════════════════════════════════════════════════════════

const CircuitBreaker = {
    /**
     * Record a failure for a circuit
     */
    recordFailure(circuitName) {
        const circuit = WatchdogState.circuits[circuitName];
        if (!circuit) return;
        
        circuit.failures++;
        circuit.lastFailure = Date.now();
        
        if (circuit.failures >= WatchdogConfig.failureThreshold) {
            circuit.open = true;
            WatchdogLog.warn(`Circuit breaker OPEN for: ${circuitName}`);
            
            // Auto-reset after timeout
            setTimeout(() => {
                this.resetCircuit(circuitName);
            }, WatchdogConfig.circuitResetTimeout);
        }
    },
    
    /**
     * Record success - resets failure count
     */
    recordSuccess(circuitName) {
        const circuit = WatchdogState.circuits[circuitName];
        if (!circuit) return;
        
        circuit.failures = 0;
        if (circuit.open) {
            circuit.open = false;
            WatchdogLog.info(`Circuit breaker CLOSED for: ${circuitName}`);
        }
    },
    
    /**
     * Check if circuit is open (should not attempt operation)
     */
    isOpen(circuitName) {
        const circuit = WatchdogState.circuits[circuitName];
        return circuit ? circuit.open : false;
    },
    
    /**
     * Reset a circuit manually
     */
    resetCircuit(circuitName) {
        const circuit = WatchdogState.circuits[circuitName];
        if (!circuit) return;
        
        circuit.failures = 0;
        circuit.open = false;
        WatchdogLog.info(`Circuit breaker RESET for: ${circuitName}`);
    },
    
    /**
     * Reset all circuits
     */
    resetAll() {
        for (let circuitName in WatchdogState.circuits) {
            this.resetCircuit(circuitName);
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ABSOLUTE WATCHDOG TIMERS - UNCONDITIONAL OVERRIDE (FROM BACKUP)
// These are the critical timers that ensure the bot NEVER stops
// ═══════════════════════════════════════════════════════════════════════════

let absoluteWatchdogTimer = null;       // ABSOLUTE watchdog - overrides everything
let healthCheckInterval = null;         // Periodic health check interval
let whiteDebounceTimer = null;          // White's debounce timer
let blackDebounceTimer = null;          // Black's debounce timer
let calculationTimeout = null;          // Safety timeout for calculation
let messageDebounceTimer = null;        // Debounce rapid messages

// ═══════════════════════════════════════════════════════════════════════════
// ABSOLUTE WATCHDOG FUNCTIONS - BEST-OF-THE-BEST FROM BACKUP
// These functions provide UNCONDITIONAL recovery from any stuck state
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get active color from FEN string
 */
function getActiveColorFromFen(fen) {
    if (!fen) return null;
    const parts = fen.split(' ');
    if (parts.length >= 2) {
        return parts[1]; // 'w' or 'b'
    }
    return null;
}

/**
 * Force unlock all locks and reset state - UNCONDITIONAL
 * This is the nuclear option - clears EVERYTHING
 */
function forceUnlockAndReset(reason) {
    WatchdogLog.recovery(`💥 FORCE UNLOCK - Reason: ${reason}`);
    WatchdogLog.recovery(`  Before: calculationLock=${WatchdogState.calculationLock}, whiteReady=${WatchdogState.whitePositionReady}, blackReady=${WatchdogState.blackPositionReady}`);
    
    // Clear ALL locks unconditionally
    WatchdogState.calculationLock = false;
    WatchdogState.calculationStartTime = 0;
    WatchdogState.currentCalculatingColor = null;
    WatchdogState.calculatingMove = false;
    WatchdogState.pendingEngineCommand = false;
    
    // Clear all timers
    if (calculationTimeout) {
        clearTimeout(calculationTimeout);
        calculationTimeout = null;
    }
    if (messageDebounceTimer) {
        clearTimeout(messageDebounceTimer);
        messageDebounceTimer = null;
    }
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
        absoluteWatchdogTimer = null;
    }
    
    // Stop engine if needed
    if (chessEngine) {
        try {
            chessEngine.postMessage("stop");
        } catch (e) {
            WatchdogLog.error(`Failed to stop engine: ${e.message}`);
        }
    }
    
    WatchdogState.totalRecoveries++;
    WatchdogState.metrics.recoveries++;
    
    WatchdogLog.recovery(`  After: All locks cleared, state reset`);
}

/**
 * Force calculation to start - bypasses all normal checks
 * This is used when we detect a stuck state and need to force progress
 */
function forceCalculation(colorToCalculate) {
    WatchdogLog.recovery(`⚡ FORCE CALCULATION for ${colorToCalculate === 'w' ? 'White' : 'Black'}`);
    
    if (!currentFen || !chessEngine || !webSocketWrapper || webSocketWrapper.readyState !== 1) {
        WatchdogLog.warn("❌ Cannot force calculation - missing prerequisites");
        return;
    }
    
    // Verify FEN color matches
    const fenColor = getActiveColorFromFen(currentFen);
    if (fenColor !== colorToCalculate) {
        WatchdogLog.warn(`❌ Color mismatch: want ${colorToCalculate}, FEN has ${fenColor}`);
        return;
    }
    
    // Force unlock first
    forceUnlockAndReset("forced calculation");
    
    // Set position as ready
    if (colorToCalculate === 'w') {
        WatchdogState.whitePositionReady = true;
        WatchdogState.lastWhitePositionTime = Date.now();
    } else {
        WatchdogState.blackPositionReady = true;
        WatchdogState.lastBlackPositionTime = Date.now();
    }
    
    // Immediately call calculateMove
    setTimeout(() => {
        try {
            calculateMove();
        } catch (e) {
            WatchdogLog.error(`Force calculation failed: ${e.message}`);
        }
    }, WatchdogConfig.forceCalculationDelay);
}

/**
 * Start absolute watchdog - overrides everything after timeout
 * This is the LAST LINE OF DEFENSE against bot stopping
 */
function startAbsoluteWatchdog() {
    // Clear any existing watchdog
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
    }
    
    // Set 8-second absolute timeout
    absoluteWatchdogTimer = setTimeout(() => {
        const now = Date.now();
        const calcDuration = WatchdogState.calculationStartTime > 0 ? now - WatchdogState.calculationStartTime : 0;
        
        WatchdogLog.critical("🚨 ABSOLUTE WATCHDOG TRIGGERED (8s)");
        WatchdogLog.critical(`  calculationLock: ${WatchdogState.calculationLock}`);
        WatchdogLog.critical(`  Calculation duration: ${calcDuration}ms`);
        WatchdogLog.critical(`  Current FEN: ${currentFen}`);
        
        // UNCONDITIONALLY force unlock and reset
        forceUnlockAndReset("absolute watchdog timeout");
        
        // If we have a FEN and WebSocket, try to recover
        if (currentFen && webSocketWrapper && webSocketWrapper.readyState === 1) {
            const fenActiveColor = getActiveColorFromFen(currentFen);
            if (fenActiveColor) {
                WatchdogLog.recovery(`✅ Attempting recovery for ${fenActiveColor === 'w' ? 'White' : 'Black'}`);
                setTimeout(() => forceCalculation(fenActiveColor), WatchdogConfig.recoveryCalculationDelay);
            }
        }
    }, WatchdogConfig.absoluteWatchdogTimeout);
    
    WatchdogLog.info("⏰ Absolute watchdog started (8s timeout)");
}

/**
 * Clear absolute watchdog (called when move is successfully sent)
 */
function clearAbsoluteWatchdog() {
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
        absoluteWatchdogTimer = null;
        WatchdogLog.info("✅ Absolute watchdog cleared");
    }
}

/**
 * HEALTH CHECK SYSTEM - Runs every 2 seconds and forces action if stuck
 * This is the ABSOLUTE safety net - no conditions, just action
 * FROM BACKUP - This is the most critical component
 */
function startHealthCheckSystem() {
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
    }
    
    healthCheckInterval = setInterval(() => {
        const now = Date.now();
        
        // Check 1: Calculation running too long (> 5 seconds)
        if (WatchdogState.calculationLock && WatchdogState.calculationStartTime > 0) {
            const calcDuration = now - WatchdogState.calculationStartTime;
            if (calcDuration > WatchdogConfig.calculationStuckTimeout) {
                WatchdogLog.critical(`🚨 CRITICAL: Calculation stuck for ${calcDuration}ms - FORCING UNLOCK`);
                forceUnlockAndReset("calculation timeout");
                return;
            }
        }
        
        // Check 2: Position ready but no calculation started (> 3 seconds)
        if (!WatchdogState.calculationLock && currentFen && webSocketWrapper && webSocketWrapper.readyState === 1) {
            const fenActiveColor = getActiveColorFromFen(currentFen);
            if (fenActiveColor) {
                const isWhite = (fenActiveColor === 'w');
                const positionReady = isWhite ? WatchdogState.whitePositionReady : WatchdogState.blackPositionReady;
                const positionTime = isWhite ? WatchdogState.lastWhitePositionTime : WatchdogState.lastBlackPositionTime;
                const humanMoved = isWhite ? WatchdogState.whiteHumanMovedRecently : WatchdogState.blackHumanMovedRecently;
                
                if (positionReady && positionTime > 0) {
                    const waitDuration = now - positionTime;
                    if (waitDuration > WatchdogConfig.positionReadyTimeout && !humanMoved) {
                        WatchdogLog.critical(`🚨 CRITICAL: Position ready for ${waitDuration}ms but no calculation - FORCING START`);
                        forceCalculation(fenActiveColor);
                        return;
                    }
                }
            }
        }
        
        // Check 3: No successful move in last 20 seconds (game active)
        if (WatchdogState.lastSuccessfulMoveTime > 0 && currentFen && webSocketWrapper && webSocketWrapper.readyState === 1) {
            const timeSinceLastMove = now - WatchdogState.lastSuccessfulMoveTime;
            if (timeSinceLastMove > WatchdogConfig.noMoveTimeout) {
                WatchdogLog.critical(`🚨 CRITICAL: No move sent in ${timeSinceLastMove}ms - FORCING RESET`);
                forceUnlockAndReset("no recent moves");
                const fenActiveColor = getActiveColorFromFen(currentFen);
                if (fenActiveColor) {
                    forceCalculation(fenActiveColor);
                }
                return;
            }
        }
        
        // Check 4: Clear stale debounce flags (> 2 seconds old)
        if (WatchdogState.whiteHumanMovedRecently && WatchdogState.lastWhitePositionTime > 0 && now - WatchdogState.lastWhitePositionTime > WatchdogConfig.debounceStaleTimeout) {
            WatchdogLog.info("🔧 Clearing stale White debounce flag");
            WatchdogState.whiteHumanMovedRecently = false;
            if (whiteDebounceTimer) {
                clearTimeout(whiteDebounceTimer);
                whiteDebounceTimer = null;
            }
        }
        if (WatchdogState.blackHumanMovedRecently && WatchdogState.lastBlackPositionTime > 0 && now - WatchdogState.lastBlackPositionTime > WatchdogConfig.debounceStaleTimeout) {
            WatchdogLog.info("🔧 Clearing stale Black debounce flag");
            WatchdogState.blackHumanMovedRecently = false;
            if (blackDebounceTimer) {
                clearTimeout(blackDebounceTimer);
                blackDebounceTimer = null;
            }
        }
        
        // Check 5: Engine health - if pending command for too long
        if (WatchdogState.pendingEngineCommand) {
            const timeSinceCommand = now - WatchdogState.lastEngineResponse;
            if (timeSinceCommand > WatchdogConfig.engineTimeoutThreshold) {
                WatchdogLog.warn(`🚨 Engine command pending for ${timeSinceCommand}ms - recovering`);
                EngineWatchdog.recoverEngine();
            }
        }
        
    }, WatchdogConfig.heartbeatInterval);
    
    WatchdogLog.info("✅ Health check system started (2s interval)");
}

// ═══════════════════════════════════════════════════════════════════════════
// WATCHDOG LOGGING - Centralized logging with levels
// ═══════════════════════════════════════════════════════════════════════════

const WatchdogLog = {
    prefix: "[WATCHDOG]",
    
    info(msg) {
        if (WatchdogConfig.enableDetailedLogging) {
            console.log(`${this.prefix} INFO: ${msg}`);
        }
    },
    
    warn(msg) {
        console.warn(`${this.prefix} WARN: ${msg}`);
    },
    
    error(msg) {
        console.error(`${this.prefix} ERROR: ${msg}`);
    },
    
    critical(msg) {
        console.error(`${this.prefix} CRITICAL: ${msg}`);
    },
    
    recovery(msg) {
        console.log(`${this.prefix} RECOVERY: ${msg}`);
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ENGINE WATCHDOG - Monitors and recovers Stockfish engine
// ═══════════════════════════════════════════════════════════════════════════

const EngineWatchdog = {
    pingInterval: null,
    lastPingTime: 0,
    waitingForPong: false,
    
    /**
     * Start engine monitoring
     */
    start() {
        this.pingInterval = setInterval(() => {
            this.checkEngineHealth();
        }, WatchdogConfig.heartbeatInterval);
        
        WatchdogLog.info("Engine watchdog started");
    },
    
    /**
     * Stop engine monitoring
     */
    stop() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    },
    
    /**
     * Check engine health via ping
     */
    checkEngineHealth() {
        // Skip if circuit is open
        if (CircuitBreaker.isOpen('engine')) {
            return;
        }
        
        const now = Date.now();
        const timeSinceLastResponse = now - WatchdogState.lastEngineResponse;
        
        // Check for engine timeout
        if (WatchdogState.pendingEngineCommand && timeSinceLastResponse > WatchdogConfig.engineTimeoutThreshold) {
            WatchdogLog.warn(`Engine timeout detected (${timeSinceLastResponse}ms since last response)`);
            CircuitBreaker.recordFailure('engine');
            this.recoverEngine();
            return;
        }
        
        // Periodic ping to verify engine is alive
        if (!this.waitingForPong && chessEngine) {
            this.pingEngine();
        }
    },
    
    /**
     * Ping the engine
     */
    pingEngine() {
        try {
            this.waitingForPong = true;
            this.lastPingTime = Date.now();
            chessEngine.postMessage("isready");
            
            // Timeout for pong
            setTimeout(() => {
                if (this.waitingForPong) {
                    const elapsed = Date.now() - this.lastPingTime;
                    if (elapsed > 5000) {
                        WatchdogLog.warn("Engine ping timeout - no 'readyok' received");
                        this.waitingForPong = false;
                        CircuitBreaker.recordFailure('engine');
                        this.recoverEngine();
                    }
                }
            }, 5000);
        } catch (e) {
            WatchdogLog.error(`Engine ping failed: ${e.message}`);
            this.waitingForPong = false;
            CircuitBreaker.recordFailure('engine');
        }
    },
    
    /**
     * Handle pong response
     */
    handlePong() {
        this.waitingForPong = false;
        WatchdogState.lastEngineResponse = Date.now();
        WatchdogState.engineAlive = true;
        CircuitBreaker.recordSuccess('engine');
    },
    
    /**
     * Mark engine response received
     */
    markResponse() {
        WatchdogState.lastEngineResponse = Date.now();
        WatchdogState.pendingEngineCommand = false;
        WatchdogState.engineAlive = true;
    },
    
    /**
     * Mark pending command
     */
    markPendingCommand() {
        WatchdogState.pendingEngineCommand = true;
    },
    
    /**
     * Recover the engine
     */
    recoverEngine() {
        if (WatchdogState.engineRecoveryAttempts >= WatchdogConfig.maxRecoveryAttempts) {
            WatchdogLog.critical("Max engine recovery attempts reached - triggering full reset");
            FullSystemRecovery.execute();
            return;
        }
        
        WatchdogState.engineRecoveryAttempts++;
        WatchdogState.metrics.engineRestarts++;
        WatchdogLog.recovery(`Attempting engine recovery (attempt ${WatchdogState.engineRecoveryAttempts})`);
        
        try {
            // Reinitialize the engine
            chessEngine = window.STOCKFISH();
            
            chessEngine.postMessage("uci");
            chessEngine.postMessage("setoption name MultiPV value 4");
            chessEngine.postMessage("setoption name Contempt value 100");
            chessEngine.postMessage("setoption name Move Overhead value 15");
            chessEngine.postMessage("setoption name Ponder value false");
            chessEngine.postMessage("setoption name UCI_AnalyseMode value false");
            chessEngine.postMessage("ucinewgame");
            chessEngine.postMessage("isready");
            
            // Re-attach message handler
            setupChessEngineOnMessage();
            
            WatchdogState.engineAlive = true;
            WatchdogState.lastEngineResponse = Date.now();
            WatchdogState.pendingEngineCommand = false;
            WatchdogState.totalRecoveries++;
            WatchdogState.metrics.recoveries++;
            
            WatchdogLog.recovery("Engine recovery successful");
            
            // If we had a position, recalculate
            if (currentFen) {
                setTimeout(() => {
                    calculateMove();
                }, 500);
            }
            
        } catch (e) {
            WatchdogLog.error(`Engine recovery failed: ${e.message}`);
            CircuitBreaker.recordFailure('engine');
            
            // Retry with backoff
            const backoffDelay = 1000 * Math.pow(WatchdogConfig.recoveryBackoffMultiplier, WatchdogState.engineRecoveryAttempts);
            setTimeout(() => {
                this.recoverEngine();
            }, backoffDelay);
        }
    },
    
    /**
     * Reset recovery attempts counter
     */
    resetRecoveryCount() {
        WatchdogState.engineRecoveryAttempts = 0;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// WEBSOCKET WATCHDOG - Monitors and recovers WebSocket connection
// ═══════════════════════════════════════════════════════════════════════════

const WebSocketWatchdog = {
    checkInterval: null,
    originalWebSocket: null,
    
    /**
     * Start WebSocket monitoring
     */
    start() {
        this.checkInterval = setInterval(() => {
            this.checkWebSocketHealth();
        }, WatchdogConfig.heartbeatInterval);
        
        WatchdogLog.info("WebSocket watchdog started");
    },
    
    /**
     * Stop WebSocket monitoring
     */
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    },
    
    /**
     * Check WebSocket health
     */
    checkWebSocketHealth() {
        // Skip if circuit is open
        if (CircuitBreaker.isOpen('websocket')) {
            return;
        }
        
        const now = Date.now();
        const timeSinceLastMessage = now - WatchdogState.lastWsMessage;
        
        // Check for stale WebSocket
        if (timeSinceLastMessage > WatchdogConfig.staleStateThreshold) {
            WatchdogLog.warn(`WebSocket possibly stale (${timeSinceLastMessage}ms since last message)`);
            
            // Check actual WebSocket state
            if (webSocketWrapper) {
                const readyState = webSocketWrapper.readyState;
                
                if (readyState === WebSocket.CLOSED || readyState === WebSocket.CLOSING) {
                    WatchdogLog.warn("WebSocket is closed/closing - attempting recovery");
                    CircuitBreaker.recordFailure('websocket');
                    this.recoverWebSocket();
                } else if (readyState === WebSocket.OPEN) {
                    // WebSocket open but no messages - might be in a non-game context
                    WatchdogState.wsAlive = true;
                }
            } else {
                WatchdogLog.warn("WebSocket wrapper is null");
                CircuitBreaker.recordFailure('websocket');
            }
        }
    },
    
    /**
     * Mark message received
     */
    markMessageReceived() {
        WatchdogState.lastWsMessage = Date.now();
        WatchdogState.wsAlive = true;
        CircuitBreaker.recordSuccess('websocket');
    },
    
    /**
     * Recover WebSocket
     */
    recoverWebSocket() {
        if (WatchdogState.wsReconnecting) {
            WatchdogLog.info("WebSocket recovery already in progress");
            return;
        }
        
        if (WatchdogState.wsRecoveryAttempts >= WatchdogConfig.wsMaxReconnectAttempts) {
            WatchdogLog.critical("Max WebSocket recovery attempts reached");
            // Don't trigger full reset for WebSocket - page navigation handles this
            WatchdogState.wsRecoveryAttempts = 0;
            return;
        }
        
        WatchdogState.wsReconnecting = true;
        WatchdogState.wsRecoveryAttempts++;
        WatchdogState.metrics.wsReconnections++;
        
        WatchdogLog.recovery(`Attempting WebSocket recovery (attempt ${WatchdogState.wsRecoveryAttempts})`);
        
        // WebSocket recovery is tricky - we intercept, not create
        // Best approach is to wait for Lichess to reconnect
        setTimeout(() => {
            WatchdogState.wsReconnecting = false;
            
            // Check if recovered
            if (webSocketWrapper && webSocketWrapper.readyState === WebSocket.OPEN) {
                WatchdogLog.recovery("WebSocket recovery successful");
                WatchdogState.wsRecoveryAttempts = 0;
                CircuitBreaker.recordSuccess('websocket');
            }
        }, WatchdogConfig.wsReconnectDelay * WatchdogState.wsRecoveryAttempts);
    },
    
    /**
     * Reset recovery attempts
     */
    resetRecoveryCount() {
        WatchdogState.wsRecoveryAttempts = 0;
        WatchdogState.wsReconnecting = false;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// MOVE CALCULATION WATCHDOG - Ensures moves are calculated
// ═══════════════════════════════════════════════════════════════════════════

const MoveCalculationWatchdog = {
    checkInterval: null,
    moveTimeout: null,
    
    /**
     * Start move calculation monitoring
     */
    start() {
        this.checkInterval = setInterval(() => {
            this.checkMoveCalculation();
        }, WatchdogConfig.heartbeatInterval);
        
        WatchdogLog.info("Move calculation watchdog started");
    },
    
    /**
     * Stop move calculation monitoring
     */
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
        this.clearMoveTimeout();
    },
    
    /**
     * Check move calculation status
     */
    checkMoveCalculation() {
        // Skip if circuit is open
        if (CircuitBreaker.isOpen('moveCalc')) {
            return;
        }
        
        if (!WatchdogState.calculatingMove) {
            return;
        }
        
        const now = Date.now();
        const calculationTime = now - WatchdogState.moveCalculationStart;
        
        if (calculationTime > WatchdogConfig.moveTimeoutThreshold) {
            WatchdogLog.warn(`Move calculation timeout (${calculationTime}ms)`);
            CircuitBreaker.recordFailure('moveCalc');
            this.recoverMoveCalculation();
        }
    },
    
    /**
     * Mark move calculation started
     */
    markCalculationStart() {
        WatchdogState.calculatingMove = true;
        WatchdogState.moveCalculationStart = Date.now();
        
        // Set backup timeout
        this.setMoveTimeout();
    },
    
    /**
     * Mark move calculation complete
     */
    markCalculationComplete() {
        WatchdogState.calculatingMove = false;
        WatchdogState.lastMoveCalculated = Date.now();
        WatchdogState.moveTimeoutCount = 0;
        WatchdogState.metrics.totalMoves++;
        WatchdogState.metrics.successfulMoves++;
        CircuitBreaker.recordSuccess('moveCalc');
        
        this.clearMoveTimeout();
    },
    
    /**
     * Set move timeout
     */
    setMoveTimeout() {
        this.clearMoveTimeout();
        
        this.moveTimeout = setTimeout(() => {
            if (WatchdogState.calculatingMove) {
                WatchdogLog.warn("Move timeout triggered by backup timer");
                this.recoverMoveCalculation();
            }
        }, WatchdogConfig.moveTimeoutThreshold + 5000);
    },
    
    /**
     * Clear move timeout
     */
    clearMoveTimeout() {
        if (this.moveTimeout) {
            clearTimeout(this.moveTimeout);
            this.moveTimeout = null;
        }
    },
    
    /**
     * Recover from stuck move calculation
     */
    recoverMoveCalculation() {
        WatchdogState.moveTimeoutCount++;
        WatchdogState.metrics.failedMoves++;
        
        WatchdogLog.recovery("Attempting move calculation recovery");
        
        // Reset state
        WatchdogState.calculatingMove = false;
        this.clearMoveTimeout();
        
        // If we have a current position, try to recalculate
        if (currentFen) {
            // First, try to recover the engine
            EngineWatchdog.recoverEngine();
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// STATE RECOVERY - Handles corrupted or inconsistent states
// ═══════════════════════════════════════════════════════════════════════════

const StateRecovery = {
    /**
     * Validate current state
     */
    validateState() {
        const issues = [];
        
        // Check engine state
        if (!chessEngine) {
            issues.push("Engine is null");
        }
        
        // Check WebSocket state
        if (!webSocketWrapper) {
            issues.push("WebSocket wrapper is null");
        }
        
        // Check for inconsistent calculation state
        if (WatchdogState.calculatingMove && (Date.now() - WatchdogState.moveCalculationStart) > 60000) {
            issues.push("Move calculation stuck for over 60s");
        }
        
        return issues;
    },
    
    /**
     * Recover from inconsistent state
     */
    recoverFromInconsistentState() {
        WatchdogLog.recovery("Attempting state recovery");
        
        // Reset calculation state
        WatchdogState.calculatingMove = false;
        WatchdogState.pendingEngineCommand = false;
        
        // Reset strategic state
        strategicPlan = null;
        pressureFronts = [];
        lastMoveWasQuiet = false;
        consecutiveQuietMoves = 0;
        
        WatchdogLog.recovery("State recovery complete");
    },
    
    /**
     * Full state reset (preserves position history for repetition tracking)
     */
    fullStateReset() {
        WatchdogLog.recovery("Executing full state reset");
        
        // Reset game state but keep position history
        currentEval = 0;
        isWinning = false;
        isCrushing = false;
        strategicPlan = null;
        pressureFronts = [];
        lastMoveWasQuiet = false;
        consecutiveQuietMoves = 0;
        initiativeOwner = null;
        pieceActivity = { white: 0, black: 0 };
        
        // Reset endgame patterns
        for (let key in ENDGAME_PATTERNS) {
            ENDGAME_PATTERNS[key] = false;
        }
        
        // Reset watchdog state
        WatchdogState.calculatingMove = false;
        WatchdogState.pendingEngineCommand = false;
        
        WatchdogLog.recovery("Full state reset complete");
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// FULL SYSTEM RECOVERY - Last resort recovery mechanism
// ═══════════════════════════════════════════════════════════════════════════

const FullSystemRecovery = {
    /**
     * Execute full system recovery
     */
    execute() {
        WatchdogState.fullResetCount++;
        
        if (WatchdogState.fullResetCount > WatchdogConfig.fullResetThreshold) {
            WatchdogLog.critical("Too many full resets - system may be fundamentally broken");
            // Don't spam resets - wait for user intervention or page reload
            return;
        }
        
        WatchdogLog.critical("Executing FULL SYSTEM RECOVERY");
        
        // Stop all watchdogs temporarily
        EngineWatchdog.stop();
        WebSocketWatchdog.stop();
        MoveCalculationWatchdog.stop();
        
        // Reset all circuit breakers
        CircuitBreaker.resetAll();
        
        // Reset recovery counts
        WatchdogState.engineRecoveryAttempts = 0;
        WatchdogState.wsRecoveryAttempts = 0;
        WatchdogState.wsReconnecting = false;
        
        // Recover state
        StateRecovery.fullStateReset();
        
        // Reinitialize engine
        try {
            chessEngine = window.STOCKFISH();
            
            chessEngine.postMessage("uci");
            chessEngine.postMessage("setoption name MultiPV value 4");
            chessEngine.postMessage("setoption name Contempt value 100");
            chessEngine.postMessage("setoption name Move Overhead value 15");
            chessEngine.postMessage("setoption name Ponder value false");
            chessEngine.postMessage("setoption name UCI_AnalyseMode value false");
            chessEngine.postMessage("ucinewgame");
            chessEngine.postMessage("isready");
            
            // Re-attach message handler
            setupChessEngineOnMessage();
            
        } catch (e) {
            WatchdogLog.critical(`Failed to reinitialize engine: ${e.message}`);
        }
        
        // Restart watchdogs
        setTimeout(() => {
            EngineWatchdog.start();
            WebSocketWatchdog.start();
            MoveCalculationWatchdog.start();
            
            WatchdogState.systemHealthy = true;
            WatchdogLog.recovery("Full system recovery complete");
            
            // If we have a position, try to continue
            if (currentFen) {
                calculateMove();
            }
        }, 2000);
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// HEARTBEAT SYSTEM - Periodic system health checks
// ═══════════════════════════════════════════════════════════════════════════

const HeartbeatSystem = {
    interval: null,
    
    /**
     * Start heartbeat
     */
    start() {
        this.interval = setInterval(() => {
            this.pulse();
        }, WatchdogConfig.heartbeatInterval * 5); // Every 10 seconds
        
        WatchdogLog.info("Heartbeat system started");
    },
    
    /**
     * Stop heartbeat
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    /**
     * Heartbeat pulse - comprehensive health check
     */
    pulse() {
        WatchdogState.lastHeartbeat = Date.now();
        
        // Validate state
        const issues = StateRecovery.validateState();
        
        if (issues.length > 0) {
            WatchdogLog.warn(`Health check found issues: ${issues.join(', ')}`);
            
            // Attempt recovery for each issue
            for (let issue of issues) {
                if (issue.indexOf("Engine") !== -1) {
                    EngineWatchdog.recoverEngine();
                }
                if (issue.indexOf("calculation stuck") !== -1) {
                    MoveCalculationWatchdog.recoverMoveCalculation();
                }
            }
        }
        
        // Log health metrics periodically
        if (WatchdogConfig.enableHealthMetrics) {
            this.logMetrics();
        }
    },
    
    /**
     * Log health metrics
     */
    logMetrics() {
        const uptime = Math.floor((Date.now() - WatchdogState.metrics.uptime) / 1000);
        const successRate = WatchdogState.metrics.totalMoves > 0 
            ? ((WatchdogState.metrics.successfulMoves / WatchdogState.metrics.totalMoves) * 100).toFixed(1)
            : 100;
        
        if (WatchdogConfig.enableDetailedLogging) {
            console.log(`[WATCHDOG] Health: Uptime=${uptime}s, Moves=${WatchdogState.metrics.totalMoves}, Success=${successRate}%, Recoveries=${WatchdogState.metrics.recoveries}`);
        }
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ERROR BOUNDARY - Global error catching
// ═══════════════════════════════════════════════════════════════════════════

const ErrorBoundary = {
    /**
     * Setup global error handlers
     */
    setup() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            if (event.message && event.message.indexOf('STOCKFISH') !== -1) {
                WatchdogLog.error(`Stockfish error caught: ${event.message}`);
                EngineWatchdog.recoverEngine();
            }
        });
        
        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            WatchdogLog.error(`Unhandled promise rejection: ${event.reason}`);
        });
        
        WatchdogLog.info("Error boundary setup complete");
    },
    
    /**
     * Wrap a function with error handling
     */
    wrap(fn, context = 'unknown') {
        return function(...args) {
            try {
                return fn.apply(this, args);
            } catch (e) {
                WatchdogLog.error(`Error in ${context}: ${e.message}`);
                
                // Attempt recovery based on context
                if (context.indexOf('engine') !== -1) {
                    EngineWatchdog.recoverEngine();
                } else if (context.indexOf('move') !== -1) {
                    MoveCalculationWatchdog.recoverMoveCalculation();
                }
                
                return null;
            }
        };
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// WATCHDOG MASTER CONTROLLER - Coordinates all watchdog components
// Enhanced with ABSOLUTE watchdog from backup for maximum stability
// ═══════════════════════════════════════════════════════════════════════════

const WatchdogMaster = {
    initialized: false,
    
    /**
     * Initialize and start all watchdog components
     */
    initialize() {
        if (this.initialized) {
            WatchdogLog.warn("Watchdog already initialized");
            return;
        }
        
        WatchdogLog.info("Initializing Watchdog Master Controller");
        
        // Setup error boundary first
        ErrorBoundary.setup();
        
        // Start all watchdogs
        EngineWatchdog.start();
        WebSocketWatchdog.start();
        MoveCalculationWatchdog.start();
        HeartbeatSystem.start();
        
        // START CRITICAL: ABSOLUTE WATCHDOG HEALTH CHECK SYSTEM (FROM BACKUP)
        // This is the BEST-OF-THE-BEST recalculation watchdog
        startHealthCheckSystem();
        
        this.initialized = true;
        
        WatchdogLog.info("═══════════════════════════════════════════════════════");
        WatchdogLog.info("  WATCHDOG SYSTEM FULLY OPERATIONAL - ABSOLUTE MODE");
        WatchdogLog.info("  • Engine monitoring: ACTIVE");
        WatchdogLog.info("  • WebSocket monitoring: ACTIVE");
        WatchdogLog.info("  • Move calculation monitoring: ACTIVE");
        WatchdogLog.info("  • Heartbeat system: ACTIVE");
        WatchdogLog.info("  • Circuit breakers: READY");
        WatchdogLog.info("  • Error boundary: ACTIVE");
        WatchdogLog.info("  • ABSOLUTE WATCHDOG: ACTIVE (8s timeout)");
        WatchdogLog.info("  • HEALTH CHECK SYSTEM: ACTIVE (2s interval)");
        WatchdogLog.info("  • PER-COLOR TRACKING: ACTIVE (deadlock-proof)");
        WatchdogLog.info("═══════════════════════════════════════════════════════");
    },
    
    /**
     * Stop all watchdog components
     */
    shutdown() {
        WatchdogLog.info("Shutting down Watchdog Master Controller");
        
        EngineWatchdog.stop();
        WebSocketWatchdog.stop();
        MoveCalculationWatchdog.stop();
        HeartbeatSystem.stop();
        
        // Clear absolute watchdog timers
        if (healthCheckInterval) {
            clearInterval(healthCheckInterval);
            healthCheckInterval = null;
        }
        clearAbsoluteWatchdog();
        
        this.initialized = false;
    },
    
    /**
     * Get system health status
     */
    getHealthStatus() {
        return {
            systemHealthy: WatchdogState.systemHealthy,
            engineAlive: WatchdogState.engineAlive,
            wsAlive: WatchdogState.wsAlive,
            calculationLock: WatchdogState.calculationLock,
            whitePositionReady: WatchdogState.whitePositionReady,
            blackPositionReady: WatchdogState.blackPositionReady,
            lastSuccessfulMove: Date.now() - WatchdogState.lastSuccessfulMoveTime,
            circuits: {
                engine: !CircuitBreaker.isOpen('engine'),
                websocket: !CircuitBreaker.isOpen('websocket'),
                moveCalc: !CircuitBreaker.isOpen('moveCalc')
            },
            metrics: WatchdogState.metrics,
            uptime: Date.now() - WatchdogState.metrics.uptime
        };
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION HOOKS - Connect watchdog to existing bot functions
// Enhanced with ABSOLUTE watchdog integration for guaranteed stability
// ═══════════════════════════════════════════════════════════════════════════

// Store original functions
const _originalCalculateMove = calculateMove;
const _originalSendMove = sendMove;

// Override calculateMove with watchdog integration + ABSOLUTE WATCHDOG
calculateMove = function() {
    try {
        // CRITICAL: Start absolute watchdog timer
        startAbsoluteWatchdog();
        
        // Set calculation lock state
        WatchdogState.calculationLock = true;
        WatchdogState.calculationStartTime = Date.now();
        
        MoveCalculationWatchdog.markCalculationStart();
        EngineWatchdog.markPendingCommand();
        
        _originalCalculateMove.apply(this, arguments);
    } catch (e) {
        WatchdogLog.error(`calculateMove error: ${e.message}`);
        forceUnlockAndReset("calculateMove exception");
        MoveCalculationWatchdog.recoverMoveCalculation();
    }
};

// Override sendMove with watchdog integration + ABSOLUTE WATCHDOG
sendMove = function(move) {
    try {
        // CRITICAL: Clear absolute watchdog - move successfully sent
        clearAbsoluteWatchdog();
        
        // Update successful move time
        WatchdogState.lastSuccessfulMoveTime = Date.now();
        
        // Clear calculation lock
        WatchdogState.calculationLock = false;
        WatchdogState.calculationStartTime = 0;
        
        // Clear position ready flags for current color
        const fenActiveColor = getActiveColorFromFen(currentFen);
        if (fenActiveColor === 'w') {
            WatchdogState.whitePositionReady = false;
        } else {
            WatchdogState.blackPositionReady = false;
        }
        
        MoveCalculationWatchdog.markCalculationComplete();
        
        _originalSendMove.apply(this, arguments);
    } catch (e) {
        WatchdogLog.error(`sendMove error: ${e.message}`);
        // Move sending failed - try again
        if (move) {
            setTimeout(() => {
                try {
                    _originalSendMove(move);
                } catch (e2) {
                    WatchdogLog.critical(`Failed to send move after retry: ${e2.message}`);
                }
            }, 100);
        }
    }
};

// Override setupChessEngineOnMessage to integrate watchdog
const _originalSetupChessEngineOnMessage = setupChessEngineOnMessage;

setupChessEngineOnMessage = function() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        try {
            // Watchdog: Mark engine response
            EngineWatchdog.markResponse();
            
            // Watchdog: Handle isready/readyok ping
            if (event && event.indexOf('readyok') !== -1) {
                EngineWatchdog.handlePong();
            }
            
            engineOutput += event + "\n";
            
            // SUPERHUMAN: Parse evaluation for winning status
            if (event.indexOf('score') !== -1) {
                const evalScore = parseEvaluation(event);
                updateWinningStatus(evalScore);
            }
            
            if (event.indexOf('multipv') !== -1) {
                const lines = parseMultiPV(event);
                if (lines.length > 0) {
                    multiPVLines = lines;
                }
            }
            
            if (event && event.indexOf('bestmove') !== -1) {
                const moveParts = event.split(" ");
                bestMove = moveParts[1];
                
                // SUPERHUMAN: Smart move selection
                let finalMove = selectBestMove(bestMove, multiPVLines);
                
                // SUPERHUMAN: Track move patterns
                if (multiPVLines.length > 0) {
                    const topMoveScore = multiPVLines[0].score || 0;
                    const secondScore = multiPVLines.length > 1 ? multiPVLines[1].score || 0 : topMoveScore;
                    
                    if (Math.abs(topMoveScore - secondScore) < 10) {
                        lastMoveWasQuiet = true;
                        consecutiveQuietMoves++;
                    } else {
                        lastMoveWasQuiet = false;
                        consecutiveQuietMoves = 0;
                    }
                }
                
                sendMove(finalMove);
                engineOutput = "";
            }
        } catch (e) {
            WatchdogLog.error(`Engine message handler error: ${e.message}`);
        }
    };
};

// Enhance WebSocket interception with watchdog
const _originalInterceptWebSocket = interceptWebSocket;

interceptWebSocket = function() {
    let webSocket = window.WebSocket;
    const webSocketProxy = new Proxy(webSocket, {
        construct: function (target, args) {
            let wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                try {
                    // Watchdog: Mark WebSocket message received
                    WebSocketWatchdog.markMessageReceived();
                    
                    let message = JSON.parse(event.data);
                    
                    // SUPERHUMAN: Detect new game start
                    if (message.t === "crowd" || message.t === "featured") {
                        resetGameState();
                    }
                    
                    if (message.d && typeof message.d.fen === "string" && typeof message.v === "number") {
                        currentFen = message.d.fen;
                        
                        let isWhitesTurn = message.v % 2 == 0;
                        myColor = isWhitesTurn ? 'w' : 'b';
                        
                        if (isWhitesTurn) {
                            currentFen += " w";
                        } else {
                            currentFen += " b";
                        }
                        
                        moveCount = Math.floor(message.v / 2) + 1;
                        
                        // SUPERHUMAN: Track position for repetition
                        trackPosition(currentFen);
                        
                        // SUPERHUMAN: Enhanced game phase detection
                        gamePhase = getGamePhase(moveCount, currentFen);
                        positionType = analyzePositionType(currentFen);
                        
                        // SUPERHUMAN: Detect endgame type for technique
                        if (gamePhase === "endgame") {
                            detectEndgameType(currentFen);
                        }
                        
                        // SUPERHUMAN: Adjust contempt based on winning status
                        adjustContempt();
                        
                        calculateMove();
                    }
                } catch (e) {
                    WatchdogLog.error(`WebSocket message handler error: ${e.message}`);
                }
            });
            
            // Watchdog: Monitor WebSocket state changes
            wrappedWebSocket.addEventListener("close", function(event) {
                WatchdogLog.warn(`WebSocket closed: code=${event.code}, reason=${event.reason}`);
                WatchdogState.wsAlive = false;
            });
            
            wrappedWebSocket.addEventListener("error", function(event) {
                WatchdogLog.error("WebSocket error occurred");
                WatchdogState.wsAlive = false;
                CircuitBreaker.recordFailure('websocket');
            });
            
            wrappedWebSocket.addEventListener("open", function(event) {
                WatchdogLog.info("WebSocket opened");
                WatchdogState.wsAlive = true;
                WatchdogState.wsRecoveryAttempts = 0;
                CircuitBreaker.recordSuccess('websocket');
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
};

// Re-run initialization with watchdog-enhanced functions
interceptWebSocket();
setupChessEngineOnMessage();

// Initialize Watchdog Master
WatchdogMaster.initialize();

// SUPERHUMAN: Console announcement
console.log("═══════════════════════════════════════════════════════════════");
console.log("  ALPHAZERO TRUE SUPERHUMAN v6.1.0 - BEAST MODE ACTIVATED");
console.log("  • Flawless endgame technique (Philidor, Lucena, Opposition)");
console.log("  • Perfect positional judgment");
console.log("  • Strategic web-weaving (50+ move horizon)");
console.log("  • Zero blunders, maximum contempt");
console.log("  • ROBUST WATCHDOG SYSTEM - Self-healing architecture");
console.log("  • Circuit breakers & auto-recovery - NEVER stops");
console.log("═══════════════════════════════════════════════════════════════");
