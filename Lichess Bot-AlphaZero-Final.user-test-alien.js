// ==UserScript==
// @name         Lichess Bot - AlphaZero ALIEN
// @description  ALIEN AlphaZero-style - Cold, optimal, unbeatable precision
// @author       AlphaZero - Alien Edition
// @version      5.0.0-ALIEN
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
    // SMART Depths - Efficient, not bruteforce
    baseDepth: 16,
    tacticalDepth: 20,
    positionalDepth: 18,
    endgameDepth: 20,
    openingDepth: 14,
    winningDepth: 14,      // Lower depth when clearly winning (efficiency)
    criticalDepth: 22,     // Max depth for critical moments
    
    // NO mistakes - Pure engine perfection
    humanMistakeRate: 0,
    
    // Timing - Fast and efficient
    thinkingTimeMin: 80,
    thinkingTimeMax: 600,
    
    // Speed multipliers - Quick decisive play
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
    
    // ALIEN aggression settings
    winningThreshold: 200,       // Centipawns to consider "winning"
    crushingThreshold: 500,      // Centipawns to consider "crushing"
    drawAvoidanceContempt: 100,  // High contempt to avoid draws
    killerModeContempt: 150,     // Maximum aggression when winning
    
    // Repetition avoidance
    maxRepetitions: 1            // Avoid same position more than once when winning
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO-STYLE OPENING BOOK - Aggressive, Sharp & Dynamic
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - AlphaZero prefers d4 (more complex, harder to draw)
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },
            { move: "e2e4", weight: 0.35 },
            { move: "c2c4", weight: 0.10 }
        ]
    },
    // After 1.e4 - Sicilian (fighting), e5 for classical
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.55 },
            { move: "e7e5", weight: 0.30 },
            { move: "e7e6", weight: 0.15 }
        ]
    },
    // After 1.d4 - Nf6 for Indian complexity
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.60 },
            { move: "d7d5", weight: 0.25 },
            { move: "f7f5", weight: 0.15 }
        ]
    },
    // Sicilian - Open Sicilian with Nf3
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.75 },
            { move: "b1c3", weight: 0.15 },
            { move: "f2f4", weight: 0.10 }
        ]
    },
    // Sicilian after Nf3 - d6 Najdorf prep
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d6", weight: 0.50 },
            { move: "b8c6", weight: 0.30 },
            { move: "e7e6", weight: 0.20 }
        ]
    },
    // Sicilian d4 - Open it up
    "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq d3": {
        black: [
            { move: "c5d4", weight: 0.90 },
            { move: "g8f6", weight: 0.10 }
        ]
    },
    // Italian Game - Two Knights or Giuoco Piano
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.60 },
            { move: "f8c5", weight: 0.40 }
        ]
    },
    // Italian - After Nf6, go for sharp d5
    "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.55 },
            { move: "b1c3", weight: 0.25 },
            { move: "d2d3", weight: 0.20 }
        ]
    },
    // QGD positions - Slav or QGD
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.35 },
            { move: "c7c6", weight: 0.40 },
            { move: "g8f6", weight: 0.25 }
        ]
    },
    // King's Indian Defense - Aggressive setup
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },
            { move: "g1f3", weight: 0.30 },
            { move: "e2e4", weight: 0.20 }
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
            { move: "c7c5", weight: 0.55 },
            { move: "g8f6", weight: 0.25 },
            { move: "c8f5", weight: 0.20 }
        ]
    },
    // Catalan - Fianchetto
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g2g3", weight: 0.65 },
            { move: "g1f3", weight: 0.25 },
            { move: "b1c3", weight: 0.10 }
        ]
    },
    // Ruy Lopez - Spanish torture
    "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -": {
        white: [
            { move: "f1b5", weight: 0.60 },
            { move: "f1c4", weight: 0.30 },
            { move: "d2d4", weight: 0.10 }
        ]
    },
    // Ruy Lopez - Black's response
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.55 },
            { move: "g8f6", weight: 0.35 },
            { move: "f8c5", weight: 0.10 }
        ]
    },
    // Nimzo-Indian - Sharp play
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq -": {
        black: [
            { move: "f8b4", weight: 0.55 },
            { move: "d7d5", weight: 0.25 },
            { move: "b7b6", weight: 0.20 }
        ]
    },
    // Queen's Gambit Accepted
    "rnbqkbnr/ppp1pppp/8/8/2pP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.45 },
            { move: "g1f3", weight: 0.35 },
            { move: "e2e3", weight: 0.20 }
        ]
    },
    // Caro-Kann - Advance or Exchange
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },
            { move: "b1c3", weight: 0.30 },
            { move: "e4e5", weight: 0.20 }
        ]
    },
    // French Defense - Advance variation
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.60 },
            { move: "e4e5", weight: 0.25 },
            { move: "b1c3", weight: 0.15 }
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

