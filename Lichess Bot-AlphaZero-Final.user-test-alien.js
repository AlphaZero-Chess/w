// ==UserScript==
// @name         Lichess Bot - AlphaZero ALIEN++
// @description  ALIEN++ AlphaZero-style - Enhanced winning consistency, flawless conversion
// @author       AlphaZero - Alien++ Edition
// @version      6.0.0-ALIEN-PLUS
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION - ALIEN MODE (Cold, Optimal, Unbeatable)
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // SMART Depths - FAST like stable version, efficient not bruteforce
    baseDepth: 12,          // Was 16, restored to fast
    tacticalDepth: 14,      // Was 20, restored to fast  
    positionalDepth: 13,    // Was 18, restored to fast
    endgameDepth: 14,       // Was 20, restored to fast
    openingDepth: 10,       // Was 14, restored to fast
    winningDepth: 11,       // Was 14, restored to fast (efficiency when winning)
    criticalDepth: 16,      // Was 22, restored to fast
    conversionDepth: 13,    // Was 18, restored to fast
    
    // NO mistakes - Pure engine perfection
    humanMistakeRate: 0,
    
    // Timing - Fast and efficient (RESTORED from stable)
    thinkingTimeMin: 80,
    thinkingTimeMax: 400,   // Reduced for faster play
    
    // Speed multipliers - Quick decisive play (keep same)
    openingSpeed: 0.25,
    earlyMidSpeed: 0.5,
    middlegameSpeed: 0.6,
    lateMidSpeed: 0.55,
    endgameSpeed: 0.4,
    criticalSpeed: 0.8,
    winningSpeed: 0.3,     // Fast when winning
    
    // Time thresholds
    panicThreshold: 5000,
    criticalThreshold: 10000,
    
    // ALIEN++ aggression settings - Refined for consistency
    winningThreshold: 150,       // Lower threshold = recognize advantages earlier
    crushingThreshold: 400,      // Centipawns to consider "crushing"
    slightAdvantage: 75,         // ALIEN: Recognize small edges
    drawAvoidanceContempt: 100,  // High contempt to avoid draws
    killerModeContempt: 150,     // Maximum aggression when winning
    conversionContempt: 120,     // ALIEN: Contempt during conversion phase
    
    // ALIEN++ Draw prevention - Critical for consistency
    maxRepetitions: 1,           // Avoid same position more than once when winning
    altMoveTolerance: 40,        // Centipawns tolerance for alternative moves
    forceProgressMoves: 25,      // Force progress after this many moves in winning position
    
    // ALIEN++ Endgame conversion
    endgameMaterialThreshold: 2500, // Total material for endgame
    queenEndgameBonus: 50,       // Bonus eval for having queen in endgame
    rookEndgameBonus: 30         // Bonus eval for having rook pair
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO-STYLE OPENING BOOK - Aggressive, Sharp & Dynamic
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - AlphaZero prefers d4 (more complex, harder to draw)
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },
            { move: "e2e4", weight: 0.35 },
            { move: "c2c4", weight: 0.15 }  // English - flexible
        ]
    },
    // After 1.e4 - Sicilian (fighting), e5 for classical
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.50 },  // Sicilian - fighting
            { move: "e7e5", weight: 0.30 },  // Classical
            { move: "c7c6", weight: 0.12 },  // Caro-Kann solid
            { move: "e7e6", weight: 0.08 }   // French
        ]
    },
    // After 1.d4 - Nf6 for Indian complexity
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.55 },  // Indian setups
            { move: "d7d5", weight: 0.30 },  // Classical
            { move: "f7f5", weight: 0.15 }   // Dutch - aggressive
        ]
    },
    // Sicilian - Open Sicilian with Nf3
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.70 },  // Main line
            { move: "b1c3", weight: 0.20 },  // Closed Sicilian
            { move: "f2f4", weight: 0.10 }   // Grand Prix Attack
        ]
    },
    // Sicilian after Nf3 - d6 Najdorf prep
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.45 },  // Najdorf/Dragon prep
            { move: "b8c6", weight: 0.30 },  // Classical
            { move: "e7e6", weight: 0.25 }   // Scheveningen
        ]
    },
    // Sicilian d4 - Open it up (ALIEN++ aggressive)
    "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "c5d4", weight: 0.85 },  // Accept the challenge
            { move: "g8f6", weight: 0.15 }
        ]
    },
    // Italian Game - Two Knights or Giuoco Piano
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.55 },  // Two Knights - sharp
            { move: "f8c5", weight: 0.45 }   // Giuoco Piano
        ]
    },
    // Italian - After Nf6, go for sharp d5
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },  // Sharp central break
            { move: "b1c3", weight: 0.30 },  // Development
            { move: "d2d3", weight: 0.20 }   // Slow Italian
        ]
    },
    // QGD positions - Slav or QGD
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "c7c6", weight: 0.40 },  // Slav - solid
            { move: "e7e6", weight: 0.35 },  // QGD classical
            { move: "d5c4", weight: 0.15 },  // QGA
            { move: "g8f6", weight: 0.10 }   // Flexible
        ]
    },
    // King's Indian Defense - Aggressive setup
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.45 },  // Main line
            { move: "g1f3", weight: 0.35 },  // Flexible
            { move: "e2e4", weight: 0.20 }   // Four Pawns Attack - aggressive
        ]
    },
    // Nf3 systems
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.40 },
            { move: "g8f6", weight: 0.35 },
            { move: "c7c5", weight: 0.25 }
        ]
    },
    // London counter - Fight for center
    "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.50 },  // Challenge center
            { move: "g8f6", weight: 0.30 },
            { move: "c8f5", weight: 0.20 }   // Mirror
        ]
    },
    // Catalan - Fianchetto
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g2g3", weight: 0.60 },  // Catalan
            { move: "g1f3", weight: 0.25 },
            { move: "b1c3", weight: 0.15 }
        ]
    },
    // Ruy Lopez - Spanish torture
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f1b5", weight: 0.55 },  // Ruy Lopez - AlphaZero favorite
            { move: "f1c4", weight: 0.35 },  // Italian
            { move: "d2d4", weight: 0.10 }   // Scotch
        ]
    },
    // Ruy Lopez - Black's response
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },  // Morphy Defense
            { move: "g8f6", weight: 0.35 },  // Berlin - solid
            { move: "f7f5", weight: 0.15 }   // Schliemann - aggressive
        ]
    },
    // Nimzo-Indian - Sharp play
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "f8b4", weight: 0.50 },  // Nimzo-Indian
            { move: "d7d5", weight: 0.30 },  // QGD
            { move: "b7b6", weight: 0.20 }   // Queen's Indian
        ]
    },
    // Queen's Gambit Accepted
    "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.40 },  // Central control
            { move: "g1f3", weight: 0.40 },  // Development first
            { move: "e2e3", weight: 0.20 }   // Slow recapture
        ]
    },
    // Caro-Kann - Advance or Exchange
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.45 },  // Classical
            { move: "b1c3", weight: 0.30 },  // Two Knights
            { move: "e4e5", weight: 0.25 }   // Advance - space
        ]
    },
    // French Defense - Advance variation
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },  // Main line
            { move: "e4e5", weight: 0.30 },  // Advance - AlphaZero style
            { move: "b1c3", weight: 0.15 }
        ]
    },
    // ALIEN++ Additional key positions
    // Sicilian Najdorf after 5.Nc3
    "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq -": {
        black: [
            { move: "e7e5", weight: 0.45 },  // Najdorf main line
            { move: "e7e6", weight: 0.35 },  // Scheveningen structure
            { move: "g7g6", weight: 0.20 }   // Dragon-ish
        ]
    },
    // English Opening - c4
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e5", weight: 0.40 },  // Reversed Sicilian
            { move: "g8f6", weight: 0.35 },  // Flexible
            { move: "c7c5", weight: 0.25 }   // Symmetrical
        ]
    },
    // Scotch Game - aggressive
    "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "e5d4", weight: 0.70 },  // Accept
            { move: "d7d6", weight: 0.30 }   // Philidor-like
        ]
    },
    // Petroff Defense
    "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f3e5", weight: 0.55 },  // Main line
            { move: "b1c3", weight: 0.30 },  // Three Knights
            { move: "d2d4", weight: 0.15 }   // Direct
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - Enhanced with Position Tracking
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

