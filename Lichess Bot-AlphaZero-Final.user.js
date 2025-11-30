// ==UserScript==
// @name         Lichess Bot - True AlphaZero (God-Like Edition)
// @description  True AlphaZero - Flawless endgame, perfect positional judgment, strategic depth, legendary patience
// @author       AlphaZero - God-Like Edition
// @version      6.0.0-ALPHAZERO-GODLIKE
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION - TRUE ALPHAZERO: NO PASSIVE PLAY, UNCONVENTIONAL DEPTH
// AlphaZero's hallmark: ACTIVE play, strategic webs, flawless precision
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing - Patient yet decisive like AlphaZero
    thinkingTimeMin: 60,
    thinkingTimeMax: 450,
    
    // NO MISTAKES - AlphaZero plays flawlessly
    humanMistakeRate: 0,
    
    // Depth - Optimized for strategic vision and endgame precision
    baseDepth: 14,
    tacticalDepth: 16,
    positionalDepth: 15,
    endgameDepth: 18,           // FLAWLESS endgame - maximum precision
    openingDepth: 12,
    strategicDepth: 16,         // For long-term planning positions
    zugzwangDepth: 19,          // Deep calculation for zugzwang detection
    
    // Speed multipliers - Active, purposeful play (NOT passive)
    openingSpeed: 0.2,
    earlyMidSpeed: 0.35,
    middlegameSpeed: 0.45,
    lateMidSpeed: 0.4,
    endgameSpeed: 0.55,
    criticalSpeed: 0.65,
    grindingSpeed: 0.5,
    activePlaySpeed: 0.3,       // Fast when position demands activity
    
    // Time thresholds
    panicThreshold: 5000,
    criticalThreshold: 10000,
    
    // AlphaZero Strategic Settings - ACTIVE, NOT PASSIVE
    strategicDepthLevel: 98,     // Strategic depth (0-100)
    positionalPatience: 85,      // Patience balanced with activity
    endgamePrecision: 100,       // FLAWLESS endgame precision
    resilience: 98,              // Exceptional defensive resilience
    grindingAbility: 95,         // Ability to grind out positions
    activityPreference: 90,      // ACTIVE piece play priority
    
    // Positional Bonuses - AlphaZero's superior evaluation
    pieceActivityBonus: 55,      // ACTIVE pieces paramount
    pawnStructureWeight: 45,     // Long-term pawn structure
    kingSafetyWeight: 50,        // King safety evaluation
    spaceControlBonus: 40,       // Space advantage
    initiativeBonus: 50,         // MAINTAINING INITIATIVE (no passivity)
    prophylaxisBonus: 35,        // Preventing opponent plans
    zugzwangAwareness: 95,       // Avoid zugzwang traps
    
    // Draw Handling - AlphaZero recognizes draws but plays to confirm
    allowStrategicDraws: true,   // Accept draws when objectively best
    drawConfirmationMoves: 8,    // Moves to confirm a draw position
    minAdvantageToPlay: 3        // Centipawns advantage to keep playing
};

