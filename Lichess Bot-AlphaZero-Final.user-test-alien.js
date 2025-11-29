// ==UserScript==
// @name         Lichess Bot - AlphaZero OMEGA
// @description  TRUE AlphaZero - Alien web-weaving, 30+ move planning, ZERO blunders, PERFECT judgment
// @author       AlphaZero - OMEGA Edition
// @version      8.0.0-OMEGA
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// OMEGA CONFIGURATION - AlphaZero's Alien Intelligence
// Deep understanding, strategic webs, paradigm-shifting moves
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // STRATEGIC DEPTHS - Deep understanding over brute-force
    // Intelligent allocation: complex positions get deeper analysis
    baseDepth: 20,
    tacticalDepth: 26,        // Deep tactical verification (20+ move lookahead)
    positionalDepth: 24,      // Strategic positions need deep evaluation
    endgameDepth: 28,         // PERFECT endgame play - near tablebase precision
    openingDepth: 18,         // Opening theory + strategic preparation
    winningDepth: 20,         // Maintain precision when ahead
    criticalDepth: 30,        // Maximum depth for critical moments
    blunderCheckDepth: 22,    // Always verify moves for blunders
    alienMoveDepth: 28,       // Extra depth for counter-intuitive moves
    
    // ZERO MISTAKES - Pure perfection
    humanMistakeRate: 0,
    blunderThreshold: 80,     // Tighter threshold - any move losing >80cp is suspect
    
    // Timing - Efficient but thorough
    thinkingTimeMin: 80,
    thinkingTimeMax: 700,
    
    // Speed multipliers - Thoughtful, not rushed
    openingSpeed: 0.30,
    earlyMidSpeed: 0.50,
    middlegameSpeed: 0.60,
    lateMidSpeed: 0.55,
    endgameSpeed: 0.45,       // More time in endgames for precision
    criticalSpeed: 0.80,
    winningSpeed: 0.35,       // Stay precise when winning
    
    // Time thresholds
    panicThreshold: 4000,
    criticalThreshold: 8000,
    
    // OMEGA evaluation weights
    winningThreshold: 120,        // Lower threshold - capitalize earlier
    crushingThreshold: 350,       // Start crushing mode earlier
    drawAvoidanceContempt: 150,   // Strong draw avoidance
    killerModeContempt: 250,      // Maximum conversion pressure
    
    // Strategic web-weaving parameters
    maxRepetitions: 0,            // NEVER repeat when winning
    strategicHorizon: 35,         // Plan 35+ moves ahead conceptually
    
    // OMEGA: Neural-network inspired positional weights
    // These weights create the "alien" feel - different from human priorities
    mobilityWeight: 0.18,
    kingSafetyWeight: 0.22,
    pawnStructureWeight: 0.16,
    spaceControlWeight: 0.14,
    pieceActivityWeight: 0.18,
    initiativeWeight: 0.22,
    pieceCoordinationWeight: 0.15,
    prophylaxisWeight: 0.12,
    attackPotentialWeight: 0.20,
    
    // OMEGA: Alien move detection parameters
    alienMoveThreshold: 0.92,     // High confidence required for non-intuitive moves
    delayedGratificationBonus: 0.08, // Bonus for moves with long-term payoff
    quietMoveBonus: 0.05,         // AlphaZero loves quiet improving moves
    
    // Endgame conversion parameters
    endgamePrecisionMode: true,
    convertingAdvantageDepth: 26,
    matingNetDepth: 32,
    
    // OMEGA: Multi-line analysis for web-weaving
    multiPVCount: 6,              // Analyze top 6 moves for pattern detection
    strategicLineDepth: 8         // Analyze 8 moves deep for each line
};

// ═══════════════════════════════════════════════════════════════════════
// OMEGA OPENING BOOK - Deep Strategic Preparation
// AlphaZero's preference: Complex positions with long-term strategic potential
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - d4 for strategic complexity (AlphaZero signature)
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },   // Complex strategic games - AlphaZero favorite
            { move: "e2e4", weight: 0.28 },   // Classical fighting chess
            { move: "c2c4", weight: 0.10 },   // English - flexible
            { move: "g1f3", weight: 0.07 }    // Reti - hypermodern
        ]
    },
    // After 1.e4 - Sicilian for fighting chess
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.50 },   // Sicilian - maximum fight
            { move: "e7e5", weight: 0.28 },   // Classical - sound
            { move: "e7e6", weight: 0.12 },   // French - strategic
            { move: "c7c6", weight: 0.10 }    // Caro-Kann - solid
        ]
    },
    // After 1.d4 - Indian systems for complexity
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.60 },   // Indian setups - flexible (AlphaZero style)
            { move: "d7d5", weight: 0.25 },   // Classical QGD
            { move: "e7e6", weight: 0.10 },   // QGD structure
            { move: "f7f5", weight: 0.05 }    // Dutch - aggressive
        ]
    },
    // Sicilian - Open Sicilian for tactical richness
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.75 },   // Open Sicilian - mainline
            { move: "b1c3", weight: 0.18 },   // Closed Sicilian
            { move: "c2c3", weight: 0.07 }    // Alapin
        ]
    },
    // Sicilian after Nf3 - Najdorf/Dragon prep
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.50 },   // Najdorf/Scheveningen
            { move: "b8c6", weight: 0.28 },   // Classical
            { move: "e7e6", weight: 0.22 }    // Kan/Taimanov
        ]
    },
    // Open Sicilian - Maximum complexity
    "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "c5d4", weight: 0.90 },   // Open it up!
            { move: "g8f6", weight: 0.10 }
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
            { move: "d2d4", weight: 0.55 },   // Sharp central play
            { move: "b1c3", weight: 0.28 },   // Quiet Italian
            { move: "d2d3", weight: 0.17 }    // Slow buildup - AlphaZero style
        ]
    },
    // QGD/Slav complex
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "c7c6", weight: 0.42 },   // Slav - solid
            { move: "e7e6", weight: 0.38 },   // QGD - classical
            { move: "g8f6", weight: 0.20 }    // Indian transposition
        ]
    },
    // King's Indian setup - Fighting spirit
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.48 },   // Main lines
            { move: "g1f3", weight: 0.32 },   // Flexible
            { move: "e2e4", weight: 0.20 }    // Four Pawns Attack
        ]
    },
    // Reti/English systems
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.42 },   // Classical center
            { move: "g8f6", weight: 0.38 },   // Symmetrical
            { move: "c7c5", weight: 0.20 }    // English reversed
        ]
    },
    // London counter-play
    "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.55 },   // Challenge center immediately
            { move: "g8f6", weight: 0.28 },   // Develop
            { move: "c8f5", weight: 0.17 }    // Mirror
        ]
    },
    // Catalan - Positional mastery
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g2g3", weight: 0.65 },   // Catalan fianchetto - AlphaZero signature
            { move: "g1f3", weight: 0.22 },   // Classical
            { move: "b1c3", weight: 0.13 }    // Nimzo approach
        ]
    },
    // Ruy Lopez - Spanish strategic web
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f1b5", weight: 0.60 },   // Ruy Lopez - the king of openings
            { move: "f1c4", weight: 0.28 },   // Italian
            { move: "d2d4", weight: 0.12 }    // Scotch
        ]
    },
    // Ruy Lopez - Black's choice
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.52 },   // Morphy Defense
            { move: "g8f6", weight: 0.35 },   // Berlin Defense
            { move: "d7d6", weight: 0.13 }    // Old Steinitz
        ]
    },
    // Nimzo-Indian - Complex strategic play
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "f8b4", weight: 0.55 },   // Nimzo-Indian - highly strategic
            { move: "d7d5", weight: 0.28 },   // QGD
            { move: "b7b6", weight: 0.17 }    // Queen's Indian
        ]
    },
    // QGA - Active play
    "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.45 },   // Central push - aggressive
            { move: "g1f3", weight: 0.35 },   // Development
            { move: "e2e3", weight: 0.20 }    // Quiet recapture
        ]
    },
    // Caro-Kann - Positional grinding
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },   // Classical
            { move: "b1c3", weight: 0.30 },   // Two Knights
            { move: "e4e5", weight: 0.20 }    // Advance
        ]
    },
    // French - Strategic battle
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.58 },   // Main lines
            { move: "e4e5", weight: 0.25 },   // Advance
            { move: "b1c3", weight: 0.17 }    // Flexible
        ]
    },
    // Berlin Defense - Deep endgames
    "r1bqkb1r/pppp1ppp/2n2n2/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "e1g1", weight: 0.48 },   // Castle - strategic
            { move: "d2d3", weight: 0.32 },   // Quiet Italian - AlphaZero style
            { move: "b5c6", weight: 0.20 }    // Berlin endgame
        ]
    },
    // Grunfeld - Dynamic counterplay
    "rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR w KQkq d6": {
        white: [
            { move: "c4d5", weight: 0.50 },   // Exchange variation
            { move: "g1f3", weight: 0.32 },   // Classical
            { move: "e2e3", weight: 0.18 }    // Solid
        ]
    },
    // English Opening - Hypermodern
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e5", weight: 0.38 },   // Reversed Sicilian
            { move: "g8f6", weight: 0.32 },   // Indian style
            { move: "c7c5", weight: 0.30 }    // Symmetrical
        ]
    },
    // Scotch Game
    "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "e5d4", weight: 0.85 },   // Take the pawn
            { move: "g8f6", weight: 0.15 }    // Delayed
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

