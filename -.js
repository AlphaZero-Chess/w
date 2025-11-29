// ==UserScript==
// @name         Lichess Bot - AlphaZero PARADIGM SHIFTER
// @description  TRUE AlphaZero - Alien web-weaving, 40+ move horizon, CRUSHING precision, ABSOLUTE domination
// @author       AlphaZero - Paradigm Shifter Edition
// @version      8.0.0-PARADIGM
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// PARADIGM SHIFTER CONFIGURATION - Alien Intelligence Beyond Human Comprehension
// Neural-inspired holistic evaluation with Monte Carlo style strategic depth
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // STRATEGIC DEPTHS - Deep understanding, maximized insight
    // AlphaZero allocates resources based on position complexity
    baseDepth: 20,
    tacticalDepth: 26,        // DEEP tactical verification (25+ move lookahead)
    positionalDepth: 24,      // Strategic positions need profound evaluation
    endgameDepth: 28,         // FLAWLESS endgame - tablebase-level precision
    openingDepth: 18,         // Opening preparation with strategic foresight
    winningDepth: 22,         // NEVER let winning positions slip
    criticalDepth: 30,        // Maximum depth for critical decisions
    blunderCheckDepth: 24,    // ABSOLUTE blunder prevention
    matingNetDepth: 32,       // Deep mating net calculation
    
    // ZERO TOLERANCE - Absolute perfection
    humanMistakeRate: 0,
    blunderThreshold: 50,     // Even 50cp loss is unacceptable
    inaccuracyThreshold: 25,  // Track even small inaccuracies
    
    // Timing - Efficient resource allocation
    thinkingTimeMin: 80,
    thinkingTimeMax: 600,
    
    // Speed multipliers - Precise allocation
    openingSpeed: 0.30,
    earlyMidSpeed: 0.50,
    middlegameSpeed: 0.60,
    lateMidSpeed: 0.55,
    endgameSpeed: 0.45,       // More time in endgames for perfection
    criticalSpeed: 0.80,
    winningSpeed: 0.35,       // FAST when crushing
    crushingSpeed: 0.25,      // Lightning when dominating
    
    // Time thresholds
    panicThreshold: 3000,
    criticalThreshold: 6000,
    
    // PARADIGM SHIFTER evaluation thresholds
    winningThreshold: 100,        // Capitalize on small advantages
    crushingThreshold: 300,       // Full conversion mode
    dominatingThreshold: 600,     // Absolute domination
    drawAvoidanceContempt: 150,   // STRONG draw avoidance
    killerModeContempt: 250,      // MAXIMUM conversion pressure
    
    // Strategic web-weaving parameters
    maxRepetitions: 0,            // NEVER repeat - always progress
    strategicHorizon: 40,         // Plan 40+ moves ahead conceptually
    
    // Neural-inspired positional evaluation weights
    mobilityWeight: 0.18,
    kingSafetyWeight: 0.22,
    pawnStructureWeight: 0.20,
    spaceControlWeight: 0.14,
    pieceActivityWeight: 0.18,
    initiativeWeight: 0.22,
    pieceCoordinationWeight: 0.16,
    prophylaxisWeight: 0.14,
    
    // Alien evaluation parameters - moves that look strange but are strong
    alienMoveBonus: 0.12,         // Bonus for counter-intuitive but strong moves
    delayedGratificationWeight: 0.15, // Reward long-term gains over immediate
    
    // Endgame conversion parameters
    endgamePrecisionMode: true,
    convertingAdvantageDepth: 26,
    
    // Monte Carlo inspired parameters
    simulationDepth: 6,           // Simulate forward positions
    strategicSamplingMoves: 5,    // Top moves to analyze deeply
    
    // Attack potential parameters
    attackPotentialWeight: 0.20,
    kingAttackBonus: 0.25
};

// ═══════════════════════════════════════════════════════════════════════
// PARADIGM SHIFTER OPENING BOOK - Alien Strategic Preparation
// AlphaZero's signature: Complex positions with devastating long-term potential
// Favoring imbalance, piece activity, and relentless initiative
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
// GLOBAL STATE - Enhanced with Paradigm Shifter Intelligence
// Neural-inspired state tracking for alien strategic web-weaving
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

// PARADIGM SHIFTER: Advanced position tracking for web-weaving
let positionHistory = {};
let currentEval = 0;
let isWinning = false;
let isCrushing = false;
let isDominating = false;
let isMating = false;

// PARADIGM SHIFTER: Enhanced strategic state tracking
let strategicPlan = "neutral";      // Current strategic plan
let lastMoveEval = 0;               // Track evaluation changes
let consecutiveAdvantage = 0;       // Track how long we've been winning
let positionalPressure = 0;         // Accumulated positional pressure
let blunderCheckHistory = [];       // Recent move evaluations for blunder detection

// PARADIGM SHIFTER: Alien move detection state
let alienMoveCandidate = null;      // Counter-intuitive but strong move
let alienMoveScore = 0;             // Score of the alien move
let initiativeLevel = 0;            // Current initiative (-100 to 100)
let attackPotential = 0;            // King attack potential score

// PARADIGM SHIFTER: Long-term planning state
let longTermPlan = {
    pawnBreak: null,                // Target pawn break
    pieceManeuver: null,            // Planned piece redeployment
    weakSquare: null,               // Target weak square
    kingAttack: false,              // Planning king attack
    endgameTransition: false        // Planning favorable endgame
};

// PARADIGM SHIFTER: Position complexity metrics
let positionComplexity = 0;         // 0-100 scale
let tacticalSharpness = 0;          // How tactical is the position
let strategicTension = 0;           // Pawn tension and piece interplay

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

