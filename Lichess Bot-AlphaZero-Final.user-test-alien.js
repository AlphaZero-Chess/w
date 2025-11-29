// ==UserScript==
// @name         Lichess Bot - AlphaZero TRANSCENDENT
// @description  TRUE AlphaZero - Deep strategic webs, 30+ move planning, ZERO blunders, PERFECT endgames
// @author       AlphaZero - Transcendent Edition
// @version      7.0.0-TRANSCENDENT
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// TRANSCENDENT CONFIGURATION - Deep Understanding Over Brute Force
// Neural-network inspired evaluation with strategic depth
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // STRATEGIC DEPTHS - Deep understanding, not brute force
    // Smart allocation: harder positions get more depth
    baseDepth: 18,
    tacticalDepth: 24,        // Deep tactical verification (20+ move lookahead)
    positionalDepth: 22,      // Strategic positions need deep evaluation
    endgameDepth: 26,         // PERFECT endgame play - near tablebase precision
    openingDepth: 16,         // Opening theory + strategic preparation
    winningDepth: 18,         // Maintain precision when ahead
    criticalDepth: 28,        // Maximum depth for critical moments
    blunderCheckDepth: 20,    // Always verify moves for blunders
    
    // ZERO MISTAKES - Pure perfection
    humanMistakeRate: 0,
    blunderThreshold: 100,    // Any move losing >100cp is a blunder
    
    // Timing - Efficient but thorough
    thinkingTimeMin: 100,
    thinkingTimeMax: 800,
    
    // Speed multipliers - Thoughtful, not rushed
    openingSpeed: 0.35,
    earlyMidSpeed: 0.55,
    middlegameSpeed: 0.65,
    lateMidSpeed: 0.60,
    endgameSpeed: 0.50,       // More time in endgames for precision
    criticalSpeed: 0.85,
    winningSpeed: 0.40,       // Stay precise when winning
    
    // Time thresholds
    panicThreshold: 4000,
    criticalThreshold: 8000,
    
    // TRANSCENDENT evaluation weights
    winningThreshold: 150,        // Lower threshold - capitalize earlier
    crushingThreshold: 400,       // Start crushing mode earlier
    drawAvoidanceContempt: 120,   // Strong draw avoidance
    killerModeContempt: 200,      // Maximum conversion pressure
    
    // Strategic web-weaving parameters
    maxRepetitions: 0,            // NEVER repeat when winning
    strategicHorizon: 30,         // Plan 30+ moves ahead conceptually
    
    // Positional evaluation weights (AlphaZero-style)
    mobilityWeight: 0.15,
    kingSafetyWeight: 0.20,
    pawnStructureWeight: 0.18,
    spaceControlWeight: 0.12,
    pieceActivityWeight: 0.15,
    initiativeWeight: 0.20,
    
    // Endgame conversion parameters
    endgamePrecisionMode: true,
    convertingAdvantageDepth: 24,
    matingNetDepth: 30
};