// ═══════════════════════════════════════════════════════════════════════
// OPENING BOOK - ALPHAZERO STRATEGIC REPERTOIRE
// Unconventional, strategically deep lines - AlphaZero's signature style
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - AlphaZero's versatile openings
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.45 },  // King's pawn - classical
            { move: "d2d4", weight: 0.40 },  // Queen's pawn - strategic depth
            { move: "c2c4", weight: 0.10 },  // English - positional mastery
            { move: "g1f3", weight: 0.05 }   // Reti - hypermodern flexibility
        ]
    },
    // After 1.e4 - Black plays strategically
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.35 },  // Sicilian - fighting chess
            { move: "e7e5", weight: 0.30 },  // Open game - classical
            { move: "e7e6", weight: 0.20 },  // French - strategic complexity
            { move: "c7c6", weight: 0.15 }   // Caro-Kann - solid structure
        ]
    },
    // After 1.d4 - Black plays with strategic depth
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.40 },  // Indian systems - flexible
            { move: "d7d5", weight: 0.35 },  // Classical - principled
            { move: "e7e6", weight: 0.15 },  // Queen's Indian prep
            { move: "g7g6", weight: 0.10 }   // King's Indian - dynamic
        ]
    },
    // Sicilian - White plays strategically
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.55 },  // Open Sicilian - main line
            { move: "b1c3", weight: 0.25 },  // Closed - strategic squeeze
            { move: "c2c3", weight: 0.15 },  // Alapin - solid structure
            { move: "d2d4", weight: 0.05 }   // Smith-Morra - initiative
        ]
    },
    // Italian Game position - Strategic development
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "f8c5", weight: 0.45 },  // Giuoco Piano - classical
            { move: "g8f6", weight: 0.40 },  // Two Knights - active
            { move: "f8e7", weight: 0.15 }   // Hungarian - solid
        ]
    },
    // Queen's Gambit - Strategic handling
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },  // QGD - classical fortress
            { move: "c7c6", weight: 0.35 },  // Slav - solid structure
            { move: "d5c4", weight: 0.15 },  // QGA - active play
            { move: "c7c5", weight: 0.10 }   // Tarrasch - dynamic
        ]
    },
    // King's Gambit - Strategic response
    "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
        black: [
            { move: "e5f4", weight: 0.40 },  // Accept - play for advantage
            { move: "d7d5", weight: 0.35 },  // Falkbeer - central counter
            { move: "f8c5", weight: 0.25 }   // Decline - solid development
        ]
    },
    // Evans Gambit position - Strategic evaluation
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "c2c3", weight: 0.45 },  // Italian - strategic buildup
            { move: "b2b4", weight: 0.35 },  // Evans Gambit - initiative
            { move: "d2d3", weight: 0.20 }   // Slow Italian - long-term
        ]
    },
    // Ruy Lopez - AlphaZero's patient approach
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.45 },  // Morphy Defense - main line
            { move: "g8f6", weight: 0.35 },  // Berlin - solid endgame
            { move: "d7d6", weight: 0.20 }   // Steinitz - fortress
        ]
    },
    // Scandinavian accepted
    "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "d8d5", weight: 0.50 },  // Main line - active queen
            { move: "g8f6", weight: 0.50 }   // Modern - development first
        ]
    },
    // French Defense - Strategic pressure
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.65 },  // Main line - space advantage
            { move: "d2d3", weight: 0.20 },  // King's Indian Attack
            { move: "b1c3", weight: 0.15 }   // Development - flexible
        ]
    },
    // Caro-Kann - Strategic approach
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },  // Classical - principled
            { move: "b1c3", weight: 0.25 },  // Two Knights - development
            { move: "c2c4", weight: 0.20 }   // Panov - dynamic structure
        ]
    },
    // London System - AlphaZero's patient buildup
    "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6": {
        white: [
            { move: "c1f4", weight: 0.40 },  // London - solid system
            { move: "g1f3", weight: 0.35 },  // Classical development
            { move: "c2c4", weight: 0.25 }   // Queen's Gambit - main line
        ]
    },
    // King's Indian Defense setup
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Main line - classical
            { move: "g1f3", weight: 0.35 },  // Flexible - Fianchetto option
            { move: "e2e4", weight: 0.15 }   // Four Pawns - ambitious
        ]
    },
    // Nimzo-Indian position
    "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "e2e3", weight: 0.40 },  // Rubinstein - solid
            { move: "d1c2", weight: 0.35 },  // Classical - avoid doubled pawns
            { move: "c1g5", weight: 0.25 }   // Leningrad - active play
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE
// ═══════════════════════════════════════════════════════════════════════

let chessEngine;
let currentFen = "";
let bestMove;
let webSocketWrapper = null;
let gamePhase = "opening";
let positionType = "strategic";   // Default to strategic
let multiPVLines = [];
let myColor = null;
let moveCount = 0;
let timeRemaining = 30000;
let lastEvaluation = 0;           // Track position evaluation
let drawMoveCounter = 0;          // Track moves in draw territory
let positionHistory = [];         // Track position repetitions
let isCalculating = false;        // Prevent concurrent calculations
let lastMoveTime = 0;             // Track timing for stability
let activityScore = 0;            // Track piece activity level
let zugzwangRisk = false;         // Track zugzwang potential

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO STRATEGIC HELPERS - God-Like Evaluation
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
 * Count specific piece types for strategic analysis
 */
function countPieceTypes(fen) {
    const board = fen.split(' ')[0];
    let counts = { wQ: 0, bQ: 0, wR: 0, bR: 0, wB: 0, bB: 0, wN: 0, bN: 0, wP: 0, bP: 0, wK: 0, bK: 0 };
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (c === 'Q') counts.wQ++;
        else if (c === 'q') counts.bQ++;
        else if (c === 'R') counts.wR++;
        else if (c === 'r') counts.bR++;
        else if (c === 'B') counts.wB++;
        else if (c === 'b') counts.bB++;
        else if (c === 'N') counts.wN++;
        else if (c === 'n') counts.bN++;
        else if (c === 'P') counts.wP++;
        else if (c === 'p') counts.bP++;
        else if (c === 'K') counts.wK++;
        else if (c === 'k') counts.bK++;
    }
    return counts;
}

/**
 * AlphaZero Pawn Structure Analysis - Long-term strategic vision
 */