// ALIEN++: Position history for repetition avoidance
let positionHistory = {};
let currentEval = 0;
let isWinning = false;
let isCrushing = false;
let hasSlightAdvantage = false;
let winningMoveCount = 0;      // ALIEN++: Track moves since gaining advantage
let lastProgressMove = 0;       // ALIEN++: Track when last progress was made

// ALIEN++: Enhanced endgame patterns for conversion
const WINNING_ENDGAMES = {
    KQvK: true,   // King + Queen vs King
    KRvK: true,   // King + Rook vs King
    KRRvK: true,  // King + 2 Rooks vs King
    KQQvK: true,  // King + 2 Queens vs King
    KBBvK: true,  // King + 2 Bishops vs King
    KBNvK: true,  // King + Bishop + Knight vs King
    KPvK: true,   // King + Pawn vs King (usually)
    KQPvK: true,  // King + Queen + Pawn vs King
    KRPvK: true,  // King + Rook + Pawn vs King
    KRRPvK: true  // King + 2 Rooks + Pawn vs King
};

// ALIEN++: Piece square tables for positional understanding (simplified AlphaZero patterns)
const PIECE_ACTIVITY = {
    // Knight is better in center
    knight: {
        center: 20,     // d4, d5, e4, e5
        extended: 10,   // c3-f3, c6-f6
        rim: -10        // a/h files
    },
    // Bishop is better on long diagonals
    bishop: {
        longDiag: 15,
        active: 10,
        trapped: -30
    },
    // Rook on open files
    rook: {
        openFile: 25,
        seventhRank: 30,
        connected: 15
    },
    // King safety
    king: {
        castled: 30,
        exposed: -40,
        endgameCenter: 20
    }
};