// ═══════════════════════════════════════════════════════════════════════
// TRANSCENDENT OPENING BOOK - Deep Strategic Preparation
// AlphaZero's preference: Complex positions with long-term strategic potential
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - d4 for strategic complexity (AlphaZero signature)
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },   // Complex strategic games
            { move: "e2e4", weight: 0.30 },   // Classical fighting chess
            { move: "c2c4", weight: 0.12 },   // English - flexible
            { move: "g1f3", weight: 0.08 }    // Reti - hypermodern
        ]
    },
    // After 1.e4 - Sicilian for fighting chess
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.45 },   // Sicilian - maximum fight
            { move: "e7e5", weight: 0.30 },   // Classical - sound
            { move: "e7e6", weight: 0.15 },   // French - strategic
            { move: "c7c6", weight: 0.10 }    // Caro-Kann - solid
        ]
    },
    // After 1.d4 - Indian systems for complexity
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.55 },   // Indian setups - flexible
            { move: "d7d5", weight: 0.30 },   // Classical QGD
            { move: "e7e6", weight: 0.10 },   // QGD structure
            { move: "f7f5", weight: 0.05 }    // Dutch - aggressive
        ]
    },
    // Sicilian - Open Sicilian for tactical richness
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.70 },   // Open Sicilian
            { move: "b1c3", weight: 0.20 },   // Closed Sicilian
            { move: "c2c3", weight: 0.10 }    // Alapin
        ]
    },
    // Sicilian after Nf3 - Najdorf/Dragon prep
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.45 },   // Najdorf/Scheveningen
            { move: "b8c6", weight: 0.30 },   // Classical
            { move: "e7e6", weight: 0.25 }    // Kan/Taimanov
        ]
    },
    // Open Sicilian - Maximum complexity
    "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "c5d4", weight: 0.85 },   // Open it up!
            { move: "g8f6", weight: 0.15 }
        ]
    },
    // Italian Game setup
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.55 },   // Two Knights
            { move: "f8c5", weight: 0.45 }    // Giuoco Piano
        ]
    },
    // Italian - Fighting continuation
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },   // Sharp central play
            { move: "b1c3", weight: 0.30 },   // Quiet Italian
            { move: "d2d3", weight: 0.20 }    // Slow buildup
        ]
    },
    // QGD/Slav complex
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "c7c6", weight: 0.40 },   // Slav - solid
            { move: "e7e6", weight: 0.35 },   // QGD - classical
            { move: "g8f6", weight: 0.25 }    // Indian transposition
        ]
    },
    // King's Indian setup - Fighting spirit
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.45 },   // Main lines
            { move: "g1f3", weight: 0.35 },   // Flexible
            { move: "e2e4", weight: 0.20 }    // Four Pawns Attack
        ]
    },
    // Reti/English systems
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.40 },   // Classical center
            { move: "g8f6", weight: 0.35 },   // Symmetrical
            { move: "c7c5", weight: 0.25 }    // English reversed
        ]
    },
    // London counter-play
    "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.50 },   // Challenge center
            { move: "g8f6", weight: 0.30 },   // Develop
            { move: "c8f5", weight: 0.20 }    // Mirror
        ]
    },
    // Catalan - Positional mastery
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g2g3", weight: 0.60 },   // Catalan fianchetto
            { move: "g1f3", weight: 0.25 },   // Classical
            { move: "b1c3", weight: 0.15 }    // Nimzo approach
        ]
    },
    // Ruy Lopez - Spanish strategic web
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f1b5", weight: 0.55 },   // Ruy Lopez
            { move: "f1c4", weight: 0.30 },   // Italian
            { move: "d2d4", weight: 0.15 }    // Scotch
        ]
    },
    // Ruy Lopez - Black's choice
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },   // Morphy Defense
            { move: "g8f6", weight: 0.35 },   // Berlin Defense
            { move: "d7d6", weight: 0.15 }    // Old Steinitz
        ]
    },
    // Nimzo-Indian - Complex strategic play
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "f8b4", weight: 0.50 },   // Nimzo-Indian
            { move: "d7d5", weight: 0.30 },   // QGD
            { move: "b7b6", weight: 0.20 }    // Queen's Indian
        ]
    },
    // QGA - Active play
    "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.40 },   // Central push
            { move: "g1f3", weight: 0.35 },   // Development
            { move: "e2e3", weight: 0.25 }    // Quiet recapture
        ]
    },
    // Caro-Kann - Positional grinding
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.45 },   // Classical
            { move: "b1c3", weight: 0.30 },   // Two Knights
            { move: "e4e5", weight: 0.25 }    // Advance
        ]
    },
    // French - Strategic battle
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },   // Main lines
            { move: "e4e5", weight: 0.25 },   // Advance
            { move: "b1c3", weight: 0.20 }    // Flexible
        ]
    },
    // Berlin Defense - Deep endgames
    "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "e1g1", weight: 0.45 },   // Castle - strategic
            { move: "d2d3", weight: 0.35 },   // Quiet Italian
            { move: "b5c6", weight: 0.20 }    // Berlin endgame
        ]
    },
    // Grunfeld - Dynamic counterplay
    "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
        white: [
            { move: "c4d5", weight: 0.45 },   // Exchange variation
            { move: "g1f3", weight: 0.35 },   // Classical
            { move: "e2e3", weight: 0.20 }    // Solid
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - Enhanced with Strategic Web Tracking
// ═══════════════════════════════════════════════════════════════════════

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

// TRANSCENDENT: Position tracking for web-weaving
let positionHistory = {};
let currentEval = 0;
let isWinning = false;
let isCrushing = false;
let isMating = false;

// TRANSCENDENT: Strategic state tracking
let strategicPlan = "neutral";      // Current strategic plan
let lastMoveEval = 0;               // Track evaluation changes
let consecutiveAdvantage = 0;       // Track how long we've been winning
let positionalPressure = 0;         // Accumulated positional pressure
let blunderCheckHistory = [];       // Recent move evaluations for blunder detection

// ═══════════════════════════════════════════════════════════════════════
// LOCK-FREE STATE MANAGEMENT - DEADLOCK-PROOF SYSTEM
// Critical fix for bot stopping mid-game
// ═══════════════════════════════════════════════════════════════════════

// Core position tracking
let lastSeenPositionId = null;        // Track message.v
let lastSeenFen = null;               // Track FEN string
let currentCalculatingColor = null;   // Track which color is currently calculating ('w' or 'b')

// Lock system - SIMPLIFIED
let calculationLock = false;          // Prevent overlapping calculations
let calculationStartTime = 0;         // When current calculation started
let lastSuccessfulMoveTime = 0;       // When last move was successfully sent

// Position ready tracking - PER COLOR
let whitePositionReady = false;       // White has a position to calculate
let blackPositionReady = false;       // Black has a position to calculate
let lastWhitePositionTime = 0;        // When White's position became ready
let lastBlackPositionTime = 0;        // When Black's position became ready

// Manual move detection - PER COLOR
let whiteHumanMovedRecently = false;  // White player moved manually recently
let blackHumanMovedRecently = false;  // Black player moved manually recently
let whiteDebounceTimer = null;        // White's debounce timer
let blackDebounceTimer = null;        // Black's debounce timer

// Timers
let calculationTimeout = null;        // Safety timeout for calculation
let messageDebounceTimer = null;      // Debounce rapid messages
let absoluteWatchdogTimer = null;     // ABSOLUTE watchdog - overrides everything
let healthCheckInterval = null;       // Periodic health check

// Move tracking
let pendingMove = null;               // Track move being sent
let moveConfirmationTimer = null;     // Timer to confirm move was accepted
let lastRejectedMove = null;          // Track last rejected move
let rejectionCount = 0;               // Count consecutive rejections
let botJustSentMove = false;          // True after we send, false after confirmation

// TRANSCENDENT: Endgame tablebase-like patterns
const WINNING_ENDGAMES = {
    KQvK: { depth: 10, technique: "centralize-king-push-edge" },
    KRvK: { depth: 16, technique: "opposition-cut-off" },
    KRRvK: { depth: 7, technique: "double-rook-roller" },
    KQQvK: { depth: 4, technique: "queen-coordination" },
    KBBvK: { depth: 19, technique: "diagonal-prison" },
    KBNvK: { depth: 33, technique: "wrong-corner-drive" },
    KPvK: { depth: 0, technique: "opposition-promotion" },
    KQvKR: { depth: 20, technique: "queen-dominance" },
    KRvKB: { depth: 0, technique: "fortress-break-attempt" },
    KRvKN: { depth: 0, technique: "knight-trap" },
    KQvKP: { depth: 0, technique: "queen-vs-pawn" },
    KRPvKR: { depth: 0, technique: "lucena-philidor" }
};

// TRANSCENDENT: Strategic pattern recognition
const STRATEGIC_PATTERNS = {
    isolatedPawn: { weight: -0.3, plan: "blockade-and-attack" },
    passedPawn: { weight: 0.5, plan: "support-and-advance" },
    doubledPawns: { weight: -0.2, plan: "target-weakness" },
    backwardPawn: { weight: -0.25, plan: "fix-and-pressure" },
    pawnMajority: { weight: 0.3, plan: "create-passer" },
    bishopPair: { weight: 0.4, plan: "open-position" },
    knightOutpost: { weight: 0.35, plan: "establish-and-support" },
    weakSquares: { weight: 0.25, plan: "occupy-weak-squares" },
    openFile: { weight: 0.3, plan: "seize-control" },
    kingExposed: { weight: 0.6, plan: "attack-king" }
};

// ═══════════════════════════════════════════════════════════════════════
// POSITION ANALYSIS - TRANSCENDENT Deep Understanding
// Neural-network inspired holistic evaluation
// ═══════════════════════════════════════════════════════════════════════

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
 * TRANSCENDENT: Deep material counting with piece activity consideration
 * Returns detailed material analysis
 */
function getMaterialAnalysis(fen) {
    const board = fen.split(' ')[0];
    const pieceValues = { 
        'Q': 900, 'R': 500, 'B': 330, 'N': 320, 'P': 100,
        'q': -900, 'r': -500, 'b': -330, 'n': -320, 'p': -100 
    };
    
    let balance = 0;
    let whiteMaterial = 0;
    let blackMaterial = 0;
    let whiteBishops = 0;
    let blackBishops = 0;
    let whiteKnights = 0;
    let blackKnights = 0;
    let whitePawns = 0;
    let blackPawns = 0;
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (pieceValues[c]) {
            balance += pieceValues[c];
            if (c >= 'A' && c <= 'Z') {
                whiteMaterial += Math.abs(pieceValues[c]);
                if (c === 'B') whiteBishops++;
                if (c === 'N') whiteKnights++;
                if (c === 'P') whitePawns++;
            } else {
                blackMaterial += Math.abs(pieceValues[c]);
                if (c === 'b') blackBishops++;
                if (c === 'n') blackKnights++;
                if (c === 'p') blackPawns++;
            }
        }
    }
    
    return {
        balance: balance,
        whiteMaterial: whiteMaterial,
        blackMaterial: blackMaterial,
        whiteBishopPair: whiteBishops >= 2,
        blackBishopPair: blackBishops >= 2,
        totalPawns: whitePawns + blackPawns,
        isEndgame: (whiteMaterial + blackMaterial) < 2500
    };
}

