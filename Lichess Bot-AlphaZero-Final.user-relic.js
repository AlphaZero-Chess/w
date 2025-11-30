// ==UserScript==
// @name         Lichess Bot - AlphaZero True Style (Optimized)
// @description  AlphaZero-esque personality: aggressive, activity-focused, high depth
// @author       AlphaZero - True Edition
// @version      4.1.0-ALPHAZERO-AGGRESSIVE
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO CONFIGURATION - Aggressive, Efficient, Flawless
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing - Balanced for quality + efficiency
    thinkingTimeMin: 150,
    thinkingTimeMax: 1200,
    humanMistakeRate: 0.0,  // AlphaZero doesn't make "mistakes"
    
    // Depth - Higher for better positional understanding
    baseDepth: 14,
    tacticalDepth: 16,
    positionalDepth: 14,
    endgameDepth: 16,
    openingDepth: 12,
    blitzDepth: 10,        // Fast mode for time pressure
    
    // Speed multipliers - AlphaZero plays confidently
    openingSpeed: 0.35,    // Slightly more time in opening
    earlyMidSpeed: 0.6,
    middlegameSpeed: 0.75,
    lateMidSpeed: 0.7,
    endgameSpeed: 0.65,
    criticalSpeed: 1.0,    // Full time on critical positions
    
    // Time thresholds
    panicThreshold: 5000,
    criticalThreshold: 10000,
    
    // AlphaZero personality - AGGRESSIVE
    contempt: 75,          // Strong winning intent
    aggressionFactor: 1.4, // Prefer active moves strongly
    activityBonus: 40,     // High bonus for piece activity
    kingSafetyWeight: 2.0, // Very strong king attack focus
    
    // Caching for efficiency
    enableCache: true,
    maxCacheSize: 150
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO OPENING BOOK - Comprehensive & Aggressive
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // ═══════════════════════════════════════════════════════════════════
    // WHITE OPENINGS
    // ═══════════════════════════════════════════════════════════════════
    
    // Starting position - AlphaZero prefers e4 (aggressive)
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.75 },  // King's pawn - aggressive
            { move: "d2d4", weight: 0.25 }   // Queen's pawn - solid
        ]
    },
    
    // After 1.e4 c6 (Caro-Kann) - AGGRESSIVE response
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.70 },  // Main line - aggressive center
            { move: "b1c3", weight: 0.20 },  // Two Knights
            { move: "c2c4", weight: 0.10 }   // Panov Attack
        ]
    },
    
    // Caro-Kann: After 1.e4 c6 2.d4 d5
    "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Classical
            { move: "e4e5", weight: 0.30 },  // Advance Variation
            { move: "e4d5", weight: 0.20 }   // Exchange
        ]
    },
    
    // After 1.e4 e6 (French) - Advance or Nc3
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.80 },  // Main line
            { move: "b1c3", weight: 0.20 }   // Nc3 first
        ]
    },
    
    // French: After 1.e4 e6 2.d4 d5
    "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.40 },  // Classical
            { move: "e4e5", weight: 0.35 },  // Advance
            { move: "b1d2", weight: 0.25 }   // Tarrasch
        ]
    },
    
    // After 1.e4 d6 (Pirc) - Aggressive d4
    "rnbqkbnr/ppp1pppp/3p4/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.85 },  // Main line
            { move: "b1c3", weight: 0.15 }   // Austrian Attack prep
        ]
    },
    
    // After 1.e4 g6 (Modern) - d4 central control
    "rnbqkbnr/pppppp1p/6p1/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.90 },  // Strong center
            { move: "b1c3", weight: 0.10 }
        ]
    },
    
    // After 1.e4 d5 (Scandinavian)
    "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e4d5", weight: 0.95 },  // Take the pawn
            { move: "b1c3", weight: 0.05 }
        ]
    },
    
    // After 1.e4 Nf6 (Alekhine)
    "rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e4e5", weight: 0.90 },  // Chase the knight
            { move: "b1c3", weight: 0.10 }
        ]
    },
    
    // Open Sicilian setup
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.60 },  // Open Sicilian
            { move: "b1c3", weight: 0.25 },  // Closed
            { move: "c2c3", weight: 0.15 }   // Alapin
        ]
    },
    
    // Sicilian: After 1.e4 c5 2.Nf3
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -": {
        white: [
            { move: "d2d4", weight: 1.0 }   // Open it up
        ]
    },
    
    // Italian Game position
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.55 },  // Two Knights
            { move: "f8c5", weight: 0.45 }   // Giuoco Piano
        ]
    },
    
    // Ruy Lopez
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.60 },  // Morphy Defense
            { move: "g8f6", weight: 0.30 },  // Berlin
            { move: "f8c5", weight: 0.10 }   // Classical
        ]
    },
    
    // ═══════════════════════════════════════════════════════════════════
    // BLACK RESPONSES
    // ═══════════════════════════════════════════════════════════════════
    
    // Against 1.e4 - Sicilian preferred
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.60 },  // Sicilian - AlphaZero favorite
            { move: "e7e5", weight: 0.30 },  // Classical
            { move: "e7e6", weight: 0.10 }   // French
        ]
    },
    
    // Against 1.d4 - Indian systems
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.60 },  // Indian defenses
            { move: "d7d5", weight: 0.30 },  // Classical
            { move: "e7e6", weight: 0.10 }   // QGD setup
        ]
    },
    
    // Against 1.c4 (English)
    "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e5", weight: 0.50 },  // Reversed Sicilian
            { move: "g8f6", weight: 0.30 },  // Flexible
            { move: "c7c5", weight: 0.20 }   // Symmetrical
        ]
    },
    
    // Against 1.Nf3
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.50 },  // Central
            { move: "g8f6", weight: 0.30 },  // Symmetrical
            { move: "c7c5", weight: 0.20 }   // Sicilian-like
        ]
    },
    
    // Queen's Gambit
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },  // QGD
            { move: "c7c6", weight: 0.35 },  // Slav
            { move: "d5c4", weight: 0.25 }   // QGA
        ]
    },
    
    // King's Indian setup for Black
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Main line
            { move: "g1f3", weight: 0.40 },  // Flexible
            { move: "e2e4", weight: 0.10 }   // Four Pawns
        ]
    },
    
    // After 1.d4 Nf6 2.c4
    "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },  // QID/Nimzo
            { move: "g7g6", weight: 0.35 },  // King's Indian
            { move: "c7c5", weight: 0.25 }   // Benoni
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// POSITION CACHE - Efficient Memory Usage
// ═══════════════════════════════════════════════════════════════════════