// ═══════════════════════════════════════════════════════════════════════
// POSITION ANALYSIS - ALIEN Precision
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
 * ALIEN: Material counting for advantage detection
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
 * ALIEN: Detect piece configuration for endgame knowledge
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
 * ALIEN: Check if position is a known winning endgame
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
 * ALIEN: Track position for repetition avoidance
 */
function trackPosition(fen) {
    const posKey = fen.split(' ').slice(0, 4).join(' ');
    positionHistory[posKey] = (positionHistory[posKey] || 0) + 1;
    return positionHistory[posKey];
}

/**
 * ALIEN: Check if move leads to repetition
 */
function wouldRepeat(fen) {
    const posKey = fen.split(' ').slice(0, 4).join(' ');
    return (positionHistory[posKey] || 0) >= CONFIG.maxRepetitions;
}

/**
 * ALIEN++: Reset position history on new game
 */
function resetGameState() {
    positionHistory = {};
    currentEval = 0;
    isWinning = false;
    isCrushing = false;
    hasSlightAdvantage = false;
    moveCount = 0;
    winningMoveCount = 0;
    lastProgressMove = 0;
}

/**
 * ALIEN++: Calculate total material on board
 */
function getTotalMaterial(fen) {
    const board = fen.split(' ')[0];
    const pieceValues = { 'Q': 900, 'R': 500, 'B': 330, 'N': 320, 'P': 100,
                          'q': 900, 'r': 500, 'b': 330, 'n': 320, 'p': 100 };
    let total = 0;
    
    for (let i = 0; i < board.length; i++) {
        const char = board[i];
        if (pieceValues[char]) {
            total += pieceValues[char];
        }
    }
    
    return total;
}

/**
 * ALIEN++: Check if position is a capture or pawn move (progress indicators)
 */