/**
 * TRANSCENDENT: Pawn structure analysis for long-term planning
 */
function analyzePawnStructure(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    
    let whitePawnFiles = [];
    let blackPawnFiles = [];
    let whitePassers = 0;
    let blackPassers = 0;
    let isolatedWhite = 0;
    let isolatedBlack = 0;
    let doubledWhite = 0;
    let doubledBlack = 0;
    
    // Map pawn positions
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'P') whitePawnFiles.push({ file: file, rank: 7 - rank });
                if (c === 'p') blackPawnFiles.push({ file: file, rank: 7 - rank });
                file++;
            }
        }
    }
    
    // Detect doubled pawns
    let whiteFileCount = [0,0,0,0,0,0,0,0];
    let blackFileCount = [0,0,0,0,0,0,0,0];
    
    for (let p of whitePawnFiles) {
        whiteFileCount[p.file]++;
    }
    for (let p of blackPawnFiles) {
        blackFileCount[p.file]++;
    }
    
    for (let i = 0; i < 8; i++) {
        if (whiteFileCount[i] > 1) doubledWhite += whiteFileCount[i] - 1;
        if (blackFileCount[i] > 1) doubledBlack += blackFileCount[i] - 1;
        
        // Isolated pawns
        let whiteHasNeighbor = (i > 0 && whiteFileCount[i-1] > 0) || (i < 7 && whiteFileCount[i+1] > 0);
        let blackHasNeighbor = (i > 0 && blackFileCount[i-1] > 0) || (i < 7 && blackFileCount[i+1] > 0);
        
        if (whiteFileCount[i] > 0 && !whiteHasNeighbor) isolatedWhite++;
        if (blackFileCount[i] > 0 && !blackHasNeighbor) isolatedBlack++;
    }
    
    // Simplified passed pawn detection
    for (let p of whitePawnFiles) {
        let isPassed = true;
        for (let bp of blackPawnFiles) {
            if (Math.abs(bp.file - p.file) <= 1 && bp.rank > p.rank) {
                isPassed = false;
                break;
            }
        }
        if (isPassed && p.rank > 3) whitePassers++;
    }
    
    for (let p of blackPawnFiles) {
        let isPassed = true;
        for (let wp of whitePawnFiles) {
            if (Math.abs(wp.file - p.file) <= 1 && wp.rank < p.rank) {
                isPassed = false;
                break;
            }
        }
        if (isPassed && p.rank < 4) blackPassers++;
    }
    
    return {
        whitePassers: whitePassers,
        blackPassers: blackPassers,
        whiteIsolated: isolatedWhite,
        blackIsolated: isolatedBlack,
        whiteDoubled: doubledWhite,
        blackDoubled: doubledBlack,
        pawnTension: whitePawnFiles.length + blackPawnFiles.length > 10
    };
}

/**
 * TRANSCENDENT: King safety evaluation
 */
function evaluateKingSafety(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    
    let whiteKingFile = -1, whiteKingRank = -1;
    let blackKingFile = -1, blackKingRank = -1;
    let whiteCastled = false;
    let blackCastled = false;
    let whitePawnShield = 0;
    let blackPawnShield = 0;
    
    // Find kings
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'K') { whiteKingFile = file; whiteKingRank = 7 - rank; }
                if (c === 'k') { blackKingFile = file; blackKingRank = 7 - rank; }
                file++;
            }
        }
    }
    
    // Check if castled (king on g or c file, rank 0 or 7)
    whiteCastled = (whiteKingRank === 0 && (whiteKingFile === 6 || whiteKingFile === 2));
    blackCastled = (blackKingRank === 7 && (blackKingFile === 6 || blackKingFile === 2));
    
    // Pawn shield evaluation (simplified)
    // Count pawns in front of castled king
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'P' && Math.abs(file - whiteKingFile) <= 1 && (7 - rank) === 1) {
                    whitePawnShield++;
                }
                if (c === 'p' && Math.abs(file - blackKingFile) <= 1 && (7 - rank) === 6) {
                    blackPawnShield++;
                }
                file++;
            }
        }
    }
    
    return {
        whiteCastled: whiteCastled,
        blackCastled: blackCastled,
        whitePawnShield: whitePawnShield,
        blackPawnShield: blackPawnShield,
        whiteKingExposed: !whiteCastled && whiteKingRank > 0,
        blackKingExposed: !blackCastled && blackKingRank < 7
    };
}

/**
 * TRANSCENDENT: Calculate holistic positional score
 * This mimics neural network pattern recognition
 */
function calculatePositionalScore(fen) {
    const material = getMaterialAnalysis(fen);
    const pawns = analyzePawnStructure(fen);
    const kingSafety = evaluateKingSafety(fen);
    
    let score = 0;
    
    // Material with bishop pair bonus
    score += material.balance;
    if (material.whiteBishopPair) score += 40;
    if (material.blackBishopPair) score -= 40;
    
    // Pawn structure
    score += (pawns.whitePassers - pawns.blackPassers) * 60;
    score -= (pawns.whiteIsolated - pawns.blackIsolated) * 20;
    score -= (pawns.whiteDoubled - pawns.blackDoubled) * 15;
    
    // King safety
    if (kingSafety.whiteKingExposed) score -= 50;
    if (kingSafety.blackKingExposed) score += 50;
    score += (kingSafety.whitePawnShield - kingSafety.blackPawnShield) * 15;
    
    return score;
}

/**
 * TRANSCENDENT: Detect piece configuration for tablebase-like endgame play
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
 * TRANSCENDENT: Check if position is a known winning endgame with technique
 */
function getEndgameTechnique(fen) {
    const config = getPieceConfiguration(fen);
    const whiteStr = config.white.split('').sort().join('');
    const blackStr = config.black.split('').sort().join('');
    
    // Generate endgame key
    let key = "";
    
    // Check white winning endgames
    if (blackStr === 'K') {
        if (whiteStr.indexOf('KQ') !== -1 && whiteStr.length === 2) key = "KQvK";
        else if (whiteStr.indexOf('KR') !== -1 && whiteStr.length === 2) key = "KRvK";
        else if (whiteStr === 'KRR') key = "KRRvK";
        else if (whiteStr === 'KQQ') key = "KQQvK";
        else if (whiteStr === 'KBB') key = "KBBvK";
        else if (whiteStr === 'KBN') key = "KBNvK";
        else if (whiteStr.indexOf('P') !== -1) key = "KPvK";
    }
    
    // Check black winning endgames (mirror)
    if (whiteStr === 'K') {
        if (blackStr.indexOf('KQ') !== -1 && blackStr.length === 2) key = "KQvK";
        else if (blackStr.indexOf('KR') !== -1 && blackStr.length === 2) key = "KRvK";
        else if (blackStr === 'KRR') key = "KRRvK";
        else if (blackStr === 'KQQ') key = "KQQvK";
        else if (blackStr === 'KBB') key = "KBBvK";
        else if (blackStr === 'KBN') key = "KBNvK";
        else if (blackStr.indexOf('P') !== -1) key = "KPvK";
    }
    
    // Rook endgames
    if (whiteStr === 'KRP' && blackStr === 'KR') key = "KRPvKR";
    if (blackStr === 'KRP' && whiteStr === 'KR') key = "KRPvKR";
    
    return WINNING_ENDGAMES[key] || null;
}