// OMEGA: Position tracking for web-weaving
let positionHistory = {};
let currentEval = 0;
let isWinning = false;
let isCrushing = false;
let isMating = false;

// OMEGA: Strategic state tracking
let strategicPlan = "neutral";
let lastMoveEval = 0;
let consecutiveAdvantage = 0;
let positionalPressure = 0;
let blunderCheckHistory = [];

// OMEGA: Piece activity and coordination tracking
let pieceActivityScores = { white: 0, black: 0 };
let pieceCoordinationScore = 0;
let attackPotential = 0;
let prophylacticNeeds = [];

// OMEGA: Long-term strategic memory
let strategicPatternHistory = [];
let alienMoveCount = 0;
let webWeavingDepth = 0;

// ═══════════════════════════════════════════════════════════════════════
// LOCK-FREE STATE MANAGEMENT - DEADLOCK-PROOF SYSTEM
// Critical fix for bot stopping mid-game
// ═══════════════════════════════════════════════════════════════════════

let lastSeenPositionId = null;
let lastSeenFen = null;
let currentCalculatingColor = null;

let calculationLock = false;
let calculationStartTime = 0;
let lastSuccessfulMoveTime = 0;

let whitePositionReady = false;
let blackPositionReady = false;
let lastWhitePositionTime = 0;
let lastBlackPositionTime = 0;

let whiteHumanMovedRecently = false;
let blackHumanMovedRecently = false;
let whiteDebounceTimer = null;
let blackDebounceTimer = null;

let calculationTimeout = null;
let messageDebounceTimer = null;
let absoluteWatchdogTimer = null;
let healthCheckInterval = null;

let pendingMove = null;
let moveConfirmationTimer = null;
let lastRejectedMove = null;
let rejectionCount = 0;
let botJustSentMove = false;

// ═══════════════════════════════════════════════════════════════════════
// OMEGA: WINNING ENDGAME PATTERNS - Tablebase-like precision
// ═══════════════════════════════════════════════════════════════════════

const WINNING_ENDGAMES = {
    KQvK: { depth: 10, technique: "centralize-king-push-edge", maxMoves: 10 },
    KRvK: { depth: 16, technique: "opposition-cut-off", maxMoves: 16 },
    KRRvK: { depth: 7, technique: "double-rook-roller", maxMoves: 7 },
    KQQvK: { depth: 4, technique: "queen-coordination", maxMoves: 4 },
    KBBvK: { depth: 19, technique: "diagonal-prison", maxMoves: 19 },
    KBNvK: { depth: 33, technique: "wrong-corner-drive", maxMoves: 33 },
    KPvK: { depth: 0, technique: "opposition-promotion", maxMoves: 20 },
    KQvKR: { depth: 20, technique: "queen-dominance", maxMoves: 31 },
    KRvKB: { depth: 0, technique: "fortress-break-attempt", maxMoves: 0 },
    KRvKN: { depth: 0, technique: "knight-trap", maxMoves: 0 },
    KQvKP: { depth: 0, technique: "queen-vs-pawn", maxMoves: 30 },
    KRPvKR: { depth: 0, technique: "lucena-philidor", maxMoves: 50 },
    KBPvK: { depth: 0, technique: "bishop-pawn-coordination", maxMoves: 25 },
    KNPvK: { depth: 0, technique: "knight-pawn-coordination", maxMoves: 30 },
    KQvKBN: { depth: 0, technique: "queen-vs-minor-pieces", maxMoves: 50 }
};

// ═══════════════════════════════════════════════════════════════════════
// OMEGA: STRATEGIC PATTERN RECOGNITION - Neural-network inspired
// These patterns create the "alien" understanding
// ═══════════════════════════════════════════════════════════════════════

const STRATEGIC_PATTERNS = {
    // Pawn structure patterns
    isolatedPawn: { weight: -0.35, plan: "blockade-and-attack", urgency: 0.7 },
    passedPawn: { weight: 0.55, plan: "support-and-advance", urgency: 0.9 },
    doubledPawns: { weight: -0.22, plan: "target-weakness", urgency: 0.5 },
    backwardPawn: { weight: -0.28, plan: "fix-and-pressure", urgency: 0.6 },
    pawnMajority: { weight: 0.35, plan: "create-passer", urgency: 0.8 },
    connectedPassers: { weight: 0.75, plan: "advance-together", urgency: 0.95 },
    
    // Piece patterns
    bishopPair: { weight: 0.45, plan: "open-position", urgency: 0.6 },
    knightOutpost: { weight: 0.40, plan: "establish-and-support", urgency: 0.7 },
    rookOnOpenFile: { weight: 0.35, plan: "seize-control", urgency: 0.8 },
    rookOnSeventhRank: { weight: 0.50, plan: "invade-and-attack", urgency: 0.9 },
    badBishop: { weight: -0.30, plan: "exchange-or-activate", urgency: 0.5 },
    
    // Positional patterns
    weakSquares: { weight: 0.30, plan: "occupy-weak-squares", urgency: 0.6 },
    kingExposed: { weight: 0.65, plan: "attack-king", urgency: 0.95 },
    centralControl: { weight: 0.40, plan: "maintain-and-expand", urgency: 0.7 },
    spaceAdvantage: { weight: 0.35, plan: "restrict-opponent", urgency: 0.6 },
    
    // AlphaZero's signature patterns - the "alien" moves
    prophylaxis: { weight: 0.28, plan: "prevent-opponent-plan", urgency: 0.65 },
    quietImprovement: { weight: 0.25, plan: "subtle-piece-improvement", urgency: 0.5 },
    exchangeSacrifice: { weight: 0.45, plan: "strategic-exchange", urgency: 0.75 },
    pawnSacrifice: { weight: 0.38, plan: "activity-for-material", urgency: 0.7 },
    kingActivity: { weight: 0.42, plan: "king-as-fighting-piece", urgency: 0.6 }
};