function isProgressMove(move, fen) {
    if (!move || move.length < 4) return false;
    
    // Pawn moves are progress
    const fromSquare = move.substring(0, 2);
    const toSquare = move.substring(2, 4);
    const board = fen.split(' ')[0];
    
    // Check for captures (different destination piece)
    // This is simplified - full implementation would need board tracking
    return move.length === 5 || toSquare[1] === '8' || toSquare[1] === '1';
}

/**
 * Game phase detection - Precise for depth selection
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    
    if (moveNum <= 8) return "opening";
    if (moveNum <= 15 && pieces > 26) return "early-middlegame";
    if (pieces > 18) return "middlegame";
    if (pieces > 10) return "late-middlegame";
    return "endgame";
}

/**
 * ALIEN++: Enhanced position type detection
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    const totalMaterial = getTotalMaterial(fen);
    
    // Check indication - tactical
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // ALIEN++: Known winning endgame - prioritize conversion
    if (isKnownWinningEndgame(fen)) return "winning-endgame";
    
    // ALIEN++: If crushing, focus on conversion
    if (isCrushing) return "conversion";
    
    // ALIEN++: If winning, look for conversion opportunities
    if (isWinning) {
        // In low material situations, focus on technique
        if (totalMaterial < CONFIG.endgameMaterialThreshold) {
            return "endgame-conversion";
        }
        return "conversion";
    }
    
    // ALIEN++: Slight advantage - maintain pressure
    if (hasSlightAdvantage) return "pressing";
    
    // Count open files (more open = more tactical)
    let openFileCount = 0;
    const ranks = board.split('/');
    let pawnFiles = [false, false, false, false, false, false, false, false];
    let whitePawns = 0;
    let blackPawns = 0;
    
    for (let rank of ranks) {
        let file = 0;
        for (let i = 0; i < rank.length; i++) {
            const c = rank[i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'P') {
                    pawnFiles[file] = true;
                    whitePawns++;
                } else if (c === 'p') {
                    pawnFiles[file] = true;
                    blackPawns++;
                }
                file++;
            }
        }
    }
    
    for (let i = 0; i < 8; i++) {
        if (!pawnFiles[i]) openFileCount++;
    }
    
    // ALIEN++: Low pawn count = more tactical endgame
    if (whitePawns + blackPawns <= 4 && totalMaterial < 3000) {
        return "endgame";
    }
    
    if (openFileCount >= 4) return "tactical";
    if (openFileCount <= 2) return "positional";
    
    return "normal";
}

/**
 * ALIEN: Smart thinking time - efficient, no wasted time
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // ALIEN: Play faster when winning (confidence)
    if (isCrushing) {
        speedMultiplier = CONFIG.winningSpeed * 0.7;
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
        speedMultiplier = CONFIG.endgameSpeed;
    }
    
    // Tactical positions need more time
    if (posType === "tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    }
    
    // Time pressure - react faster
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.5;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.3;
    if (timeLeft < 3000) speedMultiplier *= 0.2;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(60, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * ALIEN++: Smart depth selection - efficient, not bruteforce
 * Key insight: Use appropriate depth for position complexity
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // ALIEN++: Position-specific depth selection
    if (posType === "winning-endgame") {
        // Known winning - use tablebases knowledge, moderate depth
        depth = CONFIG.endgameDepth;
    } else if (posType === "endgame-conversion") {
        // Endgame conversion needs precision
        depth = CONFIG.endgameDepth;
    } else if (isCrushing) {
        // Crushing advantage - play efficiently, don't overthink
        depth = CONFIG.winningDepth;
    } else if (isWinning) {
        // Winning but not crushing - careful conversion
        depth = CONFIG.conversionDepth;
    } else if (hasSlightAdvantage && posType === "pressing") {
        // Slight advantage - maintain precision
        depth = CONFIG.positionalDepth;
    } else if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        depth = CONFIG.endgameDepth;
    } else if (phase === "middlegame" || phase === "late-middlegame" || phase === "early-middlegame") {
        if (posType === "tactical") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "positional") {
            depth = CONFIG.positionalDepth;
        }
    }
    
    // ALIEN++: Force higher depth if we've been winning too long without progress
    if (isWinning && winningMoveCount > CONFIG.forceProgressMoves) {
        depth = Math.min(depth + 2, CONFIG.criticalDepth);
    }
    
    // Time pressure depth reduction - but still strong
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(12, depth - 2);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(10, depth - 4);
    if (timeLeft < 3000) depth = Math.max(8, depth - 6);
    
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
 * ALIEN++: Enhanced best move selection with advanced draw avoidance
 * This is the core of winning consistency
 */