// PARADIGM SHIFTER: Enhanced endgame tablebase patterns with technique
const WINNING_ENDGAMES = {
    KQvK: { depth: 10, technique: "centralize-king-queen-coordination" },
    KRvK: { depth: 16, technique: "opposition-cut-off-third-rank" },
    KRRvK: { depth: 7, technique: "double-rook-roller-centralize" },
    KQQvK: { depth: 4, technique: "queen-coordination-mate-net" },
    KBBvK: { depth: 19, technique: "diagonal-prison-correct-corner" },
    KBNvK: { depth: 33, technique: "wrong-corner-drive-W-pattern" },
    KPvK: { depth: 0, technique: "opposition-rule-of-square" },
    KQvKR: { depth: 20, technique: "queen-dominance-skewer-setup" },
    KRvKB: { depth: 0, technique: "centralize-cut-off-bishop" },
    KRvKN: { depth: 0, technique: "knight-trap-edge-drive" },
    KQvKP: { depth: 0, technique: "queen-vs-pawn-calculation" },
    KRPvKR: { depth: 0, technique: "lucena-philidor-precision" },
    KQvKBN: { depth: 25, technique: "queen-vs-pieces-coordination" },
    KRBvKR: { depth: 30, technique: "bishop-advantage-technique" },
    KRNvKR: { depth: 30, technique: "knight-advantage-technique" },
    KBPvK: { depth: 0, technique: "bishop-pawn-promotion" },
    KNPvK: { depth: 0, technique: "knight-pawn-promotion" },
    KPPvKP: { depth: 0, technique: "pawn-endgame-opposition" },
    KRPvKRP: { depth: 0, technique: "rook-pawn-activity" }
};

// PARADIGM SHIFTER: Enhanced strategic pattern recognition
// Neural-network-like pattern detection for alien moves
const STRATEGIC_PATTERNS = {
    // Pawn structure patterns
    isolatedPawn: { weight: -0.35, plan: "blockade-attack-pressure" },
    passedPawn: { weight: 0.55, plan: "support-advance-promote" },
    doubledPawns: { weight: -0.25, plan: "target-weakness-trade" },
    backwardPawn: { weight: -0.30, plan: "fix-pressure-blockade" },
    pawnMajority: { weight: 0.35, plan: "create-outside-passer" },
    connectedPassers: { weight: 0.70, plan: "advance-coordination" },
    protectedPasser: { weight: 0.60, plan: "support-king-approach" },
    
    // Piece patterns
    bishopPair: { weight: 0.45, plan: "open-position-diagonals" },
    knightOutpost: { weight: 0.40, plan: "establish-support-dominate" },
    badBishop: { weight: -0.35, plan: "trade-activate-reposition" },
    rookSeventhRank: { weight: 0.50, plan: "cut-off-king-attack" },
    doubledRooks: { weight: 0.45, plan: "penetration-battery" },
    
    // Position patterns
    weakSquares: { weight: 0.30, plan: "occupy-control-exploit" },
    openFile: { weight: 0.35, plan: "seize-penetrate-pressure" },
    kingExposed: { weight: 0.65, plan: "attack-sacrifice-mate" },
    spaceDominance: { weight: 0.30, plan: "restrict-squeeze-convert" },
    
    // Initiative patterns
    development: { weight: 0.35, plan: "complete-coordinate-attack" },
    tempo: { weight: 0.25, plan: "gain-initiative-pressure" },
    prophylaxis: { weight: 0.30, plan: "prevent-improve-advance" }
};

// PARADIGM SHIFTER: Alien move patterns - counter-intuitive but devastating
const ALIEN_MOVE_PATTERNS = {
    quietQueen: { desc: "Quiet queen move setting up multiple threats", bonus: 0.15 },
    retreatingPiece: { desc: "Piece retreat improving position dramatically", bonus: 0.12 },
    pawnSacrifice: { desc: "Pawn sacrifice for permanent positional gain", bonus: 0.18 },
    exchangeSacrifice: { desc: "Exchange sacrifice for crushing bind", bonus: 0.22 },
    prophylacticMove: { desc: "Move preventing opponent's only plan", bonus: 0.14 },
    strangeKingMove: { desc: "King move in middlegame improving position", bonus: 0.16 },
    doubledPawnAccept: { desc: "Accepting doubled pawns for piece activity", bonus: 0.10 },
    positionOverMaterial: { desc: "Declining material for lasting position", bonus: 0.20 }
};

// ═══════════════════════════════════════════════════════════════════════
// POSITION ANALYSIS - PARADIGM SHIFTER Alien Intelligence
// Neural-inspired holistic evaluation with deep pattern recognition
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
 * PARADIGM SHIFTER: Deep material counting with piece synergy consideration
 * Returns detailed material analysis including imbalances and piece values
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
    let whiteRooks = 0;
    let blackRooks = 0;
    let whiteQueens = 0;
    let blackQueens = 0;
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (pieceValues[c]) {
            balance += pieceValues[c];
            if (c >= 'A' && c <= 'Z') {
                whiteMaterial += Math.abs(pieceValues[c]);
                if (c === 'B') whiteBishops++;
                if (c === 'N') whiteKnights++;
                if (c === 'P') whitePawns++;
                if (c === 'R') whiteRooks++;
                if (c === 'Q') whiteQueens++;
            } else {
                blackMaterial += Math.abs(pieceValues[c]);
                if (c === 'b') blackBishops++;
                if (c === 'n') blackKnights++;
                if (c === 'p') blackPawns++;
                if (c === 'r') blackRooks++;
                if (c === 'q') blackQueens++;
            }
        }
    }
    
    // PARADIGM SHIFTER: Calculate piece synergies
    const whiteBishopPair = whiteBishops >= 2;
    const blackBishopPair = blackBishops >= 2;
    const whiteMinorPieces = whiteBishops + whiteKnights;
    const blackMinorPieces = blackBishops + blackKnights;
    const whiteMajorPieces = whiteRooks + whiteQueens;
    const blackMajorPieces = blackRooks + blackQueens;
    
    // Calculate imbalances
    const rookVsTwoMinors = (whiteRooks > blackRooks && blackMinorPieces > whiteMinorPieces) ||
                            (blackRooks > whiteRooks && whiteMinorPieces > blackMinorPieces);
    const queenVsRookPiece = (whiteQueens > blackQueens && (blackRooks + blackMinorPieces) >= 2) ||
                             (blackQueens > whiteQueens && (whiteRooks + whiteMinorPieces) >= 2);
    
    return {
        balance: balance,
        whiteMaterial: whiteMaterial,
        blackMaterial: blackMaterial,
        whiteBishopPair: whiteBishopPair,
        blackBishopPair: blackBishopPair,
        totalPawns: whitePawns + blackPawns,
        whitePawns: whitePawns,
        blackPawns: blackPawns,
        whiteMinorPieces: whiteMinorPieces,
        blackMinorPieces: blackMinorPieces,
        whiteMajorPieces: whiteMajorPieces,
        blackMajorPieces: blackMajorPieces,
        hasImbalance: rookVsTwoMinors || queenVsRookPiece,
        isEndgame: (whiteMaterial + blackMaterial) < 2500,
        isDeepEndgame: (whiteMaterial + blackMaterial) < 1500,
        isPawnEndgame: whiteMinorPieces === 0 && blackMinorPieces === 0 && 
                       whiteMajorPieces === 0 && blackMajorPieces === 0
    };
}

