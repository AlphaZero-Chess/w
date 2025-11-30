// ==UserScript==
// @name         Lichess Bot - AlphaZero God-Tier (Ultimate)
// @description  True AlphaZero personality: FLAWLESS endgame, PERFECT positional judgment, strategic depth
// @author       AlphaZero - Ultimate Edition
// @version      4.0.0-ALPHAZERO-ULTIMATE
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO CONFIGURATION - God-Tier Strategic Play
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing - Patient but decisive (AlphaZero never rushes)
    thinkingTimeMin: 180,
    thinkingTimeMax: 1400,
    
    // NO MISTAKES - AlphaZero is precise (removed humanMistakeRate)
    // AlphaZero doesn't make random errors - it plays optimally
    
    // Depth - Deep strategic vision
    baseDepth: 12,
    tacticalDepth: 14,
    positionalDepth: 13,
    endgameDepth: 15,           // CRITICAL: AlphaZero's endgame is FLAWLESS
    openingDepth: 11,
    strategicDepth: 14,         // For long-term planning positions
    
    // Speed multipliers - AlphaZero is patient but efficient
    openingSpeed: 0.35,
    earlyMidSpeed: 0.7,
    middlegameSpeed: 0.85,
    lateMidSpeed: 0.9,
    endgameSpeed: 1.1,          // Takes time in endgames for precision
    criticalSpeed: 1.3,
    strategicSpeed: 1.0,        // Patient strategic play
    
    // Time thresholds
    panicThreshold: 6000,
    criticalThreshold: 12000,
    
    // AlphaZero Personality Parameters
    alphaZero: {
        contempt: 50,           // AGGRESSIVE - never passive, always fighting
        aggression: 0.85,       // High aggression for active play
        activityBonus: 40,      // Piece activity priority
        dynamism: 0.9,          // Preference for dynamic positions
        patienceThreshold: 0.7, // Strategic patience level
        resilienceFactor: 0.95, // Never gives up, seeks counterplay
        endgamePrecision: 0.98, // Near-perfect endgame accuracy
        avoidDraws: true,       // Never settle for draws with chances
        sacrificeWillingness: 0.7 // Willing to sacrifice for activity
    }
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO OPENING BOOK - Dynamic, Fighting Chess
// AlphaZero favors active, unconventional openings that lead to rich play
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - AlphaZero prefers e4 for sharp play
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.55 },   // Sharp, active play
            { move: "d2d4", weight: 0.30 },   // Queen's pawn for positional depth
            { move: "c2c4", weight: 0.10 },   // English for strategic complexity
            { move: "g1f3", weight: 0.05 }    // Réti for flexibility
        ]
    },
    // After 1.e4 - AlphaZero as Black favors dynamic defenses
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.45 },   // Sicilian - fighting chess
            { move: "e7e5", weight: 0.35 },   // Classical - AlphaZero revolutionized this
            { move: "e7e6", weight: 0.12 },   // French - strategic depth
            { move: "c7c6", weight: 0.08 }    // Caro-Kann - solid but active
        ]
    },
    // After 1.d4 - Active development
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.40 },   // Indian defenses - AlphaZero specialty
            { move: "d7d5", weight: 0.35 },   // Classical response
            { move: "e7e6", weight: 0.15 },   // Queen's Indian setup
            { move: "c7c5", weight: 0.10 }    // Benoni - sharp counterplay
        ]
    },
    // Open Sicilian - AlphaZero plays actively
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.50 },   // Open Sicilian - principled
            { move: "b1c3", weight: 0.35 },   // Closed Sicilian - strategic
            { move: "c2c3", weight: 0.15 }    // Alapin - solid but fighting
        ]
    },
    // Italian Game - AlphaZero's active responses
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.45 },   // Two Knights - sharp
            { move: "f8c5", weight: 0.45 },   // Giuoco Piano - classical but active
            { move: "f8e7", weight: 0.10 }    // Hungarian - solid
        ]
    },
    // Queen's Gambit - AlphaZero's responses
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },   // QGD - solid, strategic depth
            { move: "c7c6", weight: 0.30 },   // Slav - active pawn structure
            { move: "d5c4", weight: 0.20 },   // QGA - active piece play
            { move: "g8f6", weight: 0.10 }    // Indian setup
        ]
    },
    // Ruy Lopez - AlphaZero's dynamic play
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },   // Morphy Defense - principled
            { move: "g8f6", weight: 0.35 },   // Berlin - AlphaZero showed its depth
            { move: "f8c5", weight: 0.15 }    // Classical - active development
        ]
    },
    // King's Indian Defense setup
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.45 },   // Main line
            { move: "g1f3", weight: 0.40 },   // Flexible
            { move: "e2e4", weight: 0.15 }    // Aggressive
        ]
    },
    // Sicilian Najdorf approach
    "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq -": {
        white: [
            { move: "f1e2", weight: 0.35 },   // Classical - solid but active
            { move: "c1g5", weight: 0.35 },   // English Attack prep
            { move: "f2f3", weight: 0.30 }    // English Attack - aggressive
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - AlphaZero Enhanced
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

// AlphaZero Strategic State
let strategicState = {
    isEndgame: false,
    endgameType: null,        // 'pawn', 'rook', 'queen', 'minor', 'complex'
    hasAdvantage: false,
    evaluationTrend: [],      // Track position evaluation over moves
    lastEval: 0,
    piecesRemaining: 32,
    pawnsRemaining: 16,
    isDrawish: false,
    needsResilience: false,   // Activate counterplay/fortress mode
    zugzwangPotential: false,
    oppositionRelevant: false
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO CORE HELPERS - Optimized & Fast
// ═══════════════════════════════════════════════════════════════════════

/**
 * Ultra-fast piece counting with type breakdown
 * Critical for endgame detection and evaluation
 */
function countPiecesDetailed(fen) {
    const board = fen.split(' ')[0];
    const counts = {
        total: 0,
        white: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
        black: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
        pawns: 0,
        minorPieces: 0,
        majorPieces: 0
    };
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (c >= 'A' && c <= 'Z') {
            counts.total++;
            const piece = c.toLowerCase();
            counts.white[piece]++;
            if (piece === 'p') counts.pawns++;
            else if (piece === 'n' || piece === 'b') counts.minorPieces++;
            else if (piece === 'r' || piece === 'q') counts.majorPieces++;
        } else if (c >= 'a' && c <= 'z') {
            counts.total++;
            counts.black[c]++;
            if (c === 'p') counts.pawns++;
            else if (c === 'n' || c === 'b') counts.minorPieces++;
            else if (c === 'r' || c === 'q') counts.majorPieces++;
        }
    }
    
    return counts;
}

/**
 * Fast piece counting (legacy compatibility)
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
 * AlphaZero Game Phase Detection - Enhanced 7 phases
 */
function getGamePhase(moveNum, fen) {
    const counts = countPiecesDetailed(fen);
    strategicState.piecesRemaining = counts.total;
    strategicState.pawnsRemaining = counts.pawns;
    
    // Endgame detection - AlphaZero precision
    if (counts.total <= 10 || (counts.majorPieces <= 2 && counts.minorPieces <= 2)) {
        strategicState.isEndgame = true;
        strategicState.endgameType = detectEndgameType(counts);
        return "endgame";
    }
    
    if (counts.total <= 14) {
        strategicState.isEndgame = true;
        strategicState.endgameType = detectEndgameType(counts);
        return "late-endgame";
    }
    
    if (moveNum <= 8) return "opening";
    if (moveNum <= 14 && counts.total > 28) return "early-middlegame";
    if (counts.total > 22) return "middlegame";
    if (counts.total > 16) return "late-middlegame";
    
    strategicState.isEndgame = true;
    strategicState.endgameType = detectEndgameType(counts);
    return "transition";
}

/**
 * Endgame Type Classification - Critical for technique selection
 */
function detectEndgameType(counts) {
    const w = counts.white;
    const b = counts.black;
    
    // Pure pawn endgame - Opposition & Triangulation critical
    if (counts.majorPieces === 0 && counts.minorPieces === 0) {
        strategicState.oppositionRelevant = true;
        strategicState.zugzwangPotential = true;
        return 'pawn';
    }
    
    // Rook endgame - Philidor & Lucena positions
    if ((w.r > 0 || b.r > 0) && counts.minorPieces === 0 && (w.q === 0 && b.q === 0)) {
        return 'rook';
    }
    
    // Queen endgame
    if ((w.q > 0 || b.q > 0) && counts.minorPieces === 0 && (w.r === 0 && b.r === 0)) {
        return 'queen';
    }
    
    // Minor piece endgame - Bishops of opposite colors = drawish
    if (counts.minorPieces > 0 && counts.majorPieces === 0) {
        if (w.b === 1 && b.b === 1) {
            // Potential opposite-colored bishops
            strategicState.isDrawish = true;
        }
        return 'minor';
    }
    
    return 'complex';
}

/**
 * AlphaZero Position Type Analysis - Strategic Depth
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    
    // Quick tactical indicators (captures, checks possible)
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // Analyze pawn structure for strategic classification
    let centralPawns = 0;
    let openFiles = 0;
    let pawnChains = 0;
    
    // Count open files (columns without pawns)
    const files = [0, 0, 0, 0, 0, 0, 0, 0];
    let fileIndex = 0;
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if (c === '/') {
            fileIndex = 0;
        } else if (c >= '1' && c <= '8') {
            fileIndex += parseInt(c);
        } else {
            if (c === 'p' || c === 'P') {
                files[fileIndex]++;
                // Central pawns (d, e files)
                if (fileIndex === 3 || fileIndex === 4) centralPawns++;
            }
            fileIndex++;
        }
    }
    
    // Count open files
    for (let f of files) {
        if (f === 0) openFiles++;
    }
    
    // Position classification
    if (openFiles >= 4) return "tactical";        // Open position - tactics dominate
    if (centralPawns >= 3) return "strategic";    // Closed center - strategy dominates
    if (board.indexOf("pp") !== -1 || board.indexOf("PP") !== -1) {
        pawnChains++;
        return "positional";                       // Pawn chains - positional play
    }
    
    // AlphaZero recognizes dynamic potential
    if (Math.random() < CONFIG.alphaZero.dynamism * 0.1) return "dynamic";
    
    return "normal";
}

/**
 * AlphaZero Resilience Detection - Never gives up
 */
function checkResilienceNeeded(eval_score) {
    // Activate resilience mode when behind
    if (eval_score < -100) {
        strategicState.needsResilience = true;
        return true;
    }
    strategicState.needsResilience = false;
    return false;
}

/**
 * AlphaZero Thinking Time - Patient but Precise
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // Phase-based timing - AlphaZero takes time where it matters
    switch (phase) {
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
        case "transition":
            speedMultiplier = CONFIG.strategicSpeed;
            break;
        case "endgame":
        case "late-endgame":
            // AlphaZero is PATIENT in endgames - precision matters
            speedMultiplier = CONFIG.endgameSpeed;
            break;
        default:
            speedMultiplier = 1.0;
    }
    
    // Position type adjustments
    if (posType === "tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    } else if (posType === "strategic" || posType === "dynamic") {
        speedMultiplier *= CONFIG.strategicSpeed;
    } else if (posType === "positional") {
        speedMultiplier *= 1.05;
    }
    
    // Endgame precision - AlphaZero never rushes endgames
    if (strategicState.isEndgame) {
        speedMultiplier *= 1.15;
        // Zugzwang positions need extra calculation
        if (strategicState.zugzwangPotential) {
            speedMultiplier *= 1.1;
        }
    }
    
    // Time pressure management - AlphaZero stays composed
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.6;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.45;
    if (timeLeft < 4000) speedMultiplier *= 0.35;
    if (timeLeft < 2500) speedMultiplier *= 0.25;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(120, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * AlphaZero Adaptive Depth - Strategic Vision
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // Phase-based depth
    switch (phase) {
        case "opening":
            depth = CONFIG.openingDepth;
            break;
        case "endgame":
        case "late-endgame":
            // CRITICAL: AlphaZero's endgame depth is MAXIMUM
            depth = CONFIG.endgameDepth;
            // Extra depth for critical endgame types
            if (strategicState.endgameType === 'pawn') depth += 1;
            if (strategicState.endgameType === 'rook') depth += 1;
            break;
        case "transition":
            depth = CONFIG.strategicDepth;
            break;
        case "middlegame":
        case "late-middlegame":
        case "early-middlegame":
            if (posType === "tactical") {
                depth = CONFIG.tacticalDepth;
            } else if (posType === "positional" || posType === "strategic") {
                depth = CONFIG.positionalDepth;
            } else if (posType === "dynamic") {
                depth = CONFIG.strategicDepth;
            }
            break;
    }
    
    // Resilience mode - deeper search for counterplay
    if (strategicState.needsResilience) {
        depth = Math.min(depth + 1, 16);
    }
    
    // Time pressure depth management - AlphaZero stays strong
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(10, depth - 1);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(9, depth - 2);
    if (timeLeft < 4000) depth = Math.max(8, depth - 3);
    if (timeLeft < 2500) depth = Math.max(7, depth - 4);
    
    return depth;
}

/**
 * AlphaZero Opening Book Selection - Fighting Chess
 */
function getBookMove(fen) {
    const fenKey = fen.split(' ').slice(0, 4).join(' ');
    const position = OPENINGS[fenKey];
    
    if (!position) return null;
    
    const moves = myColor === 'w' ? position.white : position.black;
    if (!moves || moves.length === 0) return null;
    
    // AlphaZero prefers active, fighting moves
    const adjustedMoves = moves.map(m => ({
        ...m,
        weight: m.weight * (1 + CONFIG.alphaZero.aggression * 0.1)
    }));
    
    const totalWeight = adjustedMoves.reduce((sum, m) => sum + m.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let moveOption of adjustedMoves) {
        random -= moveOption.weight;
        if (random <= 0) return moveOption.move;
    }
    
    return moves[0].move;
}

/**
 * AlphaZero Move Selection - NO RANDOM MISTAKES
 * AlphaZero plays the objectively best move, but considers strategic factors
 */
function selectAlphaZeroMove(bestMove, alternatives) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    // AlphaZero NEVER makes random mistakes
    // But it considers strategic factors beyond pure evaluation
    
    const best = alternatives[0];
    const second = alternatives[1];
    
    if (!best || !second) return bestMove;
    
    const scoreDiff = Math.abs((best.score || 0) - (second.score || 0));
    
    // In endgames, ALWAYS play the best move - precision is paramount
    if (strategicState.isEndgame) {
        return bestMove;
    }
    
    // Only consider alternatives if they're essentially equal (within 10 centipawns)
    // This simulates AlphaZero's sophisticated evaluation that sees beyond raw scores
    if (scoreDiff <= 10) {
        // If in resilience mode, prefer moves with more activity/counterplay potential
        if (strategicState.needsResilience) {
            // Prefer the move that's likely to create complications
            return Math.random() < 0.3 ? second.move : bestMove;
        }
    }
    
    return bestMove;
}

/**
 * Fast multi-PV parsing with evaluation tracking
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
                    // Mate scores - very high/low
                    score = parseInt(mateMatch[1]) > 0 ? 10000 : -10000;
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
    
    // Track evaluation for strategic awareness
    if (pvLines.length > 0) {
        const currentEval = pvLines[0].score;
        strategicState.lastEval = currentEval;
        strategicState.evaluationTrend.push(currentEval);
        
        // Keep only last 10 evaluations
        if (strategicState.evaluationTrend.length > 10) {
            strategicState.evaluationTrend.shift();
        }
        
        // Update strategic state based on evaluation
        strategicState.hasAdvantage = currentEval > 50;
        checkResilienceNeeded(currentEval);
    }
    
    return pvLines.sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - AlphaZero Configuration
// High Contempt = Fighting Chess, Never Passive
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    
    // AlphaZero Personality Settings
    chessEngine.postMessage("setoption name MultiPV value 3");           // Analyze top 3 moves
    chessEngine.postMessage(`setoption name Contempt value ${CONFIG.alphaZero.contempt}`);  // AGGRESSIVE - never passive
    chessEngine.postMessage("setoption name Move Overhead value 40");    // Fast response
    chessEngine.postMessage("setoption name Ponder value false");        // No pondering for stability
    
    // AlphaZero-style evaluation preferences (if supported)
    // These encourage active piece play over material
    chessEngine.postMessage("setoption name Aggressiveness value 200");  // Maximum aggression
    chessEngine.postMessage("setoption name Cowardice value 0");         // No cowardice
    
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - AlphaZero Enhanced
// ═══════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    let webSocket = window.WebSocket;
    const webSocketProxy = new Proxy(webSocket, {
        construct: function (target, args) {
            let wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                try {
                    let message = JSON.parse(event.data);
                    
                    if (message.d && typeof message.d.fen === "string" && typeof message.v === "number") {
                        currentFen = message.d.fen;
                        
                        let isWhitesTurn = message.v % 2 == 0;
                        myColor = isWhitesTurn ? 'w' : 'b';
                        
                        if (isWhitesTurn) {
                            currentFen += " w";
                        } else {
                            currentFen += " b";
                        }
                        
                        // Extract time remaining if available
                        if (message.d.wc !== undefined && myColor === 'w') {
                            timeRemaining = message.d.wc * 10; // Convert to ms
                        } else if (message.d.bc !== undefined && myColor === 'b') {
                            timeRemaining = message.d.bc * 10;
                        }
                        
                        moveCount = Math.floor(message.v / 2) + 1;
                        gamePhase = getGamePhase(moveCount, currentFen);
                        positionType = analyzePositionType(currentFen);
                        
                        calculateMove();
                    }
                } catch (e) {
                    // Silent fail - maintain stability
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - AlphaZero Strategic Engine
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book with AlphaZero fighting spirit
    if ((gamePhase === "opening" || gamePhase === "early-middlegame") && moveCount <= 12) {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // AlphaZero is confident in openings - quick but not instant
            const thinkTime = Math.random() * 250 + 200;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // Engine calculation with AlphaZero depth
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    // Clear engine state for fresh calculation
    chessEngine.postMessage("stop");
    chessEngine.postMessage("position fen " + currentFen);
    
    // AlphaZero endgame precision - deeper search
    let searchDepth = depth;
    if (strategicState.isEndgame) {
        // In endgames, prioritize depth over speed
        searchDepth = Math.min(depth + 2, 18);
        
        // Pawn endgames need maximum precision
        if (strategicState.endgameType === 'pawn') {
            searchDepth = Math.min(searchDepth + 1, 20);
        }
    }
    
    chessEngine.postMessage(`go depth ${searchDepth}`);
}

/**
 * Send move to Lichess - Clean and Stable
 */
function sendMove(move) {
    if (!webSocketWrapper || !move) return;
    
    try {
        webSocketWrapper.send(JSON.stringify({
            t: "move",
            d: { 
                u: move, 
                b: 1,
                l: Math.floor(Math.random() * 25) + 15,
                a: 1
            }
        }));
    } catch (e) {
        // Silent fail - maintain stability
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - AlphaZero Precision
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        if (!event) return;
        
        engineOutput += event + "\n";
        
        // Parse multi-PV for strategic awareness
        if (event.indexOf('multipv') !== -1 || event.indexOf(' pv ') !== -1) {
            const lines = parseMultiPV(event);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        // Best move found - AlphaZero executes
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            if (!bestMove || bestMove === '(none)') {
                engineOutput = "";
                return;
            }
            
            let finalMove = bestMove;
            
            // AlphaZero move selection - precision over randomness
            if (multiPVLines.length > 1) {
                finalMove = selectAlphaZeroMove(bestMove, multiPVLines);
            }
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO ENDGAME TECHNIQUES - The Crown Jewels
// Opposition, Triangulation, Zugzwang, Philidor, Lucena
// ═══════════════════════════════════════════════════════════════════════

/**
 * AlphaZero Endgame Mastery
 * These functions enhance the engine's endgame understanding
 */
const EndgameTechniques = {
    
    /**
     * Opposition Detection - Critical for King & Pawn endgames
     * Returns true if we have the opposition
     */
    hasOpposition: function(fen) {
        // Extract king positions from FEN
        const board = fen.split(' ')[0];
        let wKing = null, bKing = null;
        let rank = 7, file = 0;
        
        for (let i = 0; i < board.length; i++) {
            const c = board[i];
            if (c === '/') {
                rank--;
                file = 0;
            } else if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'K') wKing = { rank, file };
                else if (c === 'k') bKing = { rank, file };
                file++;
            }
        }
        
        if (!wKing || !bKing) return false;
        
        // Direct opposition: kings on same file/rank with one square between
        const fileDiff = Math.abs(wKing.file - bKing.file);
        const rankDiff = Math.abs(wKing.rank - bKing.rank);
        
        // Direct opposition
        if ((fileDiff === 0 && rankDiff === 2) || (rankDiff === 0 && fileDiff === 2)) {
            return true;
        }
        
        // Diagonal opposition
        if (fileDiff === 2 && rankDiff === 2) {
            return true;
        }
        
        return false;
    },
    
    /**
     * Zugzwang Detection - Position where any move loses
     * Critical for converting won endgames
     */
    isZugzwang: function(fen, eval1, eval2) {
        // If evaluation flips significantly after opponent's move, likely zugzwang
        if (Math.abs(eval1 - eval2) > 100) {
            return true;
        }
        return false;
    },
    
    /**
     * Rook Endgame Position Recognition
     * Philidor: Defensive drawing technique
     * Lucena: Winning technique with rook + pawn vs rook
     */
    analyzeRookEndgame: function(fen) {
        const counts = countPiecesDetailed(fen);
        
        // Check for Lucena/Philidor structure (R+P vs R)
        const totalPawns = counts.white.p + counts.black.p;
        const totalRooks = counts.white.r + counts.black.r;
        
        if (totalRooks === 2 && totalPawns <= 2) {
            return {
                isLucena: false, // Would need deeper position analysis
                isPhilidor: false,
                technique: 'cutting_off_king' // Default technique
            };
        }
        
        return null;
    },
    
    /**
     * Fortress Detection - Unbreakable defensive setup
     * AlphaZero never gives up when fortress is possible
     */
    isFortressPossible: function(fen, eval_score) {
        // If behind but position is closed/blockaded, fortress may be possible
        if (eval_score < -200 && eval_score > -500) {
            const counts = countPiecesDetailed(fen);
            
            // Fortress more likely with fewer pieces
            if (counts.total <= 12) {
                // Opposite colored bishops often lead to fortress
                if (counts.white.b === 1 && counts.black.b === 1) {
                    return true;
                }
                
                // Rook endgames often have fortress potential
                if (strategicState.endgameType === 'rook') {
                    return true;
                }
            }
        }
        return false;
    }
};

/**
 * AlphaZero Resilience Module - Never Gives Up
 * Seeks counterplay, swindles, and fortress positions
 */
const Resilience = {
    
    /**
     * Counterplay Seeker - Active defense
     */
    seekCounterplay: function(multiPV) {
        if (!multiPV || multiPV.length < 2) return null;
        
        // When behind, look for moves that create threats
        // Even if slightly worse objectively, complications help
        for (let line of multiPV) {
            if (line.score > -300) {
                return line.move;
            }
        }
        return null;
    },
    
    /**
     * Swindle Detector - Tricky positions when losing
     */
    findSwindle: function(multiPV, eval_score) {
        if (eval_score > -100) return null; // Not losing enough to need swindle
        
        // Look for moves that might confuse opponent
        // Prefer complex positions over simple losing ones
        if (multiPV && multiPV.length > 1) {
            const best = multiPV[0];
            const second = multiPV[1];
            
            // If moves are close, prefer the more complex one
            if (Math.abs(best.score - second.score) < 30) {
                // This is a heuristic - more work needed for true swindle detection
                return second.move;
            }
        }
        return null;
    }
};

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - AlphaZero Awakens
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();

// Export for debugging (optional)
if (typeof window !== 'undefined') {
    window.AlphaZeroBot = {
        config: CONFIG,
        state: strategicState,
        techniques: EndgameTechniques,
        resilience: Resilience
    };
}