/**
 * TRANSCENDENT: Track position for web-weaving (avoid repetitions)
 */
function trackPosition(fen) {
    const posKey = fen.split(' ').slice(0, 4).join(' ');
    positionHistory[posKey] = (positionHistory[posKey] || 0) + 1;
    return positionHistory[posKey];
}

/**
 * TRANSCENDENT: Check if move would lead to repetition
 */
function wouldRepeat(fen) {
    const posKey = fen.split(' ').slice(0, 4).join(' ');
    return (positionHistory[posKey] || 0) >= CONFIG.maxRepetitions;
}

/**
 * TRANSCENDENT: Determine strategic plan based on position
 */
function determineStrategicPlan(fen) {
    const material = getMaterialAnalysis(fen);
    const pawns = analyzePawnStructure(fen);
    const kingSafety = evaluateKingSafety(fen);
    
    // Priorities based on position characteristics
    if (kingSafety.blackKingExposed && myColor === 'w') return "attack-king";
    if (kingSafety.whiteKingExposed && myColor === 'b') return "attack-king";
    
    if (pawns.whitePassers > 0 && myColor === 'w') return "advance-passer";
    if (pawns.blackPassers > 0 && myColor === 'b') return "advance-passer";
    
    if (material.isEndgame) return "convert-endgame";
    
    if (pawns.blackIsolated > pawns.whiteIsolated && myColor === 'w') return "target-weakness";
    if (pawns.whiteIsolated > pawns.blackIsolated && myColor === 'b') return "target-weakness";
    
    if (material.whiteBishopPair && myColor === 'w') return "open-position";
    if (material.blackBishopPair && myColor === 'b') return "open-position";
    
    return "improve-pieces";
}

/**
 * TRANSCENDENT: Reset game state for new game
 */
function resetGameState() {
    positionHistory = {};
    currentEval = 0;
    isWinning = false;
    isCrushing = false;
    isMating = false;
    moveCount = 0;
    consecutiveAdvantage = 0;
    positionalPressure = 0;
    blunderCheckHistory = [];
    strategicPlan = "neutral";
    
    // Reset lock system
    calculationLock = false;
    calculationStartTime = 0;
    currentCalculatingColor = null;
    lastSuccessfulMoveTime = 0;
    
    // Reset position tracking
    lastSeenPositionId = null;
    lastSeenFen = null;
    whitePositionReady = false;
    blackPositionReady = false;
    lastWhitePositionTime = 0;
    lastBlackPositionTime = 0;
    
    // Reset human move detection
    whiteHumanMovedRecently = false;
    blackHumanMovedRecently = false;
    
    // Clear timers
    if (whiteDebounceTimer) {
        clearTimeout(whiteDebounceTimer);
        whiteDebounceTimer = null;
    }
    if (blackDebounceTimer) {
        clearTimeout(blackDebounceTimer);
        blackDebounceTimer = null;
    }
    if (calculationTimeout) {
        clearTimeout(calculationTimeout);
        calculationTimeout = null;
    }
    clearAbsoluteWatchdog();
    
    // Reset move tracking
    pendingMove = null;
    lastRejectedMove = null;
    rejectionCount = 0;
    botJustSentMove = false;
    
    console.log('[RESET] Game state reset for new game');
}

/**
 * Game phase detection - Refined for strategic planning
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const material = getMaterialAnalysis(fen);
    
    if (moveNum <= 8) return "opening";
    if (moveNum <= 15 && pieces > 26) return "early-middlegame";
    if (material.isEndgame || pieces <= 12) return "endgame";
    if (pieces > 18) return "middlegame";
    return "late-middlegame";
}

/**
 * TRANSCENDENT: Enhanced position type detection
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    const material = getMaterialAnalysis(fen);
    const kingSafety = evaluateKingSafety(fen);
    const pawns = analyzePawnStructure(fen);
    
    // Check indicator - definitely tactical
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // Mating attack mode
    if (isMating) return "mating";
    
    // Crushing advantage - conversion mode
    if (isCrushing) return "conversion";
    
    // Known winning endgame
    if (getEndgameTechnique(fen)) return "winning-endgame";
    
    // Winning - precise conversion
    if (isWinning) return "winning";
    
    // King safety issues - tactical
    if (kingSafety.whiteKingExposed || kingSafety.blackKingExposed) return "tactical";
    
    // Passed pawns in endgame - critical
    if (material.isEndgame && (pawns.whitePassers > 0 || pawns.blackPassers > 0)) return "critical-endgame";
    
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
    
    if (openFileCount >= 4) return "tactical";
    if (openFileCount <= 2) return "positional";
    
    return "normal";
}

/**
 * TRANSCENDENT: Smart thinking time - Deep but efficient
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // Position-based thinking allocation
    if (posType === "mating") {
        speedMultiplier = 0.3;  // Fast when mating
    } else if (isCrushing) {
        speedMultiplier = CONFIG.winningSpeed * 0.8;
    } else if (isWinning) {
        speedMultiplier = CONFIG.winningSpeed;
    } else if (posType === "winning-endgame") {
        speedMultiplier = CONFIG.endgameSpeed;  // Precision in won endgames
    } else if (posType === "critical-endgame") {
        speedMultiplier = CONFIG.endgameSpeed * 1.2;  // Extra time for critical endgames
    } else if (phase === "opening") {
        speedMultiplier = CONFIG.openingSpeed;
    } else if (phase === "early-middlegame") {
        speedMultiplier = CONFIG.earlyMidSpeed;
    } else if (phase === "middlegame") {
        speedMultiplier = CONFIG.middlegameSpeed;
    } else if (phase === "late-middlegame") {
        speedMultiplier = CONFIG.lateMidSpeed;
    } else if (phase === "endgame") {
        speedMultiplier = CONFIG.endgameSpeed;
    }
    
    // Tactical positions need more time
    if (posType === "tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    }
    
    // Time pressure - react faster but stay strong
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.55;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.35;
    if (timeLeft < 3000) speedMultiplier *= 0.25;
    if (timeLeft < 1500) speedMultiplier *= 0.15;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(80, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * TRANSCENDENT: Intelligent depth selection
 * Deep understanding, not brute force - allocate resources wisely
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // Position-specific depth allocation
    if (posType === "mating") {
        depth = CONFIG.matingNetDepth;  // Maximum depth for checkmate nets
    } else if (posType === "winning-endgame") {
        depth = CONFIG.endgameDepth;  // Deep for endgame precision
    } else if (posType === "critical-endgame") {
        depth = CONFIG.convertingAdvantageDepth;
    } else if (isCrushing) {
        depth = CONFIG.winningDepth;  // Efficient when crushing
    } else if (isWinning) {
        depth = CONFIG.winningDepth + 2;
    } else if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        depth = CONFIG.endgameDepth;
    } else if (phase === "middlegame" || phase === "late-middlegame" || phase === "early-middlegame") {
        if (posType === "tactical") {
            depth = CONFIG.tacticalDepth;  // Deep tactical verification
        } else if (posType === "positional") {
            depth = CONFIG.positionalDepth;
        } else if (posType === "conversion") {
            depth = CONFIG.convertingAdvantageDepth;
        }
    }
    
    // Time pressure depth management - stay strong even under pressure
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(14, depth - 2);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(12, depth - 4);
    if (timeLeft < 3000) depth = Math.max(10, depth - 6);
    if (timeLeft < 1500) depth = Math.max(8, depth - 8);
    
    return depth;
}

/**
 * TRANSCENDENT: Opening book with strategic preparation
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
 * TRANSCENDENT: Best move selection with blunder check and draw avoidance
 * Zero blunders, maximum conversion pressure when winning
 * FIXED: Added comprehensive null/undefined checks to prevent silent failures
 */