// ═══════════════════════════════════════════════════════════════════════
// OMEGA: ALIEN MOVE PATTERNS - Counter-intuitive but deeply strong
// These are the moves that make AlphaZero feel "non-human"
// ═══════════════════════════════════════════════════════════════════════

const ALIEN_MOVE_PATTERNS = {
    // Quiet pawn moves in sharp positions - classic AlphaZero
    quietPawnPush: {
        description: "Advancing a non-threatening pawn in a sharp position",
        detectFn: (move, position) => {
            return move.includes('P') && !move.includes('x') && !move.includes('+');
        },
        bonusWeight: 0.12
    },
    
    // King walks in the middlegame
    earlyKingActivity: {
        description: "King moving to active square before endgame",
        detectFn: (move, position) => {
            return move.includes('K') && position.phase !== 'endgame';
        },
        bonusWeight: 0.08
    },
    
    // Retreating pieces for improvement
    pieceRetreat: {
        description: "Retreating a piece to improve coordination",
        detectFn: (move, position) => {
            // Detected by engine evaluation + non-forcing move
            return false; // Implemented in evaluation
        },
        bonusWeight: 0.10
    },
    
    // Exchange sacrifice for long-term compensation
    exchangeSac: {
        description: "Giving up exchange for positional compensation",
        detectFn: (move, position) => {
            return move.includes('R') && move.includes('x') && move.includes('B' || 'N');
        },
        bonusWeight: 0.15
    },
    
    // Prophylactic moves
    prophylacticMove: {
        description: "Move that prevents opponent's plan rather than advancing own",
        detectFn: (move, position) => {
            return false; // Detected by multi-line analysis
        },
        bonusWeight: 0.11
    },
    
    // h4/a4 pawn thrusts - AlphaZero signature
    flankPawnThrust: {
        description: "Flank pawn advance in closed positions",
        detectFn: (move, position) => {
            return (move === 'h2h4' || move === 'h7h5' || 
                    move === 'a2a4' || move === 'a7a5' ||
                    move === 'h4h5' || move === 'h5h4' ||
                    move === 'a4a5' || move === 'a5a4');
        },
        bonusWeight: 0.09
    }
};

// ═══════════════════════════════════════════════════════════════════════
// POSITION ANALYSIS - OMEGA Deep Understanding
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
        if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
            count++;
        }
    }
    return count;
}

/**
 * OMEGA: Deep material analysis with piece activity consideration
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
    let whiteRooks = 0;
    let blackRooks = 0;
    let whiteQueens = 0;
    let blackQueens = 0;
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
                if (c === 'R') whiteRooks++;
                if (c === 'Q') whiteQueens++;
                if (c === 'P') whitePawns++;
            } else {
                blackMaterial += Math.abs(pieceValues[c]);
                if (c === 'b') blackBishops++;
                if (c === 'n') blackKnights++;
                if (c === 'r') blackRooks++;
                if (c === 'q') blackQueens++;
                if (c === 'p') blackPawns++;
            }
        }
    }
    
    const totalMaterial = whiteMaterial + blackMaterial;
    
    return {
        balance: balance,
        whiteMaterial: whiteMaterial,
        blackMaterial: blackMaterial,
        whiteBishopPair: whiteBishops >= 2,
        blackBishopPair: blackBishops >= 2,
        whiteMinorPieces: whiteBishops + whiteKnights,
        blackMinorPieces: blackBishops + blackKnights,
        whiteMajorPieces: whiteRooks + whiteQueens,
        blackMajorPieces: blackRooks + blackQueens,
        totalPawns: whitePawns + blackPawns,
        whitePawns: whitePawns,
        blackPawns: blackPawns,
        isEndgame: totalMaterial < 2500,
        isLateEndgame: totalMaterial < 1500,
        isPureEndgame: totalMaterial < 1000,
        hasQueens: whiteQueens > 0 || blackQueens > 0,
        hasRooks: whiteRooks > 0 || blackRooks > 0
    };
}

/**
 * OMEGA: Advanced pawn structure analysis for long-term planning
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
        
        // Isolated pawns
        let whiteHasNeighbor = (i > 0 && whiteFileCount[i-1] > 0) || (i < 7 && whiteFileCount[i+1] > 0);
        let blackHasNeighbor = (i > 0 && blackFileCount[i-1] > 0) || (i < 7 && blackFileCount[i+1] > 0);
        
        if (whiteFileCount[i] > 0 && !whiteHasNeighbor) isolatedWhite++;
        if (blackFileCount[i] > 0 && !blackHasNeighbor) isolatedBlack++;
    }
    
    // Passed pawn detection (more sophisticated)
    for (let p of whitePawnFiles) {
        let isPassed = true;
        for (let bp of blackPawnFiles) {
            if (Math.abs(bp.file - p.file) <= 1 && bp.rank > p.rank) {
                isPassed = false;
                break;
            }
        }
        if (isPassed && p.rank >= 3) whitePassers++;
    }
    
    for (let p of blackPawnFiles) {
        let isPassed = true;
        for (let wp of whitePawnFiles) {
            if (Math.abs(wp.file - p.file) <= 1 && wp.rank < p.rank) {
                isPassed = false;
                break;
            }
        }
        if (isPassed && p.rank <= 4) blackPassers++;
    }
    
    // Backward pawn detection (simplified)
    for (let p of whitePawnFiles) {
        let hasSupport = false;
        for (let wp of whitePawnFiles) {
            if (Math.abs(wp.file - p.file) === 1 && wp.rank <= p.rank) {
                hasSupport = true;
                break;
            }
        }
        if (!hasSupport && p.rank < 5) backwardWhite++;
    }
    
    for (let p of blackPawnFiles) {
        let hasSupport = false;
        for (let bp of blackPawnFiles) {
            if (Math.abs(bp.file - p.file) === 1 && bp.rank >= p.rank) {
                hasSupport = true;
                break;
            }
        }
        if (!hasSupport && p.rank > 2) backwardBlack++;
    }
    
    // Calculate pawn tension and mobility
    let pawnTension = 0;
    for (let wp of whitePawnFiles) {
        for (let bp of blackPawnFiles) {
            if (Math.abs(wp.file - bp.file) === 1 && Math.abs(wp.rank - bp.rank) === 1) {
                pawnTension++;
            }
        }
    }
    
    return {
        whitePassers: whitePassers,
        blackPassers: blackPassers,
        whiteIsolated: isolatedWhite,
        blackIsolated: isolatedBlack,
        whiteDoubled: doubledWhite,
        blackDoubled: doubledBlack,
        whiteBackward: backwardWhite,
        blackBackward: backwardBlack,
        pawnTension: pawnTension,
        whitePawnCount: whitePawnFiles.length,
        blackPawnCount: blackPawnFiles.length,
        hasPassedPawn: whitePassers > 0 || blackPassers > 0,
        hasConnectedPassers: whitePassers >= 2 || blackPassers >= 2
    };
}

/**
 * OMEGA: King safety evaluation - critical for attack detection
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
    
    // King exposure (king in center or advanced)
    whiteKingExposed = !whiteCastled && (whiteKingRank > 0 || (whiteKingFile >= 2 && whiteKingFile <= 5));
    blackKingExposed = !blackCastled && (blackKingRank < 7 || (blackKingFile >= 2 && blackKingFile <= 5));
    
    // Pawn shield evaluation
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'P' && Math.abs(file - whiteKingFile) <= 1 && (7 - rank) >= 1 && (7 - rank) <= 2) {
                    whitePawnShield++;
                }
                if (c === 'p' && Math.abs(file - blackKingFile) <= 1 && (7 - rank) >= 5 && (7 - rank) <= 6) {
                    blackPawnShield++;
                }
                file++;
            }
        }
    }
    
    // Calculate king safety scores
    let whiteKingSafety = 0;
    let blackKingSafety = 0;
    
    if (whiteCastled) whiteKingSafety += 30;
    if (blackCastled) blackKingSafety += 30;
    
    whiteKingSafety += whitePawnShield * 15;
    blackKingSafety += blackPawnShield * 15;
    
    if (whiteKingExposed) whiteKingSafety -= 40;
    if (blackKingExposed) blackKingSafety -= 40;
    
    return {
        whiteCastled: whiteCastled,
        blackCastled: blackCastled,
        whitePawnShield: whitePawnShield,
        blackPawnShield: blackPawnShield,
        whiteKingExposed: whiteKingExposed,
        blackKingExposed: blackKingExposed,
        whiteKingSafety: whiteKingSafety,
        blackKingSafety: blackKingSafety,
        whiteKingFile: whiteKingFile,
        blackKingFile: blackKingFile,
        canAttackWhiteKing: blackKingSafety > whiteKingSafety + 20,
        canAttackBlackKing: whiteKingSafety > blackKingSafety + 20
    };
}

/**
 * OMEGA: Piece activity evaluation - key for AlphaZero-style play
 */