const positionCache = new Map();
let cacheHits = 0;

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - Optimized with caching support
// ═══════════════════════════════════════════════════════════════════════

let chessEngine = null;
let engineReady = false;
let currentFen = "";
let bestMove = null;
let webSocketWrapper = null;
let gamePhase = "opening";
let positionType = "normal";
let multiPVLines = [];
let myColor = null;
let moveCount = 0;
let timeRemaining = 30000;
let lastCalculation = 0;
let pendingMove = false;

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO OPTIMIZED HELPERS - Efficient & Aggressive
// ═══════════════════════════════════════════════════════════════════════

/**
 * Ultra-fast piece counting using lookup
 */
const PIECE_CHARS = new Set(['p','r','n','b','q','k','P','R','N','B','Q','K']);

function countPieces(fen) {
    let count = 0;
    const board = fen.split(' ')[0];
    for (let i = 0; i < board.length; i++) {
        if (PIECE_CHARS.has(board[i])) count++;
    }
    return count;
}

/**
 * Count specific piece types for AlphaZero evaluation
 */
function countPieceTypes(fen) {
    const board = fen.split(' ')[0];
    const counts = { wQ: 0, bQ: 0, wR: 0, bR: 0, wB: 0, bB: 0, wN: 0, bN: 0, wP: 0, bP: 0 };
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        switch(c) {
            case 'Q': counts.wQ++; break;
            case 'q': counts.bQ++; break;
            case 'R': counts.wR++; break;
            case 'r': counts.bR++; break;
            case 'B': counts.wB++; break;
            case 'b': counts.bB++; break;
            case 'N': counts.wN++; break;
            case 'n': counts.bN++; break;
            case 'P': counts.wP++; break;
            case 'p': counts.bP++; break;
        }
    }
    return counts;
}