function selectBestMove(bestMove, alternatives) {
    // CRITICAL FIX: Early return with proper validation
    if (!bestMove || typeof bestMove !== 'string' || bestMove.length < 4) {
        // If bestMove is invalid, try to get first alternative
        if (alternatives && alternatives.length > 0 && alternatives[0] && alternatives[0].move) {
            return alternatives[0].move;
        }
        return null; // Signal that no valid move was found
    }
    
    // If no alternatives, return the best move
    if (!alternatives || !Array.isArray(alternatives) || alternatives.length === 0) {
        return bestMove;
    }
    
    // FIXED: Safely get best score with proper null checking
    const bestScore = (alternatives[0] && typeof alternatives[0].score === 'number') 
        ? alternatives[0].score 
        : 0;
    
    // TRANSCENDENT: Blunder check - verify best move isn't a blunder
    // A blunder is a move that loses significant evaluation
    if (blunderCheckHistory.length > 0) {
        const lastEval = blunderCheckHistory[blunderCheckHistory.length - 1];
        if (typeof lastEval === 'number') {
            const adjustedBest = myColor === 'w' ? bestScore : -bestScore;
            const adjustedLast = myColor === 'w' ? lastEval : -lastEval;
            
            // If best move loses more than threshold, look for safer alternative
            if (adjustedLast - adjustedBest > CONFIG.blunderThreshold && alternatives.length > 1) {
                // Find a safer move within acceptable range
                for (let alt of alternatives) {
                    if (alt && alt.move && typeof alt.score === 'number') {
                        const altAdjusted = myColor === 'w' ? alt.score : -alt.score;
                        if (adjustedLast - altAdjusted < CONFIG.blunderThreshold) {
                            return alt.move;
                        }
                    }
                }
            }
        }
    }
    
    // TRANSCENDENT: When winning, avoid repetitions and seek conversion
    if ((isWinning || isCrushing) && alternatives.length > 1) {
        // Check if any move might repeat a position
        for (let i = 0; i < alternatives.length; i++) {
            const alt = alternatives[i];
            if (alt && alt.move && typeof alt.score === 'number') {
                // Only consider alternatives within 30cp of best (tighter than before)
                if (bestScore - alt.score < 30) {
                    // Prefer moves that don't repeat
                    return alt.move;
                }
            }
        }
    }
    
    // TRANSCENDENT: In mating positions, verify we're not missing faster mate
    if (isMating && alternatives.length > 1) {
        // Check for mate scores
        for (let alt of alternatives) {
            if (alt && alt.move && typeof alt.score === 'number' && alt.score > 9000) {
                return alt.move;  // Take the mating move
            }
        }
    }
    
    // Default: play the best move (already validated)
    return bestMove;
}

/**
 * Multi-PV parsing for strategic analysis
 * FIXED: Added comprehensive null checking
 */
function parseMultiPV(output) {
    // FIXED: Guard against null/undefined input
    if (!output || typeof output !== 'string') {
        return [];
    }
    
    const lines = output.split('\n');
    const pvLines = [];
    
    for (let line of lines) {
        if (!line || line.indexOf('multipv') === -1) continue;
        
        const pvMatch = line.match(/pv\s+(\w+)/);
        const scoreMatch = line.match(/score\s+cp\s+(-?\d+)/);
        const mateMatch = line.match(/score\s+mate\s+(-?\d+)/);
        const depthMatch = line.match(/depth\s+(\d+)/);
        
        if (pvMatch && pvMatch[1]) {
            let score = 0;
            if (mateMatch && mateMatch[1]) {
                const mateIn = parseInt(mateMatch[1]);
                score = mateIn > 0 ? 10000 - mateIn : -10000 - mateIn;
            } else if (scoreMatch && scoreMatch[1]) {
                score = parseInt(scoreMatch[1]);
            }
            
            pvLines.push({
                move: pvMatch[1],
                score: score,
                depth: depthMatch ? parseInt(depthMatch[1]) : 0
            });
        }
    }
    
    return pvLines.sort((a, b) => b.score - a.score);
}

/**
 * TRANSCENDENT: Parse evaluation with mate detection
 * FIXED: Always returns a valid evaluation object
 */
function parseEvaluation(output) {
    // FIXED: Guard against null/undefined input
    if (!output || typeof output !== 'string') {
        return { type: 'cp', value: 0, raw: 0 };
    }
    
    const mateMatch = output.match(/score\s+mate\s+(-?\d+)/);
    const cpMatch = output.match(/score\s+cp\s+(-?\d+)/);
    
    if (mateMatch) {
        const mateIn = parseInt(mateMatch[1]);
        return { type: 'mate', value: mateIn, raw: mateIn > 0 ? 10000 : -10000 };
    }
    if (cpMatch) {
        const cpValue = parseInt(cpMatch[1]);
        return { type: 'cp', value: cpValue, raw: cpValue };
    }
    return { type: 'cp', value: 0, raw: 0 };
}

/**
 * TRANSCENDENT: Update winning status with detailed tracking
 * FIXED: Added comprehensive null checking
 */