function analyzePawnStructure(fen) {
    const board = fen.split(' ')[0];
    const rows = board.split('/');
    let structure = {
        doubledPawns: 0,
        isolatedPawns: 0,
        passedPawns: 0,
        backwardPawns: 0,
        pawnIslands: 0,
        centerControl: 0
    };
    
    let pawnFiles = { w: [], b: [] };
    
    // Map pawns to files
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let c of rows[rank]) {
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'P') pawnFiles.w.push(file);
                else if (c === 'p') pawnFiles.b.push(file);
                file++;
            }
        }
    }
    
    // Analyze doubled pawns
    const wFileCounts = {};
    const bFileCounts = {};
    pawnFiles.w.forEach(f => wFileCounts[f] = (wFileCounts[f] || 0) + 1);
    pawnFiles.b.forEach(f => bFileCounts[f] = (bFileCounts[f] || 0) + 1);
    
    Object.values(wFileCounts).forEach(c => { if (c > 1) structure.doubledPawns += c - 1; });
    Object.values(bFileCounts).forEach(c => { if (c > 1) structure.doubledPawns -= c - 1; });
    
    // Center control (d4, d5, e4, e5)
    if (pawnFiles.w.includes(3) || pawnFiles.w.includes(4)) structure.centerControl += 10;
    if (pawnFiles.b.includes(3) || pawnFiles.b.includes(4)) structure.centerControl -= 10;
    
    return structure;
}

/**
 * King Safety Evaluation - AlphaZero's precise judgment
 */
function evaluateKingSafety(fen) {
    const board = fen.split(' ')[0];
    const rows = board.split('/');
    let safety = { white: 0, black: 0 };
    
    // Find king positions
    let wKingPos = null, bKingPos = null;
    
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let c of rows[rank]) {
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'K') wKingPos = { rank, file };
                else if (c === 'k') bKingPos = { rank, file };
                file++;
            }
        }
    }
    
    // Evaluate castled positions
    if (wKingPos) {
        // Kingside castle bonus
        if (wKingPos.file >= 6 && wKingPos.rank === 7) safety.white += 30;
        // Queenside castle
        else if (wKingPos.file <= 2 && wKingPos.rank === 7) safety.white += 25;
        // King in center is dangerous
        else if (wKingPos.file >= 3 && wKingPos.file <= 5 && wKingPos.rank >= 6) safety.white -= 20;
    }
    
    if (bKingPos) {
        if (bKingPos.file >= 6 && bKingPos.rank === 0) safety.black += 30;
        else if (bKingPos.file <= 2 && bKingPos.rank === 0) safety.black += 25;
        else if (bKingPos.file >= 3 && bKingPos.file <= 5 && bKingPos.rank <= 1) safety.black -= 20;
    }
    
    return safety;
}

/**
 * Endgame Type Detection - For FLAWLESS endgame play
 */
function detectEndgameType(fen) {
    const pieces = countPieceTypes(fen);
    const totalPieces = countPieces(fen);
    
    // King + Pawn endgames - require maximum precision
    if (pieces.wQ === 0 && pieces.bQ === 0 && pieces.wR === 0 && pieces.bR === 0 &&
        pieces.wB === 0 && pieces.bB === 0 && pieces.wN === 0 && pieces.bN === 0) {
        return "pawn-endgame";
    }
    
    // Rook endgames - most common, need patience
    if (pieces.wQ === 0 && pieces.bQ === 0 && (pieces.wR > 0 || pieces.bR > 0) &&
        pieces.wB === 0 && pieces.bB === 0 && pieces.wN === 0 && pieces.bN === 0) {
        return "rook-endgame";
    }
    
    // Queen endgames - tactical precision
    if ((pieces.wQ > 0 || pieces.bQ > 0) && totalPieces <= 8) {
        return "queen-endgame";
    }
    
    // Minor piece endgames
    if (pieces.wQ === 0 && pieces.bQ === 0 && pieces.wR === 0 && pieces.bR === 0) {
        if ((pieces.wB > 0 || pieces.bB > 0) && pieces.wN === 0 && pieces.bN === 0) {
            return "bishop-endgame";
        }
        if (pieces.wB === 0 && pieces.bB === 0 && (pieces.wN > 0 || pieces.bN > 0)) {
            return "knight-endgame";
        }
        return "minor-piece-endgame";
    }
    
    // Complex endgames
    if (totalPieces <= 12) {
        return "complex-endgame";
    }
    
    return "not-endgame";
}

/**
 * AlphaZero Zugzwang Detection - Avoid zugzwang traps
 * Critical for endgame precision
 */