/**
 * AlphaZero game phase detection - prefers action
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    const counts = countPieceTypes(fen);
    
    // Opening: first 8 moves or queens haven't moved much
    if (moveNum <= 8) return "opening";
    
    // Check for early queen trades (AlphaZero adjusts style)
    const hasQueens = counts.wQ > 0 && counts.bQ > 0;
    
    if (moveNum <= 12 && pieces > 28) return "early-middlegame";
    if (pieces > 18 && hasQueens) return "middlegame";
    if (pieces > 12) return "late-middlegame";
    
    return "endgame";
}

/**
 * AlphaZero position type - aggressive detection
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    
    // Check for tactical tension (captures available, pieces in contact)
    const tacticalIndicators = ['qk', 'QK', 'rk', 'RK', 'bk', 'BK', 'nk', 'NK'];
    for (const indicator of tacticalIndicators) {
        if (board.toLowerCase().indexOf(indicator.toLowerCase()) !== -1) {
            return "tactical";
        }
    }
    
    // Check indicator in FEN (check position)
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // Count empty squares in center (open = tactical)
    const rows = board.split('/');
    let centerOpen = 0;
    if (rows[3]) centerOpen += (rows[3].match(/[1-8]/g) || []).reduce((a,b) => a + parseInt(b), 0);
    if (rows[4]) centerOpen += (rows[4].match(/[1-8]/g) || []).reduce((a,b) => a + parseInt(b), 0);
    
    if (centerOpen > 10) return "tactical";  // Open center = tactical opportunities
    
    // Pawn structure analysis for positional play
    const pawnChains = (board.match(/pp|PP/g) || []).length;
    if (pawnChains >= 2) return "positional";
    
    return "normal";
}

/**
 * AlphaZero thinking time - confident, efficient
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // AlphaZero plays confidently in all phases
    switch(phase) {
        case "opening": speedMultiplier = CONFIG.openingSpeed; break;
        case "early-middlegame": speedMultiplier = CONFIG.earlyMidSpeed; break;
        case "middlegame": speedMultiplier = CONFIG.middlegameSpeed; break;
        case "late-middlegame": speedMultiplier = CONFIG.lateMidSpeed; break;
        case "endgame": speedMultiplier = CONFIG.endgameSpeed; break;
    }
    
    // AlphaZero thinks deeper on tactics, but stays efficient
    if (posType === "tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    }
    
    // Time pressure handling - AlphaZero stays calm but speeds up
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.5;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.35;
    if (timeLeft < 3000) speedMultiplier *= 0.2;
    if (timeLeft < 1500) speedMultiplier *= 0.15;
    
    const baseTime = CONFIG.thinkingTimeMin;
    const variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance * 0.5);  // Less randomness = more consistent
    return Math.floor(Math.max(80, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * AlphaZero depth selection - Higher for better play
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // Phase-based depth
    switch(phase) {
        case "opening": depth = CONFIG.openingDepth; break;
        case "endgame": depth = CONFIG.endgameDepth; break;
        case "early-middlegame": depth = CONFIG.baseDepth; break;
        case "middlegame": 
            if (posType === "tactical") depth = CONFIG.tacticalDepth;
            else depth = CONFIG.baseDepth;
            break;
        case "late-middlegame":
            if (posType === "tactical") depth = CONFIG.tacticalDepth;
            else depth = CONFIG.positionalDepth;
            break;
        default:
            if (posType === "tactical") depth = CONFIG.tacticalDepth;
            else if (posType === "positional") depth = CONFIG.positionalDepth;
            break;
    }
    
    // Time pressure depth reduction - but maintain reasonable minimum
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(12, depth - 1);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(10, depth - 2);
    if (timeLeft < 3000) depth = Math.max(8, depth - 3);
    if (timeLeft < 1500) depth = CONFIG.blitzDepth;
    
    return depth;
}

/**
 * AlphaZero opening book - weighted selection
 */