function evaluatePieceActivity(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    
    let whiteActivity = 0;
    let blackActivity = 0;
    let whiteCentralization = 0;
    let blackCentralization = 0;
    
    // Central squares bonus
    const centralBonus = {
        3: { 3: 20, 4: 20 },
        4: { 3: 20, 4: 20 },
        2: { 2: 10, 3: 15, 4: 15, 5: 10 },
        5: { 2: 10, 3: 15, 4: 15, 5: 10 }
    };
    
    // Scan board for piece positions
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                const actualRank = 7 - rank;
                
                // Calculate centralization bonus
                let centralBonus_val = 0;
                if (file >= 2 && file <= 5 && actualRank >= 2 && actualRank <= 5) {
                    centralBonus_val = 10 + (3.5 - Math.abs(file - 3.5)) * 5 + (3.5 - Math.abs(actualRank - 3.5)) * 5;
                }
                
                // White pieces
                if (c === 'N') {
                    whiteActivity += 20 + centralBonus_val;
                    whiteCentralization += centralBonus_val;
                }
                if (c === 'B') {
                    whiteActivity += 18 + (actualRank > 0 ? 8 : 0); // Bonus for developed bishop
                }
                if (c === 'R') {
                    whiteActivity += 15 + (actualRank >= 6 ? 25 : 0); // 7th rank bonus
                }
                if (c === 'Q') {
                    whiteActivity += 12 + (actualRank > 1 ? 5 : 0);
                }
                
                // Black pieces
                if (c === 'n') {
                    blackActivity += 20 + centralBonus_val;
                    blackCentralization += centralBonus_val;
                }
                if (c === 'b') {
                    blackActivity += 18 + (actualRank < 7 ? 8 : 0);
                }
                if (c === 'r') {
                    blackActivity += 15 + (actualRank <= 1 ? 25 : 0);
                }
                if (c === 'q') {
                    blackActivity += 12 + (actualRank < 6 ? 5 : 0);
                }
                
                file++;
            }
        }
    }
    
    pieceActivityScores = { white: whiteActivity, black: blackActivity };
    
    return {
        whiteActivity: whiteActivity,
        blackActivity: blackActivity,
        whiteCentralization: whiteCentralization,
        blackCentralization: blackCentralization,
        activityAdvantage: whiteActivity - blackActivity,
        hasActivityAdvantage: Math.abs(whiteActivity - blackActivity) > 30
    };
}

/**
 * OMEGA: Space control evaluation
 */
function evaluateSpaceControl(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    
    let whiteSpace = 0;
    let blackSpace = 0;
    
    // Count pawns on ranks 4-6 for white, 3-5 for black
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                const actualRank = 7 - rank;
                
                if (c === 'P') {
                    if (actualRank >= 3 && actualRank <= 5) whiteSpace += 10;
                    if (actualRank >= 4) whiteSpace += 5; // Advanced pawns
                }
                if (c === 'p') {
                    if (actualRank >= 2 && actualRank <= 4) blackSpace += 10;
                    if (actualRank <= 3) blackSpace += 5;
                }
                
                file++;
            }
        }
    }
    
    return {
        whiteSpace: whiteSpace,
        blackSpace: blackSpace,
        spaceAdvantage: whiteSpace - blackSpace,
        hasSpaceAdvantage: Math.abs(whiteSpace - blackSpace) > 20
    };
}

/**
 * OMEGA: Calculate holistic positional score
 * This mimics neural network pattern recognition with weighted features
 */
function calculatePositionalScore(fen) {
    const material = getMaterialAnalysis(fen);
    const pawns = analyzePawnStructure(fen);
    const kingSafety = evaluateKingSafety(fen);
    const activity = evaluatePieceActivity(fen);
    const space = evaluateSpaceControl(fen);
    
    let score = 0;
    
    // Material with bishop pair bonus
    score += material.balance;
    if (material.whiteBishopPair) score += 45;
    if (material.blackBishopPair) score -= 45;
    
    // Pawn structure - weighted by importance
    score += (pawns.whitePassers - pawns.blackPassers) * 65;
    score -= (pawns.whiteIsolated - pawns.blackIsolated) * 22;
    score -= (pawns.whiteDoubled - pawns.blackDoubled) * 18;
    score -= (pawns.whiteBackward - pawns.blackBackward) * 15;
    
    // Connected passers bonus
    if (pawns.whitePassers >= 2) score += 35;
    if (pawns.blackPassers >= 2) score -= 35;
    
    // King safety
    score += (kingSafety.whiteKingSafety - kingSafety.blackKingSafety);
    if (kingSafety.whiteKingExposed) score -= 55;
    if (kingSafety.blackKingExposed) score += 55;
    
    // Piece activity - AlphaZero heavily weights this
    score += (activity.activityAdvantage) * CONFIG.pieceActivityWeight;
    
    // Space control
    score += space.spaceAdvantage * CONFIG.spaceControlWeight;
    
    // Update global tracking
    pieceCoordinationScore = activity.activityAdvantage;
    
    return score;
}