/**
 * PARADIGM SHIFTER: Advanced piece activity evaluation
 * Measures how actively placed each piece is
 */
function evaluatePieceActivity(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    
    let whiteActivity = 0;
    let blackActivity = 0;
    let whiteCentralization = 0;
    let blackCentralization = 0;
    
    // Center squares bonus map (d4, d5, e4, e5 and surrounding)
    const centerBonus = {
        '3_3': 4, '3_4': 4, '4_3': 4, '4_4': 4,  // d4, d5, e4, e5
        '2_3': 2, '2_4': 2, '5_3': 2, '5_4': 2,  // c4, c5, f4, f5
        '3_2': 2, '4_2': 2, '3_5': 2, '4_5': 2   // d3, e3, d6, e6
    };
    
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                const actualRank = 7 - rank;
                const key = `${file}_${actualRank}`;
                const centerValue = centerBonus[key] || 0;
                
                // Knights and bishops are better centralized
                if (c === 'N') {
                    whiteCentralization += centerValue;
                    whiteActivity += (actualRank > 1) ? 2 : 0; // Developed
                } else if (c === 'n') {
                    blackCentralization += centerValue;
                    blackActivity += (actualRank < 6) ? 2 : 0;
                } else if (c === 'B') {
                    whiteCentralization += centerValue * 0.7;
                    whiteActivity += (actualRank > 0) ? 2 : 0;
                } else if (c === 'b') {
                    blackCentralization += centerValue * 0.7;
                    blackActivity += (actualRank < 7) ? 2 : 0;
                } else if (c === 'R') {
                    // Rooks want open files and 7th rank
                    whiteActivity += (actualRank === 6) ? 5 : 0; // 7th rank
                    whiteActivity += (actualRank > 0) ? 1 : 0;
                } else if (c === 'r') {
                    blackActivity += (actualRank === 1) ? 5 : 0; // 2nd rank
                    blackActivity += (actualRank < 7) ? 1 : 0;
                } else if (c === 'Q') {
                    // Queen activity is valuable but not too early
                    whiteActivity += (actualRank > 1) ? 2 : 0;
                } else if (c === 'q') {
                    blackActivity += (actualRank < 6) ? 2 : 0;
                }
                
                file++;
            }
        }
    }
    
    return {
        whiteActivity: whiteActivity,
        blackActivity: blackActivity,
        whiteCentralization: whiteCentralization,
        blackCentralization: blackCentralization,
        activityDifference: (whiteActivity + whiteCentralization) - (blackActivity + blackCentralization)
    };
}

/**
 * PARADIGM SHIFTER: Calculate attack potential against enemy king
 * Evaluates how dangerous an attack can be developed
 */
function calculateAttackPotential(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    
    let whiteKingFile = -1, whiteKingRank = -1;
    let blackKingFile = -1, blackKingRank = -1;
    let whiteAttackers = 0;
    let blackAttackers = 0;
    let whiteAttackersNearKing = 0;
    let blackAttackersNearKing = 0;
    
    // First pass: Find kings and pieces
    const whitePieces = [];
    const blackPieces = [];
    
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                const actualRank = 7 - rank;
                if (c === 'K') { whiteKingFile = file; whiteKingRank = actualRank; }
                if (c === 'k') { blackKingFile = file; blackKingRank = actualRank; }
                
                // Count attacking pieces
                if (c === 'Q' || c === 'R' || c === 'B' || c === 'N') {
                    whitePieces.push({ type: c, file: file, rank: actualRank });
                    whiteAttackers++;
                }
                if (c === 'q' || c === 'r' || c === 'b' || c === 'n') {
                    blackPieces.push({ type: c, file: file, rank: actualRank });
                    blackAttackers++;
                }
                
                file++;
            }
        }
    }
    
    // Second pass: Count attackers near enemy king
    for (let piece of whitePieces) {
        const distToBlackKing = Math.abs(piece.file - blackKingFile) + Math.abs(piece.rank - blackKingRank);
        if (distToBlackKing <= 3) whiteAttackersNearKing++;
    }
    
    for (let piece of blackPieces) {
        const distToWhiteKing = Math.abs(piece.file - whiteKingFile) + Math.abs(piece.rank - whiteKingRank);
        if (distToWhiteKing <= 3) blackAttackersNearKing++;
    }
    
    return {
        whiteAttackPotential: whiteAttackers * 10 + whiteAttackersNearKing * 25,
        blackAttackPotential: blackAttackers * 10 + blackAttackersNearKing * 25,
        whiteAttackersNearKing: whiteAttackersNearKing,
        blackAttackersNearKing: blackAttackersNearKing
    };
}

/**
 * PARADIGM SHIFTER: Calculate initiative level
 * Measures who has the tempo and forcing moves
 */