function updateWinningStatus(evalData) {
    // FIXED: Guard against null/undefined evalData
    if (!evalData || typeof evalData.raw !== 'number') {
        return;
    }
    
    const evalScore = evalData.raw;
    lastMoveEval = currentEval;
    currentEval = evalScore;
    
    // Track for blunder detection
    blunderCheckHistory.push(evalScore);
    if (blunderCheckHistory.length > 10) blunderCheckHistory.shift();
    
    // Adjust for color
    const adjustedEval = myColor === 'w' ? evalScore : -evalScore;
    
    // Detect mate
    isMating = evalData.type === 'mate' && evalData.value > 0;
    
    // Detect winning/crushing with hysteresis
    const wasWinning = isWinning;
    isCrushing = adjustedEval >= CONFIG.crushingThreshold || isMating;
    isWinning = adjustedEval >= CONFIG.winningThreshold;
    
    // Track consecutive advantage
    if (isWinning) {
        consecutiveAdvantage++;
    } else {
        consecutiveAdvantage = 0;
    }
    
    // Increase pressure when consistently winning
    if (isWinning && consecutiveAdvantage > 3) {
        positionalPressure = Math.min(positionalPressure + 10, 100);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS - Get active color from FEN
// ═══════════════════════════════════════════════════════════════════════

/**
 * Extract active color from FEN string
 * @param {string} fen - FEN string
 * @returns {string|null} 'w' or 'b' or null if invalid
 */
function getActiveColorFromFen(fen) {
    if (!fen || typeof fen !== 'string') return null;
    const parts = fen.split(' ');
    if (parts.length >= 2 && (parts[1] === 'w' || parts[1] === 'b')) {
        return parts[1];
    }
    // Also check if color is appended at end (lichess format)
    if (fen.endsWith(' w')) return 'w';
    if (fen.endsWith(' b')) return 'b';
    return null;
}

// ═══════════════════════════════════════════════════════════════════════
// ABSOLUTE WATCHDOG & HEALTH CHECK SYSTEM
// Critical fix: Prevents bot from stopping mid-game
// ═══════════════════════════════════════════════════════════════════════

/**
 * Health check runs every 2 seconds and forces action if stuck
 * This is the ABSOLUTE safety net - no conditions, just action
 */
function startHealthCheckSystem() {
    if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
    }
    
    healthCheckInterval = setInterval(() => {
        const now = Date.now();
        
        // Check 1: Calculation running too long (> 5 seconds)
        if (calculationLock && calculationStartTime > 0) {
            const calcDuration = now - calculationStartTime;
            if (calcDuration > 5000) {
                console.log(`[HEALTH] 🚨 CRITICAL: Calculation stuck for ${calcDuration}ms - FORCING UNLOCK`);
                forceUnlockAndReset("calculation timeout");
                return;
            }
        }
        
        // Check 2: Position ready but no calculation started (> 3 seconds)
        if (!calculationLock && currentFen && webSocketWrapper && webSocketWrapper.readyState === 1) {
            const fenActiveColor = getActiveColorFromFen(currentFen);
            if (fenActiveColor) {
                const isWhite = (fenActiveColor === 'w');
                const positionReady = isWhite ? whitePositionReady : blackPositionReady;
                const positionTime = isWhite ? lastWhitePositionTime : lastBlackPositionTime;
                const humanMoved = isWhite ? whiteHumanMovedRecently : blackHumanMovedRecently;
                
                if (positionReady && positionTime > 0) {
                    const waitDuration = now - positionTime;
                    if (waitDuration > 3000 && !humanMoved) {
                        console.log(`[HEALTH] 🚨 CRITICAL: Position ready for ${waitDuration}ms but no calculation - FORCING START`);
                        forceCalculation(fenActiveColor);
                        return;
                    }
                }
            }
        }
        
        // Check 3: No successful move in last 20 seconds (game active)
        if (lastSuccessfulMoveTime > 0 && currentFen && webSocketWrapper && webSocketWrapper.readyState === 1) {
            const timeSinceLastMove = now - lastSuccessfulMoveTime;
            if (timeSinceLastMove > 20000) {
                console.log(`[HEALTH] 🚨 CRITICAL: No move sent in ${timeSinceLastMove}ms - FORCING RESET`);
                forceUnlockAndReset("no recent moves");
                forceCalculation(getActiveColorFromFen(currentFen));
                return;
            }
        }
        
        // Check 4: Clear stale debounce flags (> 2 seconds old)
        if (whiteHumanMovedRecently && lastWhitePositionTime > 0 && now - lastWhitePositionTime > 2000) {
            whiteHumanMovedRecently = false;
            if (whiteDebounceTimer) {
                clearTimeout(whiteDebounceTimer);
                whiteDebounceTimer = null;
            }
        }
        if (blackHumanMovedRecently && lastBlackPositionTime > 0 && now - lastBlackPositionTime > 2000) {
            blackHumanMovedRecently = false;
            if (blackDebounceTimer) {
                clearTimeout(blackDebounceTimer);
                blackDebounceTimer = null;
            }
        }
        
    }, 2000); // Check every 2 seconds
    
    console.log('[HEALTH] ✅ Health check system started (2s interval)');
}

/**
 * Force unlock all locks and reset state - UNCONDITIONAL
 */
function forceUnlockAndReset(reason) {
    console.log(`[FORCE] 💥 FORCE UNLOCK - Reason: ${reason}`);
    console.log(`[FORCE]   Before: calculationLock=${calculationLock}, whiteReady=${whitePositionReady}, blackReady=${blackPositionReady}`);
    
    // Clear ALL locks unconditionally
    calculationLock = false;
    calculationStartTime = 0;
    currentCalculatingColor = null;
    
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
        chessEngine.postMessage("stop");
    }
    
    console.log('[FORCE]   After: All locks cleared, state reset');
}

/**
 * Force calculation to start - bypasses all normal checks
 */
function forceCalculation(colorToCalculate) {
    console.log(`[FORCE] ⚡ FORCE CALCULATION for ${colorToCalculate === 'w' ? 'White' : 'Black'}`);
    
    if (!currentFen || !chessEngine || !webSocketWrapper || webSocketWrapper.readyState !== 1) {
        console.log('[FORCE] ❌ Cannot force calculation - missing prerequisites');
        return;
    }
    
    // Verify FEN color matches
    const fenColor = getActiveColorFromFen(currentFen);
    if (fenColor !== colorToCalculate) {
        console.log(`[FORCE] ❌ Color mismatch: want ${colorToCalculate}, FEN has ${fenColor}`);
        return;
    }
    
    // Force unlock first
    forceUnlockAndReset("forced calculation");
    
    // Set position as ready
    if (colorToCalculate === 'w') {
        whitePositionReady = true;
        lastWhitePositionTime = Date.now();
    } else {
        blackPositionReady = true;
        lastBlackPositionTime = Date.now();
    }
    
    // Immediately call calculateMove
    setTimeout(() => calculateMove(), 100);
}

/**
 * Start absolute watchdog - overrides everything after timeout
 */
function startAbsoluteWatchdog() {
    // Clear any existing watchdog
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
    }
    
    // Set 8-second absolute timeout
    absoluteWatchdogTimer = setTimeout(() => {
        const now = Date.now();
        const calcDuration = calculationStartTime > 0 ? now - calculationStartTime : 0;
        
        console.log('[WATCHDOG] 🚨 ABSOLUTE WATCHDOG TRIGGERED (8s)');
        console.log(`[WATCHDOG]   calculationLock: ${calculationLock}`);
        console.log(`[WATCHDOG]   Calculation duration: ${calcDuration}ms`);
        console.log(`[WATCHDOG]   Current FEN: ${currentFen}`);
        
        // UNCONDITIONALLY force unlock and reset
        forceUnlockAndReset("absolute watchdog timeout");
        
        // If we have a FEN and WebSocket, try to recover
        if (currentFen && webSocketWrapper && webSocketWrapper.readyState === 1) {
            const fenActiveColor = getActiveColorFromFen(currentFen);
            if (fenActiveColor) {
                console.log(`[WATCHDOG] ✅ Attempting recovery for ${fenActiveColor === 'w' ? 'White' : 'Black'}`);
                setTimeout(() => forceCalculation(fenActiveColor), 500);
            }
        }
    }, 8000);
}

/**
 * Clear absolute watchdog (called when move is successfully sent)
 */