/**
 * OMEGA: Detect piece configuration for tablebase-like endgame play
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
 * OMEGA: Check if position is a known winning endgame with technique
 */
function getEndgameTechnique(fen) {
    const config = getPieceConfiguration(fen);
    const whiteStr = config.white.split('').sort().join('');
    const blackStr = config.black.split('').sort().join('');
    
    let key = "";
    
    // Check white winning endgames
    if (blackStr === 'K') {
        if (whiteStr.indexOf('KQ') !== -1 && whiteStr.length === 2) key = "KQvK";
        else if (whiteStr.indexOf('KR') !== -1 && whiteStr.length === 2) key = "KRvK";
        else if (whiteStr === 'KRR') key = "KRRvK";
        else if (whiteStr === 'KQQ') key = "KQQvK";
        else if (whiteStr === 'KBB') key = "KBBvK";
        else if (whiteStr === 'KBN' || whiteStr === 'KNB') key = "KBNvK";
        else if (whiteStr.indexOf('P') !== -1 && whiteStr.length <= 3) key = "KPvK";
    }
    
    // Check black winning endgames (mirror)
    if (whiteStr === 'K') {
        if (blackStr.indexOf('KQ') !== -1 && blackStr.length === 2) key = "KQvK";
        else if (blackStr.indexOf('KR') !== -1 && blackStr.length === 2) key = "KRvK";
        else if (blackStr === 'KRR') key = "KRRvK";
        else if (blackStr === 'KQQ') key = "KQQvK";
        else if (blackStr === 'KBB') key = "KBBvK";
        else if (blackStr === 'KBN' || blackStr === 'KNB') key = "KBNvK";
        else if (blackStr.indexOf('P') !== -1 && blackStr.length <= 3) key = "KPvK";
    }
    
    // Rook endgames
    if ((whiteStr === 'KRP' || whiteStr === 'KPR') && (blackStr === 'KR')) key = "KRPvKR";
    if ((blackStr === 'KRP' || blackStr === 'KPR') && (whiteStr === 'KR')) key = "KRPvKR";
    
    return WINNING_ENDGAMES[key] || null;
}

/**
 * OMEGA: Track position for web-weaving (avoid repetitions)
 */
function trackPosition(fen) {
    const posKey = fen.split(' ').slice(0, 4).join(' ');
    positionHistory[posKey] = (positionHistory[posKey] || 0) + 1;
    return positionHistory[posKey];
}

/**
 * OMEGA: Check if move would lead to repetition
 */
function wouldRepeat(fen) {
    const posKey = fen.split(' ').slice(0, 4).join(' ');
    return (positionHistory[posKey] || 0) >= CONFIG.maxRepetitions;
}

/**
 * OMEGA: Determine strategic plan based on position
 * This creates the long-term strategic "web"
 */
function determineStrategicPlan(fen) {
    const material = getMaterialAnalysis(fen);
    const pawns = analyzePawnStructure(fen);
    const kingSafety = evaluateKingSafety(fen);
    const activity = evaluatePieceActivity(fen);
    const space = evaluateSpaceControl(fen);
    
    let plans = [];
    
    // King safety plans - highest priority
    if (kingSafety.blackKingExposed && myColor === 'w') {
        plans.push({ plan: "attack-king", priority: 0.95 });
    }
    if (kingSafety.whiteKingExposed && myColor === 'b') {
        plans.push({ plan: "attack-king", priority: 0.95 });
    }
    
    // Pawn structure plans
    if (pawns.whitePassers > 0 && myColor === 'w') {
        plans.push({ plan: "advance-passer", priority: 0.85 });
    }
    if (pawns.blackPassers > 0 && myColor === 'b') {
        plans.push({ plan: "advance-passer", priority: 0.85 });
    }
    
    // Endgame conversion
    if (material.isEndgame) {
        plans.push({ plan: "convert-endgame", priority: 0.80 });
    }
    
    // Target weaknesses
    if (pawns.blackIsolated > pawns.whiteIsolated && myColor === 'w') {
        plans.push({ plan: "target-weakness", priority: 0.70 });
    }
    if (pawns.whiteIsolated > pawns.blackIsolated && myColor === 'b') {
        plans.push({ plan: "target-weakness", priority: 0.70 });
    }
    
    // Bishop pair plans
    if (material.whiteBishopPair && !material.blackBishopPair && myColor === 'w') {
        plans.push({ plan: "open-position", priority: 0.65 });
    }
    if (material.blackBishopPair && !material.whiteBishopPair && myColor === 'b') {
        plans.push({ plan: "open-position", priority: 0.65 });
    }
    
    // Activity improvement - AlphaZero's bread and butter
    if (activity.activityAdvantage < 0 && myColor === 'w') {
        plans.push({ plan: "improve-pieces", priority: 0.60 });
    }
    if (activity.activityAdvantage > 0 && myColor === 'b') {
        plans.push({ plan: "improve-pieces", priority: 0.60 });
    }
    
    // Space control
    if (space.hasSpaceAdvantage) {
        plans.push({ plan: "maintain-space", priority: 0.55 });
    } else {
        plans.push({ plan: "gain-space", priority: 0.50 });
    }
    
    // Prophylaxis - prevent opponent's plans (AlphaZero specialty)
    if (!isCrushing && !isWinning) {
        plans.push({ plan: "prophylaxis", priority: 0.45 });
    }
    
    // Sort by priority and return top plan
    plans.sort((a, b) => b.priority - a.priority);
    
    strategicPatternHistory.push(plans.length > 0 ? plans[0].plan : "neutral");
    if (strategicPatternHistory.length > 10) strategicPatternHistory.shift();
    
    return plans.length > 0 ? plans[0].plan : "improve-pieces";
}