function getBookMove(fen) {
    const fenKey = fen.split(' ').slice(0, 4).join(' ');
    const position = OPENINGS[fenKey];
    
    if (!position) return null;
    
    const moves = myColor === 'w' ? position.white : position.black;
    if (!moves || moves.length === 0) return null;
    
    // Weighted random selection
    const totalWeight = moves.reduce((sum, m) => sum + m.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const moveOption of moves) {
        random -= moveOption.weight;
        if (random <= 0) return moveOption.move;
    }
    
    return moves[0].move;
}

/**
 * Cache lookup for efficiency
 */
function getCachedMove(fen) {
    if (!CONFIG.enableCache) return null;
    const key = fen.split(' ').slice(0, 4).join(' ');
    return positionCache.get(key) || null;
}

/**
 * Cache store with size limit
 */
function cacheMove(fen, move) {
    if (!CONFIG.enableCache) return;
    
    const key = fen.split(' ').slice(0, 4).join(' ');
    
    // Maintain cache size
    if (positionCache.size >= CONFIG.maxCacheSize) {
        const firstKey = positionCache.keys().next().value;
        positionCache.delete(firstKey);
    }
    
    positionCache.set(key, move);
}

/**
 * AlphaZero move selection - AGGRESSIVE, activity-focused
 */
function selectAlphaZeroMove(bestMove, alternatives) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    const topMoves = alternatives.slice(0, 4);
    
    // If moves are close in evaluation, prefer aggressive/active moves
    if (topMoves.length >= 2) {
        const bestScore = topMoves[0].score || 0;
        
        for (const alt of topMoves) {
            const scoreDiff = Math.abs(bestScore - (alt.score || 0));
            
            // Within 25 centipawns = consider activity and aggression
            if (scoreDiff < 25) {
                const move = alt.move;
                if (!move || move.length < 4) continue;
                
                const from = move.slice(0, 2);
                const dest = move.slice(2, 4);
                
                // PREFER: Central pawn moves (d4, d5, e4, e5, c4, c5)
                const centralSquares = ['d4', 'd5', 'e4', 'e5', 'c4', 'c5', 'f4', 'f5'];
                if (centralSquares.includes(dest)) {
                    return move;
                }
                
                // PREFER: Piece development to active squares
                const activeSquares = ['c3', 'c6', 'f3', 'f6', 'b5', 'b4', 'g5', 'g4', 'd3', 'd6'];
                if (activeSquares.includes(dest)) {
                    return move;
                }
                
                // PREFER: Castling (king safety + rook activation)
                if (move === 'e1g1' || move === 'e1c1' || move === 'e8g8' || move === 'e8c8') {
                    return move;
                }
                
                // AVOID: Moving pieces backwards (retreat)
                const fromRank = parseInt(from[1]);
                const destRank = parseInt(dest[1]);
                
                // For white, higher rank is forward
                if (myColor === 'w' && destRank < fromRank - 1) {
                    continue; // Skip retreating moves
                }
                // For black, lower rank is forward
                if (myColor === 'b' && destRank > fromRank + 1) {
                    continue; // Skip retreating moves
                }
            }
        }
    }
    
    return bestMove;
}

/**
 * Fast multi-PV parsing (optimized)
 */