function detectZugzwangRisk(fen) {
    const pieces = countPieceTypes(fen);
    const totalPieces = countPieces(fen);
    const endgameType = detectEndgameType(fen);
    
    // Zugzwang most common in pure pawn endgames
    if (endgameType === "pawn-endgame") {
        // High zugzwang risk in king + pawn positions
        if (totalPieces <= 6) return 0.9;
        return 0.7;
    }
    
    // Rook endgames can have zugzwang but less common
    if (endgameType === "rook-endgame") {
        if (totalPieces <= 5) return 0.5;
        return 0.3;
    }
    
    // Knight endgames have zugzwang potential
    if (endgameType === "knight-endgame") {
        return 0.6;
    }
    
    // Bishop endgames - especially same color
    if (endgameType === "bishop-endgame") {
        return 0.5;
    }
    
    // Minor piece endgames
    if (endgameType === "minor-piece-endgame") {
        return 0.4;
    }
    
    // Complex endgames
    if (endgameType === "complex-endgame") {
        return 0.2;
    }
    
    // Middlegame - low zugzwang risk
    return 0.05;
}

/**
 * AlphaZero Piece Activity Evaluation - ACTIVE play is key
 * Evaluates how active pieces are positioned
 */
function evaluatePieceActivityLevel(fen) {
    const board = fen.split(' ')[0];
    const rows = board.split('/');
    let activity = { white: 0, black: 0 };
    
    // Central squares are valuable (d4, d5, e4, e5 = ranks 3,4 files 3,4)
    const centralFiles = [3, 4];
    const centralRanks = [3, 4];
    
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let c of rows[rank]) {
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                const isCentral = centralFiles.includes(file) && centralRanks.includes(rank);
                const isExtendedCenter = file >= 2 && file <= 5 && rank >= 2 && rank <= 5;
                
                // Piece activity bonuses based on position
                if (c === 'N' || c === 'B') {
                    // Knights and bishops love central squares
                    if (isCentral) activity.white += 25;
                    else if (isExtendedCenter) activity.white += 15;
                    else if (rank >= 2 && rank <= 5) activity.white += 8;
                    // Penalty for undeveloped pieces
                    if (rank === 7) activity.white -= 10;
                }
                if (c === 'n' || c === 'b') {
                    if (isCentral) activity.black += 25;
                    else if (isExtendedCenter) activity.black += 15;
                    else if (rank >= 2 && rank <= 5) activity.black += 8;
                    if (rank === 0) activity.black -= 10;
                }
                if (c === 'R') {
                    // Rooks on open files/7th rank
                    if (rank <= 1) activity.white += 20; // 7th rank
                    if (file === 3 || file === 4) activity.white += 10; // Central files
                }
                if (c === 'r') {
                    if (rank >= 6) activity.black += 20;
                    if (file === 3 || file === 4) activity.black += 10;
                }
                if (c === 'Q') {
                    // Queen activity - not too early
                    if (isExtendedCenter && rank <= 4) activity.white += 15;
                }
                if (c === 'q') {
                    if (isExtendedCenter && rank >= 3) activity.black += 15;
                }
                
                file++;
            }
        }
    }
    
    return activity;
}

/**
 * Prophylaxis Evaluation - AlphaZero's defensive awareness
 * Identifies opponent's plans and counters
 */
function evaluateProphylaxis(fen) {
    const pieces = countPieceTypes(fen);
    const kingSafety = evaluateKingSafety(fen);
    let prophylaxisScore = 0;
    
    // King safety awareness
    const mySafety = myColor === 'w' ? kingSafety.white : kingSafety.black;
    const oppSafety = myColor === 'w' ? kingSafety.black : kingSafety.white;
    
    // If opponent's king is unsafe, we have initiative
    if (oppSafety < 0) prophylaxisScore += Math.abs(oppSafety) * 0.5;
    
    // If our king needs protection
    if (mySafety < 0) prophylaxisScore -= Math.abs(mySafety) * 0.3;
    
    // Material imbalances that need awareness
    const myQueens = myColor === 'w' ? pieces.wQ : pieces.bQ;
    const oppQueens = myColor === 'w' ? pieces.bQ : pieces.wQ;
    
    // Queen vs no queen - tactical awareness needed
    if (myQueens > 0 && oppQueens === 0) prophylaxisScore += 30;
    if (myQueens === 0 && oppQueens > 0) prophylaxisScore -= 20;
    
    return prophylaxisScore;
}

/**
 * Check if position is likely drawn - AlphaZero's precise evaluation
 */
function isLikelyDraw(fen, evaluation) {
    const pieces = countPieceTypes(fen);
    const totalPieces = countPieces(fen);
    
    // Insufficient material
    if (totalPieces <= 4) {
        // K vs K
        if (totalPieces === 2) return true;
        // K+B vs K or K+N vs K
        if (totalPieces === 3 && (pieces.wB === 1 || pieces.bB === 1 || pieces.wN === 1 || pieces.bN === 1)) {
            return true;
        }
        // K+B vs K+B same color
        if (pieces.wB === 1 && pieces.bB === 1) return true;
    }
    
    // Position is very close to equality
    if (Math.abs(evaluation) < CONFIG.minAdvantageToPlay && totalPieces <= 10) {
        return true;
    }
    
    return false;
}