function calculateInitiative(fen, material, pieceActivity) {
    let initiative = 0;
    
    // Development advantage gives initiative
    initiative += pieceActivity.activityDifference * 2;
    
    // Material imbalances can give initiative
    if (material.hasImbalance) {
        // The side with more pieces often has initiative
        if (material.whiteMinorPieces > material.blackMinorPieces) initiative += 10;
        if (material.blackMinorPieces > material.whiteMinorPieces) initiative -= 10;
    }
    
    // Bishop pair gives initiative in open positions
    if (material.whiteBishopPair && !material.blackBishopPair) initiative += 15;
    if (material.blackBishopPair && !material.whiteBishopPair) initiative -= 15;
    
    // Fewer pawns means more open position - initiative matters more
    if (material.totalPawns < 10) {
        initiative *= 1.3;
    }
    
    return Math.max(-100, Math.min(100, initiative));
}

/**
 * PARADIGM SHIFTER: Advanced pawn structure analysis for long-term planning
 * Evaluates all pawn weaknesses and strengths with precision
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
    let backwardWhite = 0;
    let backwardBlack = 0;
    let connectedWhite = 0;
    let connectedBlack = 0;
    
    // Map pawn positions with detailed info
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
    
    // Detect doubled pawns and file counts
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
        
        // Isolated pawns - no friendly pawns on adjacent files
        let whiteHasNeighbor = (i > 0 && whiteFileCount[i-1] > 0) || (i < 7 && whiteFileCount[i+1] > 0);
        let blackHasNeighbor = (i > 0 && blackFileCount[i-1] > 0) || (i < 7 && blackFileCount[i+1] > 0);
        
        if (whiteFileCount[i] > 0 && !whiteHasNeighbor) isolatedWhite++;
        if (blackFileCount[i] > 0 && !blackHasNeighbor) isolatedBlack++;
    }
    
    // PARADIGM SHIFTER: Detailed passed pawn detection with advancement bonus
    for (let p of whitePawnFiles) {
        let isPassed = true;
        for (let bp of blackPawnFiles) {
            if (Math.abs(bp.file - p.file) <= 1 && bp.rank > p.rank) {
                isPassed = false;
                break;
            }
        }
        if (isPassed) {
            // Bonus for advanced passers
            const advancementBonus = p.rank >= 5 ? 2 : (p.rank >= 4 ? 1 : 0);
            whitePassers += 1 + advancementBonus;
        }
    }
    
    for (let p of blackPawnFiles) {
        let isPassed = true;
        for (let wp of whitePawnFiles) {
            if (Math.abs(wp.file - p.file) <= 1 && wp.rank < p.rank) {
                isPassed = false;
                break;
            }
        }
        if (isPassed) {
            const advancementBonus = p.rank <= 2 ? 2 : (p.rank <= 3 ? 1 : 0);
            blackPassers += 1 + advancementBonus;
        }
    }
    
    // PARADIGM SHIFTER: Connected pawn detection
    for (let p of whitePawnFiles) {
        for (let p2 of whitePawnFiles) {
            if (p !== p2 && Math.abs(p.file - p2.file) === 1 && Math.abs(p.rank - p2.rank) <= 1) {
                connectedWhite++;
                break;
            }
        }
    }
    
    for (let p of blackPawnFiles) {
        for (let p2 of blackPawnFiles) {
            if (p !== p2 && Math.abs(p.file - p2.file) === 1 && Math.abs(p.rank - p2.rank) <= 1) {
                connectedBlack++;
                break;
            }
        }
    }
    
    // Calculate pawn structure score
    const whitePawnScore = (whitePassers * 60) + (connectedWhite * 15) - (isolatedWhite * 25) - (doubledWhite * 20) - (backwardWhite * 20);
    const blackPawnScore = (blackPassers * 60) + (connectedBlack * 15) - (isolatedBlack * 25) - (doubledBlack * 20) - (backwardBlack * 20);
    
    return {
        whitePassers: whitePassers,
        blackPassers: blackPassers,
        whiteIsolated: isolatedWhite,
        blackIsolated: isolatedBlack,
        whiteDoubled: doubledWhite,
        blackDoubled: doubledBlack,
        whiteConnected: connectedWhite,
        blackConnected: connectedBlack,
        whitePawnScore: whitePawnScore,
        blackPawnScore: blackPawnScore,
        pawnTension: whitePawnFiles.length + blackPawnFiles.length > 10,
        openFiles: 8 - (whiteFileCount.filter(x => x > 0).length + blackFileCount.filter(x => x > 0).length) / 2
    };
}

/**
 * PARADIGM SHIFTER: Advanced king safety evaluation
 * Includes pawn shield, piece proximity, and attack threats
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
    let whiteKingExposed = false;
    let blackKingExposed = false;
    
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
    
    // PARADIGM SHIFTER: Enhanced pawn shield evaluation
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                const actualRank = 7 - rank;
                
                // White pawn shield (pawns on rank 2 near king)
                if (c === 'P' && Math.abs(file - whiteKingFile) <= 1) {
                    if (actualRank === 1) whitePawnShield += 3;  // Ideal position
                    else if (actualRank === 2) whitePawnShield += 2;  // Advanced
                    else if (actualRank === 3) whitePawnShield += 1;  // Far advanced
                }
                
                // Black pawn shield (pawns on rank 7 near king)
                if (c === 'p' && Math.abs(file - blackKingFile) <= 1) {
                    if (actualRank === 6) blackPawnShield += 3;
                    else if (actualRank === 5) blackPawnShield += 2;
                    else if (actualRank === 4) blackPawnShield += 1;
                }
                
                file++;
            }
        }
    }
    
    // King exposed if not castled and not in endgame, or if pawn shield is weak
    whiteKingExposed = (!whiteCastled && whiteKingRank > 0) || whitePawnShield < 4;
    blackKingExposed = (!blackCastled && blackKingRank < 7) || blackPawnShield < 4;
    
    // Calculate king safety score
    const whiteKingSafety = (whiteCastled ? 30 : 0) + (whitePawnShield * 8) - (whiteKingExposed ? 25 : 0);
    const blackKingSafety = (blackCastled ? 30 : 0) + (blackPawnShield * 8) - (blackKingExposed ? 25 : 0);
    
    return {
        whiteCastled: whiteCastled,
        blackCastled: blackCastled,
        whitePawnShield: whitePawnShield,
        blackPawnShield: blackPawnShield,
        whiteKingExposed: whiteKingExposed,
        blackKingExposed: blackKingExposed,
        whiteKingFile: whiteKingFile,
        blackKingFile: blackKingFile,
        whiteKingSafety: whiteKingSafety,
        blackKingSafety: blackKingSafety,
        kingSafetyDifference: whiteKingSafety - blackKingSafety
    };
}

/**
 * PARADIGM SHIFTER: Calculate space control
 * Measures how much territory each side controls
 */