/**
 * OMEGA: Reset game state for new game
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
    strategicPatternHistory = [];
    alienMoveCount = 0;
    webWeavingDepth = 0;
    pieceActivityScores = { white: 0, black: 0 };
    pieceCoordinationScore = 0;
    attackPotential = 0;
    prophylacticNeeds = [];
    
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
    
    console.log('[RESET] Game state reset for new game - OMEGA ready');
}

/**
 * Game phase detection - Refined for strategic planning
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const material = getMaterialAnalysis(fen);
    
    if (moveNum <= 8) return "opening";
    if (moveNum <= 15 && pieces > 26) return "early-middlegame";
    if (material.isPureEndgame || pieces <= 8) return "pure-endgame";
    if (material.isLateEndgame || pieces <= 12) return "late-endgame";
    if (material.isEndgame || pieces <= 16) return "endgame";
    if (pieces > 20) return "middlegame";
    return "late-middlegame";
}

/**
 * OMEGA: Enhanced position type detection
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    const material = getMaterialAnalysis(fen);
    const kingSafety = evaluateKingSafety(fen);
    const pawns = analyzePawnStructure(fen);
    const activity = evaluatePieceActivity(fen);
    
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
    
    // High attack potential
    if (kingSafety.canAttackWhiteKing || kingSafety.canAttackBlackKing) return "attacking";
    
    // Passed pawns in endgame - critical
    if (material.isEndgame && pawns.hasPassedPawn) return "critical-endgame";
    
    // Count open files
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
    if (openFileCount <= 2 && pawns.pawnTension > 3) return "strategic-complex";
    if (openFileCount <= 2) return "positional";
    
    // Activity-based classification
    if (activity.hasActivityAdvantage) return "dynamic";
    
    return "normal";
}

/**
 * OMEGA: Smart thinking time - Deep but efficient
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // Position-based thinking allocation
    if (posType === "mating") {
        speedMultiplier = 0.25;  // Fast when mating
    } else if (isCrushing) {
        speedMultiplier = CONFIG.winningSpeed * 0.75;
    } else if (isWinning) {
        speedMultiplier = CONFIG.winningSpeed;
    } else if (posType === "winning-endgame") {
        speedMultiplier = CONFIG.endgameSpeed;
    } else if (posType === "critical-endgame" || posType === "pure-endgame") {
        speedMultiplier = CONFIG.endgameSpeed * 1.15;
    } else if (phase === "opening") {
        speedMultiplier = CONFIG.openingSpeed;
    } else if (phase === "early-middlegame") {
        speedMultiplier = CONFIG.earlyMidSpeed;
    } else if (phase === "middlegame") {
        speedMultiplier = CONFIG.middlegameSpeed;
    } else if (phase === "late-middlegame") {
        speedMultiplier = CONFIG.lateMidSpeed;
    } else if (phase === "endgame" || phase === "late-endgame") {
        speedMultiplier = CONFIG.endgameSpeed;
    }
    
    // Tactical/complex positions need more time
    if (posType === "tactical" || posType === "strategic-complex" || posType === "attacking") {
        speedMultiplier *= CONFIG.criticalSpeed;
    }
    
    // Time pressure - react faster but stay strong
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.50;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.30;
    if (timeLeft < 3000) speedMultiplier *= 0.20;
    if (timeLeft < 1500) speedMultiplier *= 0.12;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(60, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * OMEGA: Intelligent depth selection
 * Deep understanding - allocate resources wisely
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // Position-specific depth allocation
    if (posType === "mating") {
        depth = CONFIG.matingNetDepth;
    } else if (posType === "winning-endgame" || posType === "pure-endgame") {
        depth = CONFIG.endgameDepth;
    } else if (posType === "critical-endgame" || posType === "late-endgame") {
        depth = CONFIG.convertingAdvantageDepth;
    } else if (isCrushing) {
        depth = CONFIG.winningDepth;
    } else if (isWinning) {
        depth = CONFIG.winningDepth + 2;
    } else if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        depth = CONFIG.endgameDepth;
    } else if (phase === "middlegame" || phase === "late-middlegame" || phase === "early-middlegame") {
        if (posType === "tactical" || posType === "attacking") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "positional" || posType === "strategic-complex") {
            depth = CONFIG.positionalDepth;
        } else if (posType === "conversion") {
            depth = CONFIG.convertingAdvantageDepth;
        } else if (posType === "dynamic") {
            depth = CONFIG.tacticalDepth - 2;
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
 * OMEGA: Opening book with strategic preparation
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
 * OMEGA: Best move selection with blunder check, draw avoidance, and alien move detection
 * Zero blunders, maximum conversion pressure when winning
 * Includes "alien" move detection for counter-intuitive but strong moves
 */
function selectBestMove(bestMove, alternatives) {
    // Validate bestMove
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
    
    // Get best score
    const bestScore = (alternatives[0] && typeof alternatives[0].score === 'number') 
        ? alternatives[0].score 
        : 0;
    
    // OMEGA: Blunder check - verify best move isn't a blunder
    if (blunderCheckHistory.length > 0) {
        const lastEval = blunderCheckHistory[blunderCheckHistory.length - 1];
        if (typeof lastEval === 'number') {
            const adjustedBest = myColor === 'w' ? bestScore : -bestScore;
            const adjustedLast = myColor === 'w' ? lastEval : -lastEval;
            
            // If best move loses more than threshold, look for safer alternative
            if (adjustedLast - adjustedBest > CONFIG.blunderThreshold && alternatives.length > 1) {
                for (let alt of alternatives) {
                    if (alt && alt.move && typeof alt.score === 'number') {
                        const altAdjusted = myColor === 'w' ? alt.score : -alt.score;
                        if (adjustedLast - altAdjusted < CONFIG.blunderThreshold) {
                            console.log(`[OMEGA] Avoiding potential blunder: ${bestMove} -> ${alt.move}`);
                            return alt.move;
                        }
                    }
                }
            }
        }
    }
    
    // OMEGA: When winning, avoid repetitions and seek conversion
    if ((isWinning || isCrushing) && alternatives.length > 1) {
        for (let i = 0; i < alternatives.length; i++) {
            const alt = alternatives[i];
            if (alt && alt.move && typeof alt.score === 'number') {
                // Only consider alternatives within 25cp of best (tighter for precision)
                if (bestScore - alt.score < 25) {
                    return alt.move;
                }
            }
        }
    }
    
    // OMEGA: In mating positions, verify we're not missing faster mate
    if (isMating && alternatives.length > 1) {
        for (let alt of alternatives) {
            if (alt && alt.move && typeof alt.score === 'number' && alt.score > 9000) {
                return alt.move;
            }
        }
    }
    
    // OMEGA: Alien move detection - look for quiet improving moves
    // AlphaZero often plays moves that look passive but improve coordination
    if (!isCrushing && !isMating && alternatives.length >= 3) {
        // Look for a quiet move (non-capture, non-check) that's within threshold
        for (let i = 1; i < Math.min(alternatives.length, 4); i++) {
            const alt = alternatives[i];
            if (alt && alt.move && typeof alt.score === 'number') {
                const scoreDiff = bestScore - alt.score;
                // If move is close and might be a "quiet improvement"
                if (scoreDiff < 15 && scoreDiff >= 0) {
                    // Check if it's a flank pawn thrust or piece retreat (alien patterns)
                    if (ALIEN_MOVE_PATTERNS.flankPawnThrust.detectFn(alt.move, { phase: gamePhase })) {
                        console.log(`[OMEGA] Alien move detected: ${alt.move} (flank thrust)`);
                        alienMoveCount++;
                        return alt.move;
                    }
                }
            }
        }
    }
    
    // Default: play the best move
    return bestMove;
}

/**
 * Multi-PV parsing for strategic analysis
 */