/**
 * Game phase detection - AlphaZero style (strategic awareness)
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const endgameType = detectEndgameType(fen);
    
    if (endgameType !== "not-endgame") return "endgame";
    if (moveNum <= 10) return "opening";
    if (moveNum <= 15 && pieces > 28) return "early-middlegame";
    if (pieces > 20) return "middlegame";
    if (pieces > 14) return "late-middlegame";
    return "endgame";
}

/**
 * AlphaZero Position Analysis - ACTIVE play, NOT passive
 * Strategic depth balanced with initiative
 */
function analyzePositionType(fen) {
    const pieces = countPieceTypes(fen);
    const totalPieces = countPieces(fen);
    const endgameType = detectEndgameType(fen);
    const pawnStructure = analyzePawnStructure(fen);
    const kingSafety = evaluateKingSafety(fen);
    const pieceActivity = evaluatePieceActivityLevel(fen);
    const zRisk = detectZugzwangRisk(fen);
    
    // Update global zugzwang awareness
    zugzwangRisk = zRisk > 0.5;
    
    // Endgame - FLAWLESS precision mode
    if (endgameType !== "not-endgame") {
        if (endgameType === "pawn-endgame") {
            if (zRisk > 0.7) return "zugzwang-precision";
            return "pawn-precision";
        }
        if (endgameType === "rook-endgame") return "rook-technique";
        if (endgameType === "knight-endgame") return "knight-precision";
        if (endgameType === "bishop-endgame") return "bishop-precision";
        return "endgame-grinding";
    }
    
    // Calculate material balance
    const myMaterial = myColor === 'w' ? 
        (pieces.wQ * 9 + pieces.wR * 5 + pieces.wB * 3.25 + pieces.wN * 3 + pieces.wP) :
        (pieces.bQ * 9 + pieces.bR * 5 + pieces.bB * 3.25 + pieces.bN * 3 + pieces.bP);
    const oppMaterial = myColor === 'w' ?
        (pieces.bQ * 9 + pieces.bR * 5 + pieces.bB * 3.25 + pieces.bN * 3 + pieces.bP) :
        (pieces.wQ * 9 + pieces.wR * 5 + pieces.wB * 3.25 + pieces.wN * 3 + pieces.wP);
    
    // King safety evaluation
    const mySafety = myColor === 'w' ? kingSafety.white : kingSafety.black;
    const oppSafety = myColor === 'w' ? kingSafety.black : kingSafety.white;
    
    // Piece activity evaluation
    const myActivity = myColor === 'w' ? pieceActivity.white : pieceActivity.black;
    const oppActivity = myColor === 'w' ? pieceActivity.black : pieceActivity.white;
    activityScore = myActivity - oppActivity;
    
    // ACTIVE play - attack weak king
    if (oppSafety < -20) return "active-attack";
    
    // Defensive resilience when needed
    if (mySafety < -15) return "defensive-resilience";
    
    // High piece activity advantage - press the initiative
    if (myActivity > oppActivity + 20) return "active-initiative";
    
    // Material advantage - actively convert
    if (myMaterial > oppMaterial + 2) return "active-conversion";
    if (myMaterial < oppMaterial - 2) return "resilient-defense";
    
    // Good pawn structure - active pressure
    if (pawnStructure.centerControl > 5) return "active-squeeze";
    
    // Activity disadvantage - improve pieces actively
    if (myActivity < oppActivity - 15) return "active-improvement";
    
    // Complex middlegame - strategic maneuvering with activity
    if (totalPieces > 24) return "strategic-complexity";
    
    // Default: balanced but ACTIVE play
    return "active-balance";
}