function parseMultiPV(output) {
    const lines = [];
    const parts = output.split('\n');
    
    for (const line of parts) {
        if (line.indexOf('multipv') === -1) continue;
        
        const pvMatch = line.match(/pv\s+(\w+)/);
        const scoreMatch = line.match(/score\s+cp\s+(-?\d+)/);
        const mateMatch = line.match(/score\s+mate\s+(-?\d+)/);
        
        if (pvMatch) {
            let score = 0;
            if (scoreMatch) {
                score = parseInt(scoreMatch[1]);
            } else if (mateMatch) {
                score = parseInt(mateMatch[1]) > 0 ? 10000 : -10000;
            }
            
            lines.push({ move: pvMatch[1], score });
        }
    }
    
    return lines.sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - AlphaZero Aggressive Settings
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    try {
        if (typeof window.STOCKFISH !== 'function') {
            console.warn('[AlphaZero] Waiting for Stockfish...');
            setTimeout(initializeChessEngine, 100);
            return;
        }
        
        chessEngine = window.STOCKFISH();
        
        if (!chessEngine) {
            console.error('[AlphaZero] Failed to create engine instance');
            return;
        }
        
        // AlphaZero-style engine settings - AGGRESSIVE
        chessEngine.postMessage("uci");
        chessEngine.postMessage("setoption name MultiPV value 3");           // Consider top 3 moves
        chessEngine.postMessage("setoption name Contempt value " + CONFIG.contempt);  // High contempt - play to WIN
        chessEngine.postMessage("setoption name Move Overhead value 20");    // Fast response
        chessEngine.postMessage("setoption name Ponder value false");        // No pondering
        chessEngine.postMessage("setoption name Hash value 64");             // Reasonable hash for quality
        chessEngine.postMessage("setoption name Threads value 1");           // Single thread for stability
        chessEngine.postMessage("isready");
        
        engineReady = true;
        console.log('[AlphaZero] Engine initialized - Aggressive mode active');
        
    } catch (err) {
        console.error('[AlphaZero] Engine init error:', err);
        setTimeout(initializeChessEngine, 200);
    }
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - Stable & Efficient
// ═══════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    const OriginalWebSocket = window.WebSocket;
    
    const webSocketProxy = new Proxy(OriginalWebSocket, {
        construct: function (target, args) {
            const wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                try {
                    const message = JSON.parse(event.data);
                    
                    // Handle game state messages
                    if (message.d && typeof message.d.fen === "string" && typeof message.v === "number") {
                        const newFen = message.d.fen;
                        
                        // Prevent duplicate calculations
                        if (newFen === currentFen && pendingMove) {
                            return;
                        }
                        
                        currentFen = newFen;
                        
                        const isWhitesTurn = message.v % 2 === 0;
                        myColor = isWhitesTurn ? 'w' : 'b';
                        
                        currentFen += isWhitesTurn ? " w" : " b";
                        
                        moveCount = Math.floor(message.v / 2) + 1;
                        gamePhase = getGamePhase(moveCount, currentFen);
                        positionType = analyzePositionType(currentFen);
                        
                        // Extract time if available
                        if (message.d.wc !== undefined && message.d.bc !== undefined) {
                            timeRemaining = isWhitesTurn ? message.d.wc * 10 : message.d.bc * 10;
                        }
                        
                        calculateMove();
                    }
                    
                    // Handle clock updates
                    if (message.d && message.d.wc !== undefined && myColor) {
                        timeRemaining = myColor === 'w' ? message.d.wc * 10 : message.d.bc * 10;
                    }
                    
                } catch (parseError) {
                    // Silent fail for non-JSON messages
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - AlphaZero Efficient Pipeline
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Prevent duplicate/overlapping calculations
    if (pendingMove) return;
    
    const now = Date.now();
    if (now - lastCalculation < 50) return;  // Debounce
    lastCalculation = now;
    
    // Check engine readiness
    if (!chessEngine || !engineReady) {
        setTimeout(calculateMove, 50);
        return;
    }
    
    pendingMove = true;
    
    // Priority 1: Check cache for instant response
    const cachedMove = getCachedMove(currentFen);
    if (cachedMove && timeRemaining < CONFIG.panicThreshold) {
        const quickDelay = Math.random() * 100 + 50;
        setTimeout(() => {
            cacheHits++;
            sendMove(cachedMove);
            pendingMove = false;
        }, quickDelay);
        return;
    }
    
    // Priority 2: Opening book for fast, theory-based play
    if (gamePhase === "opening" || (gamePhase === "early-middlegame" && moveCount <= 12)) {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            const thinkTime = Math.random() * 150 + 100;  // Quick book response
            
            setTimeout(() => {
                bestMove = bookMove;
                cacheMove(currentFen, bookMove);
                sendMove(bookMove);
                pendingMove = false;
            }, thinkTime);
            
            return;
        }
    }
    
    // Priority 3: Engine calculation
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    // Clear previous position and set new one
    chessEngine.postMessage("stop");
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage("go depth " + depth);
    
    // Safety timeout to prevent stuck calculations
    setTimeout(() => {
        if (pendingMove && !bestMove) {
            chessEngine.postMessage("stop");
        }
    }, Math.min(thinkTime + 500, 2000));
}

/**
 * Send move to Lichess - AlphaZero confident style
 */
function sendMove(move) {
    if (!move || !webSocketWrapper || webSocketWrapper.readyState !== WebSocket.OPEN) {
        pendingMove = false;
        return;
    }
    
    try {
        webSocketWrapper.send(JSON.stringify({
            t: "move",
            d: { 
                u: move, 
                b: 1,
                l: Math.floor(Math.random() * 20) + 10,  // Quick lag simulation
                a: 1
            }
        }));
        
        bestMove = null;
        
    } catch (sendError) {
        console.error('[AlphaZero] Send error:', sendError);
    }
    
    pendingMove = false;
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - AlphaZero Move Selection
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        if (!event) return;
        
        const eventStr = String(event);
        engineOutput += eventStr + "\n";
        
        // Parse multi-PV lines for alternative moves
        if (eventStr.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(eventStr);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        // Handle ready state
        if (eventStr.indexOf('readyok') !== -1) {
            engineReady = true;
        }
        
        // Handle best move
        if (eventStr.indexOf('bestmove') !== -1) {
            const moveParts = eventStr.split(" ");
            const rawBestMove = moveParts[1];
            
            if (!rawBestMove || rawBestMove === '(none)') {
                pendingMove = false;
                engineOutput = "";
                return;
            }
            
            bestMove = rawBestMove;
            
            // AlphaZero move selection - prefers activity
            let finalMove = bestMove;
            if (multiPVLines.length > 1) {
                finalMove = selectAlphaZeroMove(bestMove, multiPVLines);
            }
            
            // Cache for future efficiency
            cacheMove(currentFen, finalMove);
            
            // Send with minimal delay
            const delay = getThinkTime(gamePhase, positionType, timeRemaining);
            setTimeout(() => {
                sendMove(finalMove);
            }, Math.max(50, delay * 0.3));
            
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - Stable Bootstrap
// ═══════════════════════════════════════════════════════════════════════

(function bootstrap() {
    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
        return;
    }
    
    // Intercept WebSocket first (before any connections)
    interceptWebSocket();
    
    // Initialize engine with retry logic
    const initEngine = () => {
        if (typeof window.STOCKFISH === 'function') {
            initializeChessEngine();
            
            // Setup message handler after engine is created
            const waitForEngine = setInterval(() => {
                if (chessEngine) {
                    setupChessEngineOnMessage();
                    clearInterval(waitForEngine);
                    console.log('[AlphaZero] Bot ready - True AlphaZero style activated');
                }
            }, 50);
        } else {
            setTimeout(initEngine, 100);
        }
    };
    
    initEngine();
})();