function selectBestMove(bestMove, alternatives) {
    // No alternatives? Use best move
    if (!alternatives || alternatives.length <= 1) {
        return bestMove;
    }
    
    const bestMoveScore = alternatives[0] ? alternatives[0].score : 0;
    
    // ALIEN++: When winning, implement sophisticated draw avoidance
    if (isWinning || isCrushing || hasSlightAdvantage) {
        
        // Check if we've been winning for too long without progress
        const needsProgress = winningMoveCount > CONFIG.forceProgressMoves;
        
        for (let i = 0; i < alternatives.length; i++) {
            const alt = alternatives[i];
            const scoreDiff = bestMoveScore - alt.score;
            
            // ALIEN++: Dynamic tolerance based on advantage size
            let tolerance = CONFIG.altMoveTolerance;
            if (isCrushing) {
                tolerance = 80;  // More flexibility when crushing
            } else if (isWinning) {
                tolerance = 50;  // Moderate flexibility when winning
            } else if (hasSlightAdvantage) {
                tolerance = 30;  // Careful with slight advantages
            }
            
            // Only consider alternatives within tolerance
            if (scoreDiff <= tolerance) {
                // ALIEN++: Prefer moves that don't repeat positions
                const moveKey = alt.move;
                
                // If this move is not the best move but is within tolerance
                if (i > 0) {
                    // Check if best move might lead to repetition
                    // Prefer alternative if it breaks repetition pattern
                    if (needsProgress) {
                        return alt.move;  // Take the alternative to make progress
                    }
                    
                    // Random selection among good alternatives for variety
                    if (Math.random() < 0.15) {  // 15% chance to take alternative
                        return alt.move;
                    }
                }
            }
        }
    }
    
    // ALIEN++: In equal/losing positions, always play the best move
    return bestMove;
}

/**
 * ALIEN++: Check if a move is a "progress" move (pawn move, capture, or check)
 * Progress moves reset draw counters and show aggression
 */