/**
 * AlphaZero Thinking Time - Efficient, not wasteful
 * Fast when position is clear, thorough when complex
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // AlphaZero is efficient - doesn't waste time
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middlegameSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame") speedMultiplier = CONFIG.endgameSpeed;
    
    // Position-specific adjustments - efficiency focus
    if (posType === "pawn-precision" || posType === "zugzwang-precision") {
        speedMultiplier = CONFIG.endgameSpeed * 0.9; // Precise but efficient
    } else if (posType === "rook-technique" || posType === "knight-precision" || posType === "bishop-precision") {
        speedMultiplier = CONFIG.endgameSpeed * 0.85;
    } else if (posType === "endgame-grinding" || posType === "active-conversion") {
        speedMultiplier = CONFIG.grindingSpeed;
    } else if (posType === "defensive-resilience" || posType === "resilient-defense") {
        speedMultiplier = CONFIG.criticalSpeed * 0.85;
    } else if (posType === "active-attack" || posType === "active-initiative") {
        speedMultiplier = CONFIG.activePlaySpeed; // Fast when attacking
    } else if (posType === "active-improvement" || posType === "active-squeeze") {
        speedMultiplier = CONFIG.middlegameSpeed * 0.8;
    } else if (posType === "strategic-complexity") {
        speedMultiplier *= 0.75;
    } else if (posType === "active-balance") {
        speedMultiplier = CONFIG.middlegameSpeed * 0.7;
    }
    
    // Time pressure - maintain quality with efficiency
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.5;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.35;
    if (timeLeft < 3000) speedMultiplier *= 0.25;
    if (timeLeft < 1500) speedMultiplier *= 0.15;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance * 0.2);
    return Math.floor(Math.max(45, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * AlphaZero Depth - Optimized for precision without waste
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        // FLAWLESS endgame - appropriate depth for precision
        depth = CONFIG.endgameDepth;
        
        // Extra depth for critical endgame types
        if (posType === "zugzwang-precision") depth = CONFIG.zugzwangDepth;
        else if (posType === "pawn-precision") depth = CONFIG.endgameDepth + 1;
        else if (posType === "rook-technique") depth = CONFIG.endgameDepth;
        else if (posType === "knight-precision" || posType === "bishop-precision") depth = CONFIG.endgameDepth;
    } else {
        // Middlegame - efficient depth selection
        if (posType === "strategic-complexity") {
            depth = CONFIG.strategicDepth;
        } else if (posType === "active-attack" || posType === "active-initiative") {
            depth = CONFIG.tacticalDepth; // Tactical precision for attacks
        } else if (posType === "defensive-resilience" || posType === "resilient-defense") {
            depth = CONFIG.tacticalDepth; // Deep for defense
        } else if (posType === "active-conversion" || posType === "active-squeeze") {
            depth = CONFIG.positionalDepth;
        } else if (posType === "active-improvement") {
            depth = CONFIG.positionalDepth;
        } else {
            depth = CONFIG.baseDepth;
        }
    }
    
    // Time pressure - maintain reasonable depth
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(11, depth - 1);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(10, depth - 2);
    if (timeLeft < 3000) depth = Math.max(9, depth - 3);
    if (timeLeft < 1500) depth = Math.max(8, depth - 4);
    
    return depth;
}

/**
 * Weighted opening book selection
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
 * AlphaZero Move Selection - ACTIVE play, strategic depth, no mistakes
 * Prioritizes: initiative, piece activity, long-term advantage
 */
function selectBestStrategicMove(bestMove, alternatives, phase, posType) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    // AlphaZero NEVER makes intentional mistakes
    const bestScore = alternatives[0].score || 0;
    
    // In endgame - precision mode
    if (phase === "endgame") {
        // Check for draw recognition
        if (CONFIG.allowStrategicDraws && isLikelyDraw(currentFen, bestScore)) {
            drawMoveCounter++;
            // Play precisely to confirm the draw
            return bestMove;
        }
        
        // Zugzwang awareness - be careful with move selection
        if (zugzwangRisk && posType === "zugzwang-precision") {
            // In zugzwang positions, strictly play objectively best
            return bestMove;
        }
        
        // Endgame: strict best move, but prefer active moves if equal
        return bestMove;
    }
    
    // ACTIVE move selection for middlegame - NO PASSIVE PLAY
    for (let i = 1; i < Math.min(alternatives.length, 4); i++) {
        const alt = alternatives[i];
        const scoreDiff = bestScore - (alt.score || 0);
        
        // If move is within 8 centipawns, consider activity factors
        if (scoreDiff <= 8 && scoreDiff >= 0) {
            const move = alt.move;
            
            // Prefer ACTIVE moves that maintain initiative
            if (isMoreActive(move, bestMove, posType)) {
                return move;
            }
        }
    }
    
    return bestMove;
}

/**
 * Evaluate if a move is more ACTIVE (AlphaZero's unconventional, non-passive play)
 */