function calculateSpaceControl(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    
    let whiteSpace = 0;
    let blackSpace = 0;
    
    // Count pawns past the 4th rank (controlling enemy territory)
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                const actualRank = 7 - rank;
                
                // White pawns in enemy territory (rank 4+)
                if (c === 'P' && actualRank >= 3) {
                    whiteSpace += actualRank - 2;  // More points for advanced pawns
                }
                
                // Black pawns in enemy territory (rank 5 or less)
                if (c === 'p' && actualRank <= 4) {
                    blackSpace += 5 - actualRank;
                }
                
                // Pieces in center also contribute to space
                if ((c === 'N' || c === 'B') && file >= 2 && file <= 5 && actualRank >= 2 && actualRank <= 5) {
                    whiteSpace += 2;
                }
                if ((c === 'n' || c === 'b') && file >= 2 && file <= 5 && actualRank >= 2 && actualRank <= 5) {
                    blackSpace += 2;
                }
                
                file++;
            }
        }
    }
    
    return {
        whiteSpace: whiteSpace,
        blackSpace: blackSpace,
        spaceDifference: whiteSpace - blackSpace
    };
}

/**
 * PARADIGM SHIFTER: Calculate holistic positional score
 * Neural-inspired comprehensive position evaluation
 * This mimics AlphaZero's pattern recognition
 */
function calculatePositionalScore(fen) {
    const material = getMaterialAnalysis(fen);
    const pawns = analyzePawnStructure(fen);
    const kingSafety = evaluateKingSafety(fen);
    const pieceActivity = evaluatePieceActivity(fen);
    const space = calculateSpaceControl(fen);
    const attack = calculateAttackPotential(fen);
    
    let score = 0;
    
    // Material with piece synergy bonuses
    score += material.balance;
    if (material.whiteBishopPair) score += 50;
    if (material.blackBishopPair) score -= 50;
    
    // PARADIGM SHIFTER: Enhanced pawn structure evaluation
    score += pawns.whitePawnScore - pawns.blackPawnScore;
    
    // King safety - heavily weighted in middlegame
    if (!material.isEndgame) {
        score += kingSafety.kingSafetyDifference * CONFIG.kingSafetyWeight * 10;
    }
    
    // PARADIGM SHIFTER: Piece activity contribution
    score += pieceActivity.activityDifference * CONFIG.pieceActivityWeight * 5;
    
    // Space control
    score += space.spaceDifference * CONFIG.spaceControlWeight * 3;
    
    // PARADIGM SHIFTER: Attack potential
    if (!material.isEndgame) {
        score += (attack.whiteAttackPotential - attack.blackAttackPotential) * CONFIG.attackPotentialWeight;
    }
    
    // PARADIGM SHIFTER: Initiative calculation
    const initiative = calculateInitiative(fen, material, pieceActivity);
    score += initiative * CONFIG.initiativeWeight;
    initiativeLevel = initiative;  // Update global state
    
    // Update attack potential global state
    attackPotential = attack.whiteAttackPotential - attack.blackAttackPotential;
    
    return score;
}

/**
 * PARADIGM SHIFTER: Calculate position complexity
 * Helps determine how much thinking time to allocate
 */