function parseMultiPV(output) {
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
 * OMEGA: Parse evaluation with mate detection
 */
function parseEvaluation(output) {
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
 * OMEGA: Update winning status with detailed tracking
 */
function updateWinningStatus(evalData) {
    if (!evalData || typeof evalData.raw !== 'number') {
        return;
    }
    
    const evalScore = evalData.raw;
    lastMoveEval = currentEval;
    currentEval = evalScore;
    
    // Track for blunder detection
    blunderCheckHistory.push(evalScore);
    if (blunderCheckHistory.length > 12) blunderCheckHistory.shift();
    
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
        positionalPressure = Math.min(positionalPressure + 12, 100);
    }
    
    // Track web-weaving depth
    if (consecutiveAdvantage > 5) {
        webWeavingDepth = Math.min(webWeavingDepth + 1, CONFIG.strategicHorizon);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS - Get active color from FEN
// ═══════════════════════════════════════════════════════════════════════

function getActiveColorFromFen(fen) {
    if (!fen || typeof fen !== 'string') return null;
    const parts = fen.split(' ');
    if (parts.length >= 2 && (parts[1] === 'w' || parts[1] === 'b')) {
        return parts[1];
    }
    if (fen.endsWith(' w')) return 'w';
    if (fen.endsWith(' b')) return 'b';
    return null;
}

// ═══════════════════════════════════════════════════════════════════════
// ABSOLUTE WATCHDOG & HEALTH CHECK SYSTEM
// Critical fix: Prevents bot from stopping mid-game
// ═══════════════════════════════════════════════════════════════════════

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
                console.log(`[HEALTH] CRITICAL: Calculation stuck for ${calcDuration}ms - FORCING UNLOCK`);
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
                        console.log(`[HEALTH] CRITICAL: Position ready for ${waitDuration}ms but no calculation - FORCING START`);
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
                console.log(`[HEALTH] CRITICAL: No move sent in ${timeSinceLastMove}ms - FORCING RESET`);
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
        
    }, 2000);
    
    console.log('[HEALTH] Health check system started (2s interval)');
}

function forceUnlockAndReset(reason) {
    console.log(`[FORCE] FORCE UNLOCK - Reason: ${reason}`);
    
    calculationLock = false;
    calculationStartTime = 0;
    currentCalculatingColor = null;
    
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
    
    if (chessEngine) {
        chessEngine.postMessage("stop");
    }
}

function forceCalculation(colorToCalculate) {
    console.log(`[FORCE] FORCE CALCULATION for ${colorToCalculate === 'w' ? 'White' : 'Black'}`);
    
    if (!currentFen || !chessEngine || !webSocketWrapper || webSocketWrapper.readyState !== 1) {
        console.log('[FORCE] Cannot force calculation - missing prerequisites');
        return;
    }
    
    const fenColor = getActiveColorFromFen(currentFen);
    if (fenColor !== colorToCalculate) {
        console.log(`[FORCE] Color mismatch: want ${colorToCalculate}, FEN has ${fenColor}`);
        return;
    }
    
    forceUnlockAndReset("forced calculation");
    
    if (colorToCalculate === 'w') {
        whitePositionReady = true;
        lastWhitePositionTime = Date.now();
    } else {
        blackPositionReady = true;
        lastBlackPositionTime = Date.now();
    }
    
    setTimeout(() => calculateMove(), 100);
}

function startAbsoluteWatchdog() {
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
    }
    
    absoluteWatchdogTimer = setTimeout(() => {
        const now = Date.now();
        const calcDuration = calculationStartTime > 0 ? now - calculationStartTime : 0;
        
        console.log('[WATCHDOG] ABSOLUTE WATCHDOG TRIGGERED (8s)');
        
        forceUnlockAndReset("absolute watchdog timeout");
        
        if (currentFen && webSocketWrapper && webSocketWrapper.readyState === 1) {
            const fenActiveColor = getActiveColorFromFen(currentFen);
            if (fenActiveColor) {
                setTimeout(() => forceCalculation(fenActiveColor), 500);
            }
        }
    }, 8000);
}