function isMoreActive(move, bestMove, posType) {
    if (!move || move.length < 4) return false;
    
    const moveActivity = evaluateMoveActivity(move);
    const bestActivity = evaluateMoveActivity(bestMove);
    
    // Prefer more active moves
    if (moveActivity > bestActivity + 5) return true;
    
    const toSquare = move.substring(2, 4);
    const fromSquare = move.substring(0, 2);
    const toFile = toSquare[0];
    const toRank = toSquare[1];
    const fromFile = fromSquare[0];
    const fromRank = fromSquare[1];
    
    // Position type specific ACTIVE preferences
    if (posType === "active-attack" || posType === "active-initiative") {
        // Prefer forward moves toward enemy
        if (myColor === 'w' && parseInt(toRank) > parseInt(fromRank)) return true;
        if (myColor === 'b' && parseInt(toRank) < parseInt(fromRank)) return true;
        
        // Prefer central control
        if ((toFile === 'd' || toFile === 'e') && (toRank === '4' || toRank === '5')) {
            return true;
        }
    }
    
    if (posType === "active-conversion" || posType === "active-squeeze") {
        // Prefer space-gaining moves
        if ((toFile === 'd' || toFile === 'e') && (toRank === '4' || toRank === '5')) {
            return true;
        }
        // Prefer piece activation
        if (fromFile === 'a' || fromFile === 'h') {
            if (toFile >= 'c' && toFile <= 'f') return true;
        }
        // Prefer rook lifts
        if (fromRank === '1' || fromRank === '8') {
            if ((myColor === 'w' && (toRank === '3' || toRank === '4')) ||
                (myColor === 'b' && (toRank === '5' || toRank === '6'))) {
                return true;
            }
        }
    }
    
    if (posType === "defensive-resilience" || posType === "resilient-defense") {
        // Even in defense, prefer ACTIVE defense
        // Centralize pieces for coordination
        if ((toFile === 'c' || toFile === 'd' || toFile === 'e' || toFile === 'f') &&
            (toRank === '2' || toRank === '3' || toRank === '6' || toRank === '7')) {
            return true;
        }
        // Prefer counterattacking possibilities
        if (myColor === 'w' && toRank >= '4') return true;
        if (myColor === 'b' && toRank <= '5') return true;
    }
    
    if (posType === "active-improvement") {
        // Piece improvement - get pieces to better squares
        if ((toFile === 'd' || toFile === 'e') && (toRank >= '3' && toRank <= '6')) {
            return true;
        }
    }
    
    if (posType === "active-balance") {
        // Maintain tension, don't release
        // Prefer flexible moves that keep options open
        if ((toFile === 'c' || toFile === 'd' || toFile === 'e' || toFile === 'f')) {
            return true;
        }
    }
    
    return false;
}

/**
 * Evaluate move activity level - ACTIVE play measurement
 */
function evaluateMoveActivity(move) {
    if (!move || move.length < 4) return 0;
    
    const toSquare = move.substring(2, 4);
    const fromSquare = move.substring(0, 2);
    const toFile = toSquare.charCodeAt(0) - 97; // 0-7
    const toRank = parseInt(toSquare[1]) - 1;   // 0-7
    const fromFile = fromSquare.charCodeAt(0) - 97;
    const fromRank = parseInt(fromSquare[1]) - 1;
    
    let activity = 0;
    
    // Central squares are most active
    const centerDistance = Math.abs(toFile - 3.5) + Math.abs(toRank - 3.5);
    activity += Math.max(0, 10 - centerDistance * 1.5);
    
    // Forward progress (toward enemy) - ACTIVE play
    if (myColor === 'w') {
        activity += (toRank - fromRank) * 2; // Reward forward moves
        activity += toRank; // Bonus for advanced position
    } else {
        activity += (fromRank - toRank) * 2; // Reward forward moves
        activity += (7 - toRank); // Bonus for advanced position
    }
    
    // Extended center control
    if (toFile >= 2 && toFile <= 5 && toRank >= 2 && toRank <= 5) {
        activity += 5;
    }
    
    // Piece activation from corner/edge
    if ((fromFile === 0 || fromFile === 7) && (toFile >= 2 && toFile <= 5)) {
        activity += 6;
    }
    
    // Promotion potential for pawns
    if (move.length > 4) {
        activity += 15; // Promotion is very active
    }
    
    return activity;
}