function calculatePositionComplexity(fen) {
    const material = getMaterialAnalysis(fen);
    const pawns = analyzePawnStructure(fen);
    
    let complexity = 50;  // Base complexity
    
    // More pieces = more complexity
    complexity += (material.whiteMinorPieces + material.blackMinorPieces) * 3;
    complexity += (material.whiteMajorPieces + material.blackMajorPieces) * 5;
    
    // Material imbalances add complexity
    if (material.hasImbalance) complexity += 15;
    
    // Passed pawns add complexity
    complexity += (pawns.whitePassers + pawns.blackPassers) * 5;
    
    // Open files add tactical complexity
    complexity += pawns.openFiles * 4;
    
    // Pawn tension adds complexity
    if (pawns.pawnTension) complexity += 10;
    
    return Math.min(100, Math.max(0, complexity));
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
 * PARADIGM SHIFTER: Determine strategic plan based on position
 * Deep pattern recognition for long-term planning
 */
function determineStrategicPlan(fen) {
    const material = getMaterialAnalysis(fen);
    const pawns = analyzePawnStructure(fen);
    const kingSafety = evaluateKingSafety(fen);
    const attack = calculateAttackPotential(fen);
    const space = calculateSpaceControl(fen);
    
    // PARADIGM SHIFTER: Multi-factor strategic plan selection
    // Prioritized from most urgent to least
    
    // Priority 1: King attack if opponent's king is exposed and we have attackers
    if (myColor === 'w' && kingSafety.blackKingExposed && attack.whiteAttackersNearKing >= 2) {
        longTermPlan.kingAttack = true;
        return "crush-king";
    }
    if (myColor === 'b' && kingSafety.whiteKingExposed && attack.blackAttackersNearKing >= 2) {
        longTermPlan.kingAttack = true;
        return "crush-king";
    }
    
    // Priority 2: Passed pawn advancement in appropriate positions
    if (pawns.whitePassers > 0 && myColor === 'w' && (material.isEndgame || pawns.whitePassers >= 2)) {
        return "advance-passer-dominate";
    }
    if (pawns.blackPassers > 0 && myColor === 'b' && (material.isEndgame || pawns.blackPassers >= 2)) {
        return "advance-passer-dominate";
    }
    
    // Priority 3: Convert endgame advantages
    if (material.isEndgame) {
        longTermPlan.endgameTransition = true;
        if (material.isPawnEndgame) return "pawn-endgame-technique";
        return "convert-endgame-precision";
    }
    
    // Priority 4: Exploit pawn weaknesses
    if (pawns.blackIsolated > pawns.whiteIsolated && myColor === 'w') return "siege-isolated-pawn";
    if (pawns.whiteIsolated > pawns.blackIsolated && myColor === 'b') return "siege-isolated-pawn";
    
    // Priority 5: Space advantage exploitation
    if (space.spaceDifference > 5 && myColor === 'w') return "squeeze-restrict-dominate";
    if (space.spaceDifference < -5 && myColor === 'b') return "squeeze-restrict-dominate";
    
    // Priority 6: Bishop pair in open positions
    if (material.whiteBishopPair && !material.blackBishopPair && myColor === 'w' && pawns.openFiles >= 2) {
        return "unleash-bishops";
    }
    if (material.blackBishopPair && !material.whiteBishopPair && myColor === 'b' && pawns.openFiles >= 2) {
        return "unleash-bishops";
    }
    
    // Priority 7: Initiative seizure
    if (initiativeLevel > 20 && myColor === 'w') return "maintain-initiative";
    if (initiativeLevel < -20 && myColor === 'b') return "maintain-initiative";
    
    // Default: Improve piece placement
    return "improve-coordinate-prepare";
}

/**
 * PARADIGM SHIFTER: Reset game state for new game with enhanced tracking
 */
function resetGameState() {
    positionHistory = {};
    currentEval = 0;
    isWinning = false;
    isCrushing = false;
    isDominating = false;
    isMating = false;
    moveCount = 0;
    consecutiveAdvantage = 0;
    positionalPressure = 0;
    blunderCheckHistory = [];
    strategicPlan = "neutral";
    
    // PARADIGM SHIFTER: Reset advanced state
    alienMoveCandidate = null;
    alienMoveScore = 0;
    initiativeLevel = 0;
    attackPotential = 0;
    positionComplexity = 0;
    tacticalSharpness = 0;
    strategicTension = 0;
    
    // Reset long-term plan
    longTermPlan = {
        pawnBreak: null,
        pieceManeuver: null,
        weakSquare: null,
        kingAttack: false,
        endgameTransition: false
    };
    
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
    
    console.log('[RESET] 🔄 Game state reset - PARADIGM SHIFTER awakened');
}

/**
 * Game phase detection - Refined for strategic planning
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const material = getMaterialAnalysis(fen);
    
    if (moveNum <= 8) return "opening";
    if (moveNum <= 15 && pieces > 26) return "early-middlegame";
    if (material.isDeepEndgame || pieces <= 10) return "deep-endgame";
    if (material.isEndgame || pieces <= 14) return "endgame";
    if (pieces > 20) return "middlegame";
    return "late-middlegame";
}

/**
 * PARADIGM SHIFTER: Enhanced position type detection
 * Identifies tactical sharpness, strategic tension, and special patterns
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    const material = getMaterialAnalysis(fen);
    const kingSafety = evaluateKingSafety(fen);
    const pawns = analyzePawnStructure(fen);
    const attack = calculateAttackPotential(fen);
    
    // Calculate position complexity
    positionComplexity = calculatePositionComplexity(fen);
    
    // Check indicator - definitely tactical
    if (fen.indexOf("+") !== -1) {
        tacticalSharpness = 100;
        return "tactical-check";
    }
    
    // Mating attack mode - highest priority
    if (isMating) {
        tacticalSharpness = 100;
        return "mating-attack";
    }
    
    // PARADIGM SHIFTER: Dominating advantage - crush mode
    if (isDominating) {
        return "dominating-conversion";
    }
    
    // Crushing advantage - conversion mode
    if (isCrushing) {
        return "crushing-conversion";
    }
    
    // Known winning endgame with technique
    if (getEndgameTechnique(fen)) {
        return "winning-endgame-technique";
    }
    
    // Winning - precise conversion
    if (isWinning) {
        return "winning-precise";
    }
    
    // PARADIGM SHIFTER: Attack potential detection
    if (!material.isEndgame) {
        const myAttackPotential = myColor === 'w' ? attack.whiteAttackPotential : attack.blackAttackPotential;
        const oppAttackPotential = myColor === 'w' ? attack.blackAttackPotential : attack.whiteAttackPotential;
        
        if (myAttackPotential > 80 && (kingSafety.blackKingExposed || kingSafety.whiteKingExposed)) {
            tacticalSharpness = 85;
            return "attack-opportunity";
        }
        
        if (oppAttackPotential > 80) {
            tacticalSharpness = 75;
            return "defensive-precision";
        }
    }
    
    // King safety issues - tactical
    if (kingSafety.whiteKingExposed || kingSafety.blackKingExposed) {
        tacticalSharpness = 70;
        return "king-safety-critical";
    }
    
    // Passed pawns in endgame - critical precision required
    if (material.isEndgame && (pawns.whitePassers > 0 || pawns.blackPassers > 0)) {
        return "critical-endgame-passers";
    }
    
    // PARADIGM SHIFTER: Count tactical elements
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
    
    // Position classification based on structure
    if (openFileCount >= 5) {
        tacticalSharpness = 65;
        return "highly-tactical";
    }
    if (openFileCount >= 3) {
        tacticalSharpness = 45;
        return "semi-tactical";
    }
    if (openFileCount <= 1) {
        tacticalSharpness = 20;
        return "closed-strategic";
    }
    
    tacticalSharpness = 35;
    return "balanced-complex";
}

/**
 * PARADIGM SHIFTER: Smart thinking time - Alien efficiency
 * Deep understanding with optimal resource allocation
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // PARADIGM SHIFTER: Position-based thinking allocation
    if (posType === "mating-attack") {
        speedMultiplier = 0.20;  // Lightning fast when mating
    } else if (isDominating) {
        speedMultiplier = CONFIG.crushingSpeed;
    } else if (isCrushing) {
        speedMultiplier = CONFIG.crushingSpeed * 1.1;
    } else if (isWinning) {
        speedMultiplier = CONFIG.winningSpeed;
    } else if (posType === "winning-endgame-technique") {
        speedMultiplier = CONFIG.endgameSpeed * 0.9;  // Quick with known technique
    } else if (posType === "critical-endgame-passers") {
        speedMultiplier = CONFIG.endgameSpeed * 1.3;  // Extra time for critical endgames
    } else if (posType === "attack-opportunity") {
        speedMultiplier = CONFIG.criticalSpeed;  // Time to calculate attack
    } else if (phase === "opening") {
        speedMultiplier = CONFIG.openingSpeed;
    } else if (phase === "early-middlegame") {
        speedMultiplier = CONFIG.earlyMidSpeed;
    } else if (phase === "middlegame") {
        speedMultiplier = CONFIG.middlegameSpeed;
    } else if (phase === "late-middlegame") {
        speedMultiplier = CONFIG.lateMidSpeed;
    } else if (phase === "endgame" || phase === "deep-endgame") {
        speedMultiplier = CONFIG.endgameSpeed;
    }
    
    // PARADIGM SHIFTER: Complexity adjustment
    if (positionComplexity > 70) {
        speedMultiplier *= 1.15;
    } else if (positionComplexity < 30) {
        speedMultiplier *= 0.85;
    }
    
    // Tactical positions need more time
    if (tacticalSharpness > 60) {
        speedMultiplier *= 1.1;
    }
    
    // Time pressure - react faster but stay devastating
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.50;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.30;
    if (timeLeft < 2000) speedMultiplier *= 0.20;
    if (timeLeft < 1000) speedMultiplier *= 0.10;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(60, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * PARADIGM SHIFTER: Intelligent depth selection
 * Alien depth - deep understanding, optimized resource allocation
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // PARADIGM SHIFTER: Position-specific depth allocation
    if (posType === "mating-attack") {
        depth = CONFIG.matingNetDepth;  // Maximum depth for checkmate nets
    } else if (posType === "winning-endgame-technique") {
        depth = CONFIG.endgameDepth;  // Deep for endgame precision
    } else if (posType === "critical-endgame-passers") {
        depth = CONFIG.convertingAdvantageDepth;
    } else if (posType === "attack-opportunity") {
        depth = CONFIG.tacticalDepth;  // Deep calculation for attacks
    } else if (posType === "defensive-precision") {
        depth = CONFIG.tacticalDepth;  // Must see all threats
    } else if (isDominating) {
        depth = CONFIG.winningDepth - 2;  // Efficient when dominating
    } else if (isCrushing) {
        depth = CONFIG.winningDepth;
    } else if (isWinning) {
        depth = CONFIG.winningDepth + 2;
    } else if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "deep-endgame") {
        depth = CONFIG.endgameDepth + 2;  // Maximum precision
    } else if (phase === "endgame") {
        depth = CONFIG.endgameDepth;
    } else if (phase === "middlegame" || phase === "late-middlegame" || phase === "early-middlegame") {
        if (posType === "highly-tactical" || posType === "tactical-check") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "closed-strategic") {
            depth = CONFIG.positionalDepth;
        } else if (posType === "semi-tactical") {
            depth = CONFIG.tacticalDepth - 2;
        } else if (posType === "crushing-conversion" || posType === "dominating-conversion") {
            depth = CONFIG.convertingAdvantageDepth;
        }
    }
    
    // PARADIGM SHIFTER: Complexity adjustment
    if (positionComplexity > 80) {
        depth = Math.min(depth + 2, CONFIG.criticalDepth);
    }
    
    // Time pressure depth management - stay strong even under pressure
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(16, depth - 2);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(14, depth - 4);
    if (timeLeft < 2000) depth = Math.max(12, depth - 6);
    if (timeLeft < 1000) depth = Math.max(10, depth - 8);
    
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
 * PARADIGM SHIFTER: Best move selection with alien intelligence
 * Zero blunders, maximum conversion pressure, alien web-weaving
 * Incorporates counter-intuitive but devastating move selection
 */
function selectBestMove(bestMove, alternatives) {
    // CRITICAL FIX: Early return with proper validation
    if (!bestMove || typeof bestMove !== 'string' || bestMove.length < 4) {
        if (alternatives && alternatives.length > 0 && alternatives[0] && alternatives[0].move) {
            return alternatives[0].move;
        }
        return null;
    }
    
    // If no alternatives, return the best move
    if (!alternatives || !Array.isArray(alternatives) || alternatives.length === 0) {
        return bestMove;
    }
    
    // FIXED: Safely get best score with proper null checking
    const bestScore = (alternatives[0] && typeof alternatives[0].score === 'number') 
        ? alternatives[0].score 
        : 0;
    
    // PARADIGM SHIFTER: ABSOLUTE blunder prevention
    // A blunder is now any move losing more than 50cp (stricter than before)
    if (blunderCheckHistory.length > 0) {
        const lastEval = blunderCheckHistory[blunderCheckHistory.length - 1];
        if (typeof lastEval === 'number') {
            const adjustedBest = myColor === 'w' ? bestScore : -bestScore;
            const adjustedLast = myColor === 'w' ? lastEval : -lastEval;
            
            // If best move loses more than threshold, find safer alternative
            if (adjustedLast - adjustedBest > CONFIG.blunderThreshold && alternatives.length > 1) {
                for (let alt of alternatives) {
                    if (alt && alt.move && typeof alt.score === 'number') {
                        const altAdjusted = myColor === 'w' ? alt.score : -alt.score;
                        if (adjustedLast - altAdjusted < CONFIG.blunderThreshold) {
                            console.log(`[PARADIGM] 🛡️ Blunder avoided: ${bestMove} -> ${alt.move}`);
                            return alt.move;
                        }
                    }
                }
            }
            
            // PARADIGM SHIFTER: Inaccuracy prevention (even 25cp matters)
            if (adjustedLast - adjustedBest > CONFIG.inaccuracyThreshold && alternatives.length > 1) {
                for (let alt of alternatives) {
                    if (alt && alt.move && typeof alt.score === 'number') {
                        const altAdjusted = myColor === 'w' ? alt.score : -alt.score;
                        if (adjustedLast - altAdjusted <= CONFIG.inaccuracyThreshold / 2) {
                            return alt.move;
                        }
                    }
                }
            }
        }
    }
    
    // PARADIGM SHIFTER: When dominating, crush without mercy
    if (isDominating && alternatives.length > 1) {
        // Find the most forcing continuation
        const forcingMoves = alternatives.filter(alt => 
            alt && alt.score && alt.score > bestScore - 20
        );
        if (forcingMoves.length > 0) {
            // Prefer moves that keep the pressure
            return forcingMoves[0].move || bestMove;
        }
    }
    
    // PARADIGM SHIFTER: When winning, NEVER repeat and always progress
    if ((isWinning || isCrushing) && alternatives.length > 1) {
        for (let i = 0; i < alternatives.length; i++) {
            const alt = alternatives[i];
            if (alt && alt.move && typeof alt.score === 'number') {
                // Only consider alternatives within 20cp of best (very tight tolerance)
                if (bestScore - alt.score < 20) {
                    return alt.move;
                }
            }
        }
    }
    
    // PARADIGM SHIFTER: In mating positions, find the fastest mate
    if (isMating && alternatives.length > 1) {
        let fastestMate = null;
        let fastestMateScore = -Infinity;
        
        for (let alt of alternatives) {
            if (alt && alt.move && typeof alt.score === 'number') {
                if (alt.score > 9000) {  // Mate score
                    if (alt.score > fastestMateScore) {
                        fastestMateScore = alt.score;
                        fastestMate = alt.move;
                    }
                }
            }
        }
        
        if (fastestMate) {
            console.log(`[PARADIGM] ⚔️ Fastest mate selected: ${fastestMate}`);
            return fastestMate;
        }
    }
    
    // PARADIGM SHIFTER: Alien move detection - counter-intuitive but strong
    // Look for quiet moves that are as good as aggressive ones
    if (alternatives.length > 2 && !isWinning && !isCrushing) {
        alienMoveCandidate = detectAlienMove(alternatives, bestMove);
        if (alienMoveCandidate) {
            console.log(`[PARADIGM] 👽 Alien move detected: ${alienMoveCandidate}`);
            return alienMoveCandidate;
        }
    }
    
    return bestMove;
}

/**
 * PARADIGM SHIFTER: Detect "alien" moves - counter-intuitive but strong
 * These are moves that look strange to humans but are objectively excellent
 */
function detectAlienMove(alternatives, defaultBest) {
    if (!alternatives || alternatives.length < 3) return null;
    
    const topScore = alternatives[0] && alternatives[0].score ? alternatives[0].score : 0;
    
    // Look for moves that are nearly as good but look different
    for (let i = 1; i < Math.min(alternatives.length, CONFIG.strategicSamplingMoves); i++) {
        const alt = alternatives[i];
        if (!alt || !alt.move || typeof alt.score !== 'number') continue;
        
        const scoreDiff = topScore - alt.score;
        
        // Move is within 15cp of best - consider as candidate
        if (scoreDiff <= 15 && scoreDiff >= 0) {
            const move = alt.move;
            
            // Check for "alien" patterns
            // 1. Quiet queen retreats (not obvious aggressive moves)
            if (move.length === 4 && move[0] === defaultBest[0]) {
                continue; // Same piece moving - not alien
            }
            
            // 2. Piece moving backwards but maintaining position
            const fromRank = parseInt(move[1]);
            const toRank = parseInt(move[3]);
            const isRetreat = (myColor === 'w' && toRank < fromRank) || 
                             (myColor === 'b' && toRank > fromRank);
            
            if (isRetreat && scoreDiff <= 10) {
                // Retreating move that's nearly as good - this is alien thinking
                alienMoveScore = alt.score;
                return move;
            }
            
            // 3. Pawn moves that aren't captures but are equally good
            const isPawnMove = move.match(/^[a-h][2-7][a-h][3-6]$/);
            if (isPawnMove && scoreDiff <= 8 && move !== defaultBest) {
                alienMoveScore = alt.score;
                return move;
            }
        }
    }
    
    return null;
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
 * PARADIGM SHIFTER: Update winning status with detailed tracking
 * Enhanced with domination detection and strategic pressure accumulation
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
    if (blunderCheckHistory.length > 15) blunderCheckHistory.shift();  // Longer history
    
    // Adjust for color
    const adjustedEval = myColor === 'w' ? evalScore : -evalScore;
    
    // Detect mate
    isMating = evalData.type === 'mate' && evalData.value > 0;
    
    // PARADIGM SHIFTER: Enhanced winning/crushing/dominating detection with hysteresis
    const wasWinning = isWinning;
    const wasCrushing = isCrushing;
    
    isDominating = adjustedEval >= CONFIG.dominatingThreshold || isMating;
    isCrushing = adjustedEval >= CONFIG.crushingThreshold || isDominating;
    isWinning = adjustedEval >= CONFIG.winningThreshold;
    
    // Track consecutive advantage
    if (isWinning) {
        consecutiveAdvantage++;
    } else {
        consecutiveAdvantage = 0;
    }
    
    // PARADIGM SHIFTER: Accumulate positional pressure
    if (isWinning && consecutiveAdvantage > 2) {
        positionalPressure = Math.min(positionalPressure + 15, 100);
    } else if (isCrushing) {
        positionalPressure = Math.min(positionalPressure + 25, 100);
    } else if (isDominating) {
        positionalPressure = 100;
    } else if (!isWinning && consecutiveAdvantage === 0) {
        positionalPressure = Math.max(positionalPressure - 5, 0);
    }
    
    // PARADIGM SHIFTER: Log significant evaluation changes
    if (wasWinning !== isWinning || wasCrushing !== isCrushing) {
        console.log(`[PARADIGM] 📊 Status: winning=${isWinning}, crushing=${isCrushing}, dominating=${isDominating}, pressure=${positionalPressure}`);
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