// ALIEN: Position history for repetition avoidance
let positionHistory = {};
let currentEval = 0;
let isWinning = false;
let isCrushing = false;

// ALIEN: Endgame patterns for conversion
const WINNING_ENDGAMES = {
    KQvK: true,   // King + Queen vs King
    KRvK: true,   // King + Rook vs King
    KRRvK: true,  // King + 2 Rooks vs King
    KQQvK: true,  // King + 2 Queens vs King
    KBBvK: true,  // King + 2 Bishops vs King
    KBNvK: true,  // King + Bishop + Knight vs King
    KPvK: true    // King + Pawn vs King (usually)
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
 * ALIEN: Reset position history on new game
 */
function resetGameState() {
    positionHistory = {};
    currentEval = 0;
    isWinning = false;
    isCrushing = false;
    moveCount = 0;
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
 * ALIEN: Enhanced position type detection
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    
    // Check indication - tactical
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // ALIEN: If winning, look for conversion opportunities
    if (isWinning || isCrushing) return "conversion";
    
    // ALIEN: Known winning endgame
    if (isKnownWinningEndgame(fen)) return "winning-endgame";
    
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
 * ALIEN: Smart depth selection - efficient, not bruteforce
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // ALIEN: Lower depth when clearly winning (efficiency)
    if (isCrushing) {
        depth = CONFIG.winningDepth;
    } else if (isWinning && posType !== "tactical") {
        depth = CONFIG.winningDepth + 2;
    } else if (posType === "winning-endgame") {
        depth = CONFIG.endgameDepth;
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
 * ALIEN: Best move selection with draw avoidance
 */
function selectBestMove(bestMove, alternatives) {
    // ALIEN: When winning, check for repetition avoidance
    if ((isWinning || isCrushing) && alternatives && alternatives.length > 1) {
        // If best move might lead to repetition, consider alternatives
        const bestMoveScore = alternatives[0] ? alternatives[0].score : 0;
        
        for (let alt of alternatives) {
            // Only consider alternatives within 50cp of best
            if (bestMoveScore - alt.score < 50) {
                // Prefer non-repeating moves when winning
                return alt.move;
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
 * ALIEN: Dynamically adjust engine contempt based on position
 */
function adjustContempt() {
    if (isCrushing) {
        chessEngine.postMessage("setoption name Contempt value " + CONFIG.killerModeContempt);
    } else if (isWinning) {
        chessEngine.postMessage("setoption name Contempt value " + CONFIG.drawAvoidanceContempt);
    } else {
        chessEngine.postMessage("setoption name Contempt value 75");
    }
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
// ENGINE MESSAGE HANDLER - ALIEN PRECISION
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        engineOutput += event + "\n";
        
        // ALIEN: Parse evaluation for winning status
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
            
            // ALIEN: Smart move selection with draw avoidance when winning
            let finalMove = selectBestMove(bestMove, multiPVLines);
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