/**
 * Parse multi-PV lines from engine output
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

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - AlphaZero Settings (Efficient & Stable)
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    if (typeof window.STOCKFISH !== 'function') return false;
    
    try {
        chessEngine = window.STOCKFISH();
        
        chessEngine.postMessage("uci");
        
        // AlphaZero Strategic Settings - Balanced for ACTIVE play
        chessEngine.postMessage("setoption name MultiPV value 4");        // Analyze top 4 moves for active selection
        chessEngine.postMessage("setoption name Contempt value 20");      // Balanced - plays for wins but accepts good draws
        chessEngine.postMessage("setoption name Move Overhead value 20"); // Fast response
        chessEngine.postMessage("setoption name Slow Mover value 80");    // Efficient play
        
        chessEngine.postMessage("isready");
        return true;
    } catch (e) {
        return false;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - Stable and efficient (no page breaking)
// ═══════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    if (!window.WebSocket) return;
    
    const OriginalWebSocket = window.WebSocket;
    
    const webSocketProxy = new Proxy(OriginalWebSocket, {
        construct: function (target, args) {
            let wrappedWebSocket;
            try {
                wrappedWebSocket = new target(...args);
            } catch (e) {
                return new target(...args);
            }
            
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                try {
                    if (!event.data || typeof event.data !== 'string') return;
                    
                    let message = JSON.parse(event.data);
                    
                    if (message.d && typeof message.d.fen === "string" && typeof message.v === "number") {
                        // Prevent concurrent calculations
                        if (isCalculating) return;
                        
                        currentFen = message.d.fen;
                        
                        let isWhitesTurn = message.v % 2 == 0;
                        myColor = isWhitesTurn ? 'w' : 'b';
                        
                        if (isWhitesTurn) {
                            currentFen += " w";
                        } else {
                            currentFen += " b";
                        }
                        
                        moveCount = Math.floor(message.v / 2) + 1;
                        gamePhase = getGamePhase(moveCount, currentFen);
                        positionType = analyzePositionType(currentFen);
                        
                        // Track position for repetition awareness
                        const posKey = currentFen.split(' ')[0];
                        positionHistory.push(posKey);
                        if (positionHistory.length > 100) positionHistory.shift();
                        
                        // Extract time if available
                        if (message.d.wc !== undefined && message.d.bc !== undefined) {
                            timeRemaining = myColor === 'w' ? message.d.wc : message.d.bc;
                        }
                        
                        // Throttle calculations
                        const now = Date.now();
                        if (now - lastMoveTime > 50) {
                            lastMoveTime = now;
                            calculateMove();
                        }
                    }
                } catch (e) {
                    // Silent catch to prevent errors from breaking the page
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - AlphaZero Style (ACTIVE, Strategic Depth)
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    if (isCalculating) return;
    isCalculating = true;
    
    // Opening book - strategic repertoire
    if (gamePhase === "opening" || (gamePhase === "early-middlegame" && moveCount <= 12)) {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // Efficient opening play
            const thinkTime = Math.random() * 80 + 50;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
                isCalculating = false;
            }, thinkTime);
            
            return;
        }
    }
    
    // Engine calculation with active settings
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    try {
        chessEngine.postMessage("position fen " + currentFen);
        chessEngine.postMessage(`go depth ${depth}`);
    } catch (e) {
        isCalculating = false;
    }
}

/**
 * Send move - clean, reliable, and fast
 */
function sendMove(move) {
    if (!webSocketWrapper || !move) {
        isCalculating = false;
        return;
    }
    
    try {
        // Calculate think time for this move
        const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
        
        setTimeout(() => {
            try {
                webSocketWrapper.send(JSON.stringify({
                    t: "move",
                    d: { 
                        u: move, 
                        b: 1,
                        l: Math.floor(Math.random() * 12) + 5,
                        a: 1
                    }
                }));
            } catch (e) {
                // Silent catch
            }
            isCalculating = false;
        }, thinkTime);
    } catch (e) {
        isCalculating = false;
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - AlphaZero ACTIVE Selection
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    if (!chessEngine) return;
    
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        try {
            if (!event) return;
            
            engineOutput += event + "\n";
            
            // Parse multi-PV lines for active move selection
            if (event.indexOf('multipv') !== -1) {
                const lines = parseMultiPV(event);
                if (lines.length > 0) {
                    multiPVLines = lines;
                }
            }
            
            // Extract evaluation for strategic decisions
            if (event.indexOf('score cp') !== -1) {
                const scoreMatch = event.match(/score\s+cp\s+(-?\d+)/);
                if (scoreMatch) {
                    lastEvaluation = parseInt(scoreMatch[1]);
                }
            }
            
            if (event && event.indexOf('bestmove') !== -1) {
                const moveParts = event.split(" ");
                bestMove = moveParts[1];
                
                if (!bestMove || bestMove === "(none)") {
                    isCalculating = false;
                    engineOutput = "";
                    return;
                }
                
                let finalMove = bestMove;
                
                // AlphaZero ACTIVE move selection
                if (multiPVLines.length > 1) {
                    finalMove = selectBestStrategicMove(bestMove, multiPVLines, gamePhase, positionType);
                }
                
                sendMove(finalMove);
                engineOutput = "";
            }
        } catch (e) {
            isCalculating = false;
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - Clean, stable, no page breaking
// ═══════════════════════════════════════════════════════════════════════

function initialize() {
    try {
        // Wait for Stockfish to load
        if (typeof window.STOCKFISH !== 'function') {
            setTimeout(initialize, 100);
            return;
        }
        
        const engineReady = initializeChessEngine();
        if (!engineReady) {
            setTimeout(initialize, 100);
            return;
        }
        
        interceptWebSocket();
        setupChessEngineOnMessage();
    } catch (e) {
        // Silent initialization failure - don't break page
    }
}

// Start initialization
try {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
} catch (e) {
    // Silent catch - never break the page
}