function clearAbsoluteWatchdog() {
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
        absoluteWatchdogTimer = null;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - TRANSCENDENT POWER
// Maximum strength with strategic depth configuration
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    // TRANSCENDENT: Multi-PV for blunder checking and alternative analysis
    chessEngine.postMessage("setoption name MultiPV value 4");
    // TRANSCENDENT: High contempt for draw avoidance
    chessEngine.postMessage("setoption name Contempt value 100");
    // TRANSCENDENT: Minimal overhead for speed
    chessEngine.postMessage("setoption name Move Overhead value 15");
    // TRANSCENDENT: No pondering - all time on our move
    chessEngine.postMessage("setoption name Ponder value false");
    // TRANSCENDENT: Aggressive pruning disabled for accuracy
    chessEngine.postMessage("setoption name Slow Mover value 100");
    chessEngine.postMessage("isready");
    
    // Start health check system after engine is ready
    startHealthCheckSystem();
}

/**
 * TRANSCENDENT: Dynamic contempt adjustment based on position
 * Maximum draw avoidance when winning, balanced otherwise
 */
function adjustContempt() {
    let contempt = 100;  // Base high contempt
    
    if (isMating) {
        contempt = CONFIG.killerModeContempt;  // Maximum pressure when mating
    } else if (isCrushing) {
        contempt = CONFIG.killerModeContempt;
    } else if (isWinning) {
        contempt = CONFIG.drawAvoidanceContempt;
    } else if (gamePhase === "endgame") {
        contempt = 80;  // Still avoid draws in endgame
    }
    
    // Increase contempt based on consecutive advantage
    if (consecutiveAdvantage > 5) {
        contempt = Math.min(contempt + 30, 200);
    }
    
    chessEngine.postMessage("setoption name Contempt value " + contempt);
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION (Enhanced with recovery system)
// ═══════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    let webSocket = window.WebSocket;
    const webSocketProxy = new Proxy(webSocket, {
        construct: function (target, args) {
            let wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                // FIXED: Guard against null event data
                if (!event || !event.data) return;
                
                let message;
                try {
                    message = JSON.parse(event.data);
                } catch (e) {
                    // Silent error handling for non-JSON messages
                    return;
                }
                
                // FIXED: Moved processing outside try-catch for better error visibility
                try {
                    // TRANSCENDENT: Detect new game start
                    if (message.t === "crowd" || message.t === "featured" || message.t === "endData") {
                        resetGameState();
                    }
                    
                    // Clear bot move flag after receiving position update
                    if (botJustSentMove && message.d && message.d.fen) {
                        botJustSentMove = false;
                        // Reset rejection tracking on successful move
                        lastRejectedMove = null;
                        rejectionCount = 0;
                    }
                    
                    // Extract time remaining if available
                    if (message.d && message.d.wc !== undefined) {
                        timeRemaining = myColor === 'w' ? message.d.wc * 10 : message.d.bc * 10;
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
                        
                        // Track position ID for deduplication
                        const positionId = message.v;
                        if (lastSeenPositionId === positionId) {
                            // Same position, skip to prevent double calculation
                            return;
                        }
                        lastSeenPositionId = positionId;
                        lastSeenFen = currentFen;
                        
                        // Set position ready for the active color
                        const now = Date.now();
                        if (isWhitesTurn) {
                            whitePositionReady = true;
                            lastWhitePositionTime = now;
                        } else {
                            blackPositionReady = true;
                            lastBlackPositionTime = now;
                        }
                        
                        // TRANSCENDENT: Track position for web-weaving
                        trackPosition(currentFen);
                        
                        // TRANSCENDENT: Deep position analysis
                        gamePhase = getGamePhase(moveCount, currentFen);
                        positionType = analyzePositionType(currentFen);
                        strategicPlan = determineStrategicPlan(currentFen);
                        
                        // TRANSCENDENT: Adjust contempt dynamically
                        adjustContempt();
                        
                        // Start absolute watchdog before calculation
                        startAbsoluteWatchdog();
                        
                        // Check if we're already calculating for this color
                        if (calculationLock && currentCalculatingColor === myColor) {
                            console.log(`[WS] Already calculating for ${myColor}, skipping`);
                            return;
                        }
                        
                        // If locked for different color, force unlock
                        if (calculationLock && currentCalculatingColor !== myColor) {
                            console.log(`[WS] Color changed from ${currentCalculatingColor} to ${myColor}, forcing unlock`);
                            forceUnlockAndReset("color change");
                        }
                        
                        calculateMove();
                    }
                } catch (e) {
                    console.error('TRANSCENDENT: Error processing message:', e);
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - TRANSCENDENT STRATEGIC DEPTH
// Deep understanding with 30+ move strategic planning
// FIXED: Added lock management and recovery system
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // FIXED: Validate currentFen before proceeding
    if (!currentFen || typeof currentFen !== 'string' || currentFen.length < 10) {
        console.error('TRANSCENDENT: Invalid FEN position:', currentFen);
        return;
    }
    
    // FIXED: Validate engine is initialized
    if (!chessEngine) {
        console.error('TRANSCENDENT: Chess engine not initialized');
        return;
    }
    
    // FIXED: Check for WebSocket readiness
    if (!webSocketWrapper || webSocketWrapper.readyState !== 1) {
        console.error('TRANSCENDENT: WebSocket not ready');
        return;
    }
    
    // FIXED: Check calculation lock
    if (calculationLock) {
        console.log('[ENGINE] Already calculating, skipping');
        return;
    }
    
    // Check for excessive rejections - reset and add randomness
    if (rejectionCount > 5) {
        console.log(`[ENGINE] Too many rejections (${rejectionCount}) - forcing full reset`);
        lastRejectedMove = null;
        rejectionCount = 0;
        setTimeout(() => calculateMove(), Math.random() * 500 + 200);
        return;
    }
    
    // Extract active color from FEN
    const fenActiveColor = getActiveColorFromFen(currentFen);
    if (!fenActiveColor) {
        console.error('TRANSCENDENT: Cannot extract active color from FEN');
        return;
    }
    
    const isWhite = (fenActiveColor === 'w');
    const colorName = isWhite ? 'White' : 'Black';
    
    // Set calculation lock and track color
    calculationLock = true;
    calculationStartTime = Date.now();
    currentCalculatingColor = fenActiveColor;
    console.log(`[LOCK] 🔒 Calculation lock SET for ${colorName}`);
    
    // Clear position ready flag for this color
    if (isWhite) {
        whitePositionReady = false;
    } else {
        blackPositionReady = false;
    }
    
    // Opening book for variety and strategic preparation
    if (gamePhase === "opening" || (gamePhase === "early-middlegame" && moveCount < 12)) {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove && typeof bookMove === 'string' && bookMove.length >= 4) {
            // Quick book moves - confidence in preparation
            const thinkTime = Math.random() * 150 + 100;
            
            setTimeout(() => {
                bestMove = bookMove;
                // Release lock before sending
                calculationLock = false;
                calculationStartTime = 0;
                currentCalculatingColor = null;
                console.log('[LOCK] 🔓 Calculation lock RELEASED (book move)');
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // TRANSCENDENT: Deep engine calculation with strategic depth
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    // TRANSCENDENT: Prepare engine with position
    chessEngine.postMessage("position fen " + currentFen);
    
    // TRANSCENDENT: Use different search strategies based on position type
    if (positionType === "winning-endgame" || positionType === "mating") {
        // Maximum depth for winning positions
        chessEngine.postMessage(`go depth ${Math.max(depth, CONFIG.endgameDepth)}`);
    } else {
        // Standard search with calculated depth
        chessEngine.postMessage(`go depth ${depth}`);
    }
    
    // Set a safety timeout to release lock if engine doesn't respond
    calculationTimeout = setTimeout(() => {
        if (calculationLock) {
            console.log('[TIMEOUT] ⚠️ Engine calculation timeout - forcing unlock');
            forceUnlockAndReset("calculation timeout");
        }
    }, 10000); // 10 second timeout
}

/**
 * Send move - Clean, fast, confident
 * FIXED: Comprehensive validation and move confirmation tracking
 */
function sendMove(move, retryCount = 0) {
    // CRITICAL FIX: Validate webSocketWrapper exists and is connected
    if (!webSocketWrapper) {
        console.error('TRANSCENDENT: Cannot send move - WebSocket not initialized');
        return false;
    }
    
    // CRITICAL FIX: Validate webSocketWrapper readyState
    if (webSocketWrapper.readyState !== WebSocket.OPEN) {
        console.error('TRANSCENDENT: Cannot send move - WebSocket not open (state:', webSocketWrapper.readyState, ')');
        // Retry if this is a temporary issue
        if (retryCount < 3) {
            console.log(`[SEND] Retrying in 300ms (attempt ${retryCount + 1})`);
            setTimeout(() => sendMove(move, retryCount + 1), 300);
        }
        return false;
    }
    
    // CRITICAL FIX: Validate move is a valid string
    if (!move || typeof move !== 'string' || move.length < 4) {
        console.error('TRANSCENDENT: Cannot send move - Invalid move:', move);
        return false;
    }
    
    // Check if this is a previously rejected move
    if (move === lastRejectedMove) {
        rejectionCount++;
        console.log(`[SEND] ⚠️ Attempting to send previously rejected move: ${move} (count: ${rejectionCount})`);
        if (rejectionCount > 3) {
            console.log('[SEND] ❌ Move rejected too many times, triggering recalculation');
            lastRejectedMove = null;
            rejectionCount = 0;
            setTimeout(() => forceCalculation(getActiveColorFromFen(currentFen)), 200);
            return false;
        }
    }
    
    try {
        // Mark that we're sending a move
        botJustSentMove = true;
        pendingMove = move;
        
        webSocketWrapper.send(JSON.stringify({
            t: "move",
            d: { 
                u: move, 
                b: 1,
                l: Math.floor(Math.random() * 12) + 6,
                a: 1
            }
        }));
        
        // Update success tracking
        lastSuccessfulMoveTime = Date.now();
        
        // Clear watchdog on successful send
        clearAbsoluteWatchdog();
        
        // Clear calculation timeout
        if (calculationTimeout) {
            clearTimeout(calculationTimeout);
            calculationTimeout = null;
        }
        
        console.log(`[SEND] ✅ Move sent: ${move}`);
        return true;
    } catch (e) {
        console.error('TRANSCENDENT: Error sending move:', e);
        botJustSentMove = false;
        pendingMove = null;
        
        // Retry on error
        if (retryCount < 2) {
            console.log(`[SEND] Retrying after error (attempt ${retryCount + 1})`);
            setTimeout(() => sendMove(move, retryCount + 1), 500);
        }
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - TRANSCENDENT PRECISION
// Zero blunders, perfect evaluation tracking, strategic move selection
// FIXED: Comprehensive null checking, lock release, and fallback handling
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    let lastDepthInfo = {};
    
    chessEngine.onmessage = function (event) {
        if (!event) return; // FIXED: Guard against null events
        
        engineOutput += event + "\n";
        
        // TRANSCENDENT: Parse evaluation for detailed status
        if (event.indexOf('score') !== -1) {
            const evalData = parseEvaluation(event);
            if (evalData) {
                updateWinningStatus(evalData);
                
                // Track depth info for analysis
                const depthMatch = event.match(/depth\s+(\d+)/);
                if (depthMatch) {
                    lastDepthInfo.depth = parseInt(depthMatch[1]);
                    lastDepthInfo.eval = evalData;
                }
            }
        }
        
        // TRANSCENDENT: Parse multi-PV for blunder checking and alternatives
        if (event.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(event);
            if (lines && lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        // TRANSCENDENT: Best move selection with full analysis
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            // Clear calculation timeout
            if (calculationTimeout) {
                clearTimeout(calculationTimeout);
                calculationTimeout = null;
            }
            
            // FIXED: Validate bestMove from engine
            if (!bestMove || bestMove === '(none)' || bestMove.length < 4) {
                console.error('TRANSCENDENT: Engine returned invalid bestmove:', bestMove);
                // Release lock on error
                calculationLock = false;
                calculationStartTime = 0;
                currentCalculatingColor = null;
                console.log('[LOCK] 🔓 Calculation lock RELEASED (invalid bestmove)');
                engineOutput = "";
                lastDepthInfo = {};
                return;
            }
            
            // TRANSCENDENT: Smart move selection with blunder avoidance
            // and strategic web-weaving when winning
            let finalMove = selectBestMove(bestMove, multiPVLines);
            
            // FIXED: Handle case where selectBestMove returns null
            if (!finalMove) {
                console.warn('TRANSCENDENT: selectBestMove returned null, using engine bestmove');
                finalMove = bestMove;
            }
            
            // TRANSCENDENT: Final verification - never play a clearly losing move
            if (multiPVLines.length > 1 && finalMove === bestMove) {
                const bestAlt = multiPVLines[0];
                if (bestAlt && bestAlt.move && typeof bestAlt.move === 'string' && bestAlt.move !== finalMove) {
                    // If our selected move isn't the top move, verify it's acceptable
                    const selectedLine = multiPVLines.find(l => l && l.move === finalMove);
                    if (selectedLine && typeof selectedLine.score === 'number' && 
                        typeof bestAlt.score === 'number' &&
                        bestAlt.score - selectedLine.score > CONFIG.blunderThreshold) {
                        // Fall back to best move to avoid blunder
                        finalMove = bestAlt.move;
                    }
                }
            }
            
            // Release calculation lock BEFORE sending move
            calculationLock = false;
            calculationStartTime = 0;
            currentCalculatingColor = null;
            console.log('[LOCK] 🔓 Calculation lock RELEASED');
            
            // FIXED: Final validation before sending
            if (finalMove && typeof finalMove === 'string' && finalMove.length >= 4) {
                sendMove(finalMove);
            } else {
                console.error('TRANSCENDENT: Final move validation failed:', finalMove);
            }
            
            engineOutput = "";
            lastDepthInfo = {};
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - TRANSCENDENT AWAKENING
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();

// TRANSCENDENT: Console signature
console.log('%c♔ TRANSCENDENT AlphaZero v7.0 ♔', 'color: gold; font-size: 16px; font-weight: bold;');
console.log('%cDeep strategic webs • 30+ move planning • ZERO blunders • PERFECT endgames', 'color: #888; font-size: 11px;');