function isMoveProgressive(move, alternatives) {
    if (!move || move.length < 4) return false;
    
    // Promotion is always progress
    if (move.length === 5) return true;
    
    // Check if this move has significantly higher eval (indicates capture/tactics)
    if (alternatives && alternatives.length >= 2) {
        const bestScore = alternatives[0].score;
        const secondScore = alternatives[1].score;
        
        // Big eval difference suggests tactical move
        if (bestScore - secondScore > 100) return true;
    }
    
    return false;
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
 * ALIEN++: Update winning status from evaluation with progress tracking
 */
function updateWinningStatus(eval_score) {
    const previouslyWinning = isWinning || isCrushing;
    currentEval = eval_score;
    
    // Adjust for color
    const adjustedEval = myColor === 'w' ? eval_score : -eval_score;
    
    // Update status flags
    const wasCrushing = isCrushing;
    const wasWinning = isWinning;
    
    isCrushing = adjustedEval >= CONFIG.crushingThreshold;
    isWinning = adjustedEval >= CONFIG.winningThreshold;
    hasSlightAdvantage = adjustedEval >= CONFIG.slightAdvantage && !isWinning;
    
    // ALIEN++: Track how long we've been winning
    if (isWinning || isCrushing) {
        winningMoveCount++;
    } else {
        winningMoveCount = 0;
    }
    
    // ALIEN++: Detect if we're making progress (eval improving)
    if (isWinning && !wasWinning) {
        // Just started winning - reset progress counter
        lastProgressMove = moveCount;
    } else if (isCrushing && !wasCrushing) {
        // Upgraded to crushing - that's progress
        lastProgressMove = moveCount;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - ALIEN POWER
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    chessEngine.postMessage("setoption name MultiPV value 3");
    chessEngine.postMessage("setoption name Contempt value 75");   // ALIEN: Higher contempt to avoid draws
    chessEngine.postMessage("setoption name Move Overhead value 20");
    chessEngine.postMessage("setoption name Ponder value false");
    chessEngine.postMessage("isready");
}

/**
 * ALIEN++: Dynamically adjust engine contempt based on position
 * Higher contempt = more aggressive, avoid draws
 */
function adjustContempt() {
    let contempt = 75;  // Default
    
    if (isCrushing) {
        // Maximum aggression when crushing - close out the game
        contempt = CONFIG.killerModeContempt;
    } else if (isWinning) {
        // High contempt when winning - avoid draws at all costs
        contempt = CONFIG.drawAvoidanceContempt;
        
        // ALIEN++: Increase contempt if winning for too long (force progress)
        if (winningMoveCount > CONFIG.forceProgressMoves) {
            contempt = CONFIG.killerModeContempt;
        }
    } else if (hasSlightAdvantage) {
        // Moderate contempt with slight advantage
        contempt = CONFIG.conversionContempt;
    } else if (positionType === "pressing") {
        // Pressing position - maintain pressure
        contempt = 90;
    }
    
    chessEngine.postMessage("setoption name Contempt value " + contempt);
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION (STABLE - Unchanged from working version)
// ═══════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    let webSocket = window.WebSocket;
    const webSocketProxy = new Proxy(webSocket, {
        construct: function (target, args) {
            let wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                let message = JSON.parse(event.data);
                
                // ALIEN: Detect new game start
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
                    
                    // ALIEN: Track position for repetition
                    trackPosition(currentFen);
                    
                    gamePhase = getGamePhase(moveCount, currentFen);
                    positionType = analyzePositionType(currentFen);
                    
                    // ALIEN: Adjust contempt based on winning status
                    adjustContempt();
                    
                    calculateMove();
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - ALIEN PRECISION
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book for variety
    if (gamePhase === "opening" || gamePhase === "early-middlegame") {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // Fast book moves - no unnecessary delay
            const thinkTime = Math.random() * 120 + 80;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // ALIEN engine calculation
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
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
            l: Math.floor(Math.random() * 15) + 8,
            a: 1
        }
    }));
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - ALIEN++ PRECISION
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    let lastDepthSeen = 0;
    
    chessEngine.onmessage = function (event) {
        // ALIEN++: Safely convert event to string (handles both string and object formats)
        const message = typeof event === 'string' ? event : String(event);
        engineOutput += message + "\n";
        
        // ALIEN++: Parse evaluation for winning status
        if (message.indexOf('score') !== -1) {
            const evalScore = parseEvaluation(message);
            updateWinningStatus(evalScore);
            
            // Track depth progress
            const depthMatch = message.match(/depth\s+(\d+)/);
            if (depthMatch) {
                lastDepthSeen = parseInt(depthMatch[1]);
            }
        }
        
        if (message.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(message);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        if (message && message.indexOf('bestmove') !== -1) {
            const moveParts = message.split(" ");
            bestMove = moveParts[1];
            
            // ALIEN++: Smart move selection with enhanced draw avoidance
            let finalMove = selectBestMove(bestMove, multiPVLines);
            
            // ALIEN++: Track if this move is progressive
            if (isWinning || isCrushing) {
                if (isMoveProgressive(finalMove, multiPVLines)) {
                    lastProgressMove = moveCount;
                }
            }
            
            sendMove(finalMove);
            engineOutput = "";
            lastDepthSeen = 0;
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