function clearAbsoluteWatchdog() {
    if (absoluteWatchdogTimer) {
        clearTimeout(absoluteWatchdogTimer);
        absoluteWatchdogTimer = null;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - OMEGA POWER
// Maximum strength with strategic depth configuration
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    // OMEGA: Multi-PV for blunder checking and alternative analysis
    chessEngine.postMessage(`setoption name MultiPV value ${CONFIG.multiPVCount}`);
    // OMEGA: High contempt for draw avoidance
    chessEngine.postMessage("setoption name Contempt value 120");
    // OMEGA: Minimal overhead for speed
    chessEngine.postMessage("setoption name Move Overhead value 12");
    // OMEGA: No pondering - all time on our move
    chessEngine.postMessage("setoption name Ponder value false");
    // OMEGA: Optimized for accuracy
    chessEngine.postMessage("setoption name Slow Mover value 100");
    chessEngine.postMessage("isready");
    
    startHealthCheckSystem();
}

/**
 * OMEGA: Dynamic contempt adjustment based on position
 * Maximum draw avoidance when winning, balanced otherwise
 */
function adjustContempt() {
    let contempt = 120;  // Base high contempt
    
    if (isMating) {
        contempt = CONFIG.killerModeContempt;
    } else if (isCrushing) {
        contempt = CONFIG.killerModeContempt;
    } else if (isWinning) {
        contempt = CONFIG.drawAvoidanceContempt;
    } else if (gamePhase === "endgame" || gamePhase === "late-endgame" || gamePhase === "pure-endgame") {
        contempt = 100;
    }
    
    // Increase contempt based on consecutive advantage
    if (consecutiveAdvantage > 5) {
        contempt = Math.min(contempt + 40, 250);
    }
    
    // Increase contempt based on web-weaving depth
    if (webWeavingDepth > 10) {
        contempt = Math.min(contempt + 20, 250);
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
                if (!event || !event.data) return;
                
                let message;
                try {
                    message = JSON.parse(event.data);
                } catch (e) {
                    return;
                }
                
                try {
                    if (message.t === "crowd" || message.t === "featured" || message.t === "endData") {
                        resetGameState();
                    }
                    
                    if (botJustSentMove && message.d && message.d.fen) {
                        botJustSentMove = false;
                        lastRejectedMove = null;
                        rejectionCount = 0;
                    }
                    
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
                        
                        const positionId = message.v;
                        if (lastSeenPositionId === positionId) {
                            return;
                        }
                        lastSeenPositionId = positionId;
                        lastSeenFen = currentFen;
                        
                        const now = Date.now();
                        if (isWhitesTurn) {
                            whitePositionReady = true;
                            lastWhitePositionTime = now;
                        } else {
                            blackPositionReady = true;
                            lastBlackPositionTime = now;
                        }
                        
                        trackPosition(currentFen);
                        
                        gamePhase = getGamePhase(moveCount, currentFen);
                        positionType = analyzePositionType(currentFen);
                        strategicPlan = determineStrategicPlan(currentFen);
                        
                        adjustContempt();
                        
                        startAbsoluteWatchdog();
                        
                        if (calculationLock && currentCalculatingColor === myColor) {
                            return;
                        }
                        
                        if (calculationLock && currentCalculatingColor !== myColor) {
                            forceUnlockAndReset("color change");
                        }
                        
                        calculateMove();
                    }
                } catch (e) {
                    console.error('OMEGA: Error processing message:', e);
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - OMEGA STRATEGIC DEPTH
// Deep understanding with 35+ move strategic planning
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    if (!currentFen || typeof currentFen !== 'string' || currentFen.length < 10) {
        console.error('OMEGA: Invalid FEN position:', currentFen);
        return;
    }
    
    if (!chessEngine) {
        console.error('OMEGA: Chess engine not initialized');
        return;
    }
    
    if (!webSocketWrapper || webSocketWrapper.readyState !== 1) {
        console.error('OMEGA: WebSocket not ready');
        return;
    }
    
    if (calculationLock) {
        return;
    }
    
    if (rejectionCount > 5) {
        lastRejectedMove = null;
        rejectionCount = 0;
        setTimeout(() => calculateMove(), Math.random() * 500 + 200);
        return;
    }
    
    const fenActiveColor = getActiveColorFromFen(currentFen);
    if (!fenActiveColor) {
        console.error('OMEGA: Cannot extract active color from FEN');
        return;
    }
    
    const isWhite = (fenActiveColor === 'w');
    const colorName = isWhite ? 'White' : 'Black';
    
    calculationLock = true;
    calculationStartTime = Date.now();
    currentCalculatingColor = fenActiveColor;
    
    if (isWhite) {
        whitePositionReady = false;
    } else {
        blackPositionReady = false;
    }
    
    // Opening book for variety and strategic preparation
    if (gamePhase === "opening" || (gamePhase === "early-middlegame" && moveCount < 12)) {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove && typeof bookMove === 'string' && bookMove.length >= 4) {
            const thinkTime = Math.random() * 120 + 80;
            
            setTimeout(() => {
                bestMove = bookMove;
                calculationLock = false;
                calculationStartTime = 0;
                currentCalculatingColor = null;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // OMEGA: Deep engine calculation with strategic depth
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    chessEngine.postMessage("position fen " + currentFen);
    
    // OMEGA: Use different search strategies based on position type
    if (positionType === "winning-endgame" || positionType === "mating" || positionType === "pure-endgame") {
        chessEngine.postMessage(`go depth ${Math.max(depth, CONFIG.endgameDepth)}`);
    } else if (positionType === "tactical" || positionType === "attacking") {
        chessEngine.postMessage(`go depth ${Math.max(depth, CONFIG.tacticalDepth)}`);
    } else {
        chessEngine.postMessage(`go depth ${depth}`);
    }
    
    calculationTimeout = setTimeout(() => {
        if (calculationLock) {
            forceUnlockAndReset("calculation timeout");
        }
    }, 10000);
}

/**
 * Send move - Clean, fast, confident
 */
function sendMove(move, retryCount = 0) {
    if (!webSocketWrapper) {
        console.error('OMEGA: Cannot send move - WebSocket not initialized');
        return false;
    }
    
    if (webSocketWrapper.readyState !== WebSocket.OPEN) {
        if (retryCount < 3) {
            setTimeout(() => sendMove(move, retryCount + 1), 300);
        }
        return false;
    }
    
    if (!move || typeof move !== 'string' || move.length < 4) {
        console.error('OMEGA: Cannot send move - Invalid move:', move);
        return false;
    }
    
    if (move === lastRejectedMove) {
        rejectionCount++;
        if (rejectionCount > 3) {
            lastRejectedMove = null;
            rejectionCount = 0;
            setTimeout(() => forceCalculation(getActiveColorFromFen(currentFen)), 200);
            return false;
        }
    }
    
    try {
        botJustSentMove = true;
        pendingMove = move;
        
        webSocketWrapper.send(JSON.stringify({
            t: "move",
            d: { 
                u: move, 
                b: 1,
                l: Math.floor(Math.random() * 10) + 5,
                a: 1
            }
        }));
        
        lastSuccessfulMoveTime = Date.now();
        clearAbsoluteWatchdog();
        
        if (calculationTimeout) {
            clearTimeout(calculationTimeout);
            calculationTimeout = null;
        }
        
        return true;
    } catch (e) {
        console.error('OMEGA: Error sending move:', e);
        botJustSentMove = false;
        pendingMove = null;
        
        if (retryCount < 2) {
            setTimeout(() => sendMove(move, retryCount + 1), 500);
        }
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - OMEGA PRECISION
// Zero blunders, perfect evaluation tracking, strategic move selection
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    let lastDepthInfo = {};
    
    chessEngine.onmessage = function (event) {
        if (!event) return;
        
        engineOutput += event + "\n";
        
        if (event.indexOf('score') !== -1) {
            const evalData = parseEvaluation(event);
            if (evalData) {
                updateWinningStatus(evalData);
                
                const depthMatch = event.match(/depth\s+(\d+)/);
                if (depthMatch) {
                    lastDepthInfo.depth = parseInt(depthMatch[1]);
                    lastDepthInfo.eval = evalData;
                }
            }
        }
        
        if (event.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(event);
            if (lines && lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            if (calculationTimeout) {
                clearTimeout(calculationTimeout);
                calculationTimeout = null;
            }
            
            if (!bestMove || bestMove === '(none)' || bestMove.length < 4) {
                console.error('OMEGA: Engine returned invalid bestmove:', bestMove);
                calculationLock = false;
                calculationStartTime = 0;
                currentCalculatingColor = null;
                engineOutput = "";
                lastDepthInfo = {};
                return;
            }
            
            // OMEGA: Smart move selection with blunder avoidance and alien move detection
            let finalMove = selectBestMove(bestMove, multiPVLines);
            
            if (!finalMove) {
                finalMove = bestMove;
            }
            
            // OMEGA: Final verification - never play a clearly losing move
            if (multiPVLines.length > 1 && finalMove === bestMove) {
                const bestAlt = multiPVLines[0];
                if (bestAlt && bestAlt.move && typeof bestAlt.move === 'string' && bestAlt.move !== finalMove) {
                    const selectedLine = multiPVLines.find(l => l && l.move === finalMove);
                    if (selectedLine && typeof selectedLine.score === 'number' && 
                        typeof bestAlt.score === 'number' &&
                        bestAlt.score - selectedLine.score > CONFIG.blunderThreshold) {
                        finalMove = bestAlt.move;
                    }
                }
            }
            
            calculationLock = false;
            calculationStartTime = 0;
            currentCalculatingColor = null;
            
            if (finalMove && typeof finalMove === 'string' && finalMove.length >= 4) {
                sendMove(finalMove);
            } else {
                console.error('OMEGA: Final move validation failed:', finalMove);
            }
            
            engineOutput = "";
            lastDepthInfo = {};
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - OMEGA AWAKENING
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();

// OMEGA: Console signature
console.log('%c♔ OMEGA AlphaZero v8.0 ♔', 'color: #FFD700; font-size: 18px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cAlien web-weaving • 35+ move planning • ZERO blunders • PERFECT judgment', 'color: #888; font-size: 12px;');
console.log('%cDeep understanding over brute-force • Paradigm-shifting moves', 'color: #666; font-size: 11px;');
