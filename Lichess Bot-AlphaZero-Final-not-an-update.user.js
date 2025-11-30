// ==UserScript==
// @name         Lichess Bot - AlphaZero Marvel Edition
// @description  True AlphaZero-style: Aggressive counter-play, flawless endgame, strategic depth
// @author       AlphaZero - Marvel Edition
// @version      4.0.0-ALPHAZERO-MARVEL
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO MARVEL CONFIGURATION - Aggressive Counter-Play Style
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing - Faster but precise
    thinkingTimeMin: 150,
    thinkingTimeMax: 1200,
    // NO MISTAKES - AlphaZero plays with machine precision
    
    // Depth - Enhanced for strategic depth
    baseDepth: 12,
    tacticalDepth: 14,
    positionalDepth: 13,
    endgameDepth: 16,        // FLAWLESS endgame requires deeper search
    openingDepth: 11,
    counterPlayDepth: 15,    // NEW: Deep search when counter-play needed
    passedPawnDepth: 16,     // NEW: Critical for passed pawn handling
    
    // Speed multipliers - AlphaZero is decisive
    openingSpeed: 0.35,
    earlyMidSpeed: 0.7,
    middlegameSpeed: 0.85,
    lateMidSpeed: 0.8,
    endgameSpeed: 0.75,
    criticalSpeed: 1.1,
    counterPlaySpeed: 1.0,   // NEW: Take time for counter-play
    
    // Time thresholds
    panicThreshold: 6000,
    criticalThreshold: 12000,
    
    // AlphaZero Aggression Settings
    contempt: 75,            // HIGH contempt - never settle for draws
    aggressionFactor: 1.3,   // Prioritize active moves
    initiativeBonus: 40,     // Bonus for initiative-seeking moves
    counterPlayBonus: 50,    // Bonus for counter-attacking moves
    passedPawnPenalty: 60,   // Alert level for opponent passed pawns
    
    // Strategic Web Settings
    multiPVCount: 4,         // More options for strategic choice
    activityWeight: 1.2,     // Piece activity over material
    dynamicPlayChance: 0.25  // Chance to play dynamic/sacrificial
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO OPENING BOOK - Dynamic & Aggressive Repertoire
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - Favor dynamic openings
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.55 },  // King's pawn - aggressive
            { move: "d2d4", weight: 0.30 },  // Queen's pawn - strategic
            { move: "c2c4", weight: 0.10 },  // English - flexible
            { move: "g1f3", weight: 0.05 }   // Reti - hypermodern
        ]
    },
    // After 1.e4 - Sicilian & aggressive responses
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.55 },  // Sicilian - COUNTER-ATTACK
            { move: "e7e5", weight: 0.25 },  // Open game - tactical
            { move: "d7d5", weight: 0.12 },  // Scandinavian - immediate counter
            { move: "g8f6", weight: 0.08 }   // Alekhine - provocative
        ]
    },
    // After 1.d4 - Indian defenses (dynamic)
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.50 },  // Indian setup - flexible counter
            { move: "d7d5", weight: 0.25 },  // Symmetrical - solid counter
            { move: "f7f5", weight: 0.15 },  // Dutch - AGGRESSIVE counter
            { move: "c7c5", weight: 0.10 }   // Benoni style - dynamic
        ]
    },
    // Sicilian - Open Sicilian (most aggressive)
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.50 },  // Open Sicilian prep
            { move: "b1c3", weight: 0.25 },  // Closed Sicilian
            { move: "f2f4", weight: 0.15 },  // Grand Prix - ATTACK
            { move: "c2c3", weight: 0.10 }   // Alapin - solid
        ]
    },
    // Italian Game position
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.45 },  // Two Knights - tactical counter
            { move: "f8c5", weight: 0.40 },  // Giuoco Piano - classical
            { move: "d7d6", weight: 0.15 }   // Solid but ready to strike
        ]
    },
    // Queen's Gambit
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.35 },  // QGD - solid counter
            { move: "c7c6", weight: 0.30 },  // Slav - fortress then strike
            { move: "d5c4", weight: 0.20 },  // QGA - grab and hold
            { move: "c7c5", weight: 0.15 }   // Tarrasch - ACTIVE counter
        ]
    },
    // King's Indian setup
    "rnbqkb1r/pppppp1p/5np1/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "b1c3", weight: 0.50 },  // Main line
            { move: "g1f3", weight: 0.30 },  // Flexible
            { move: "f2f3", weight: 0.20 }   // Samisch - aggressive
        ]
    },
    // Nimzo-Indian
    "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR w KQkq -": {
        white: [
            { move: "e2e3", weight: 0.40 },  // Rubinstein
            { move: "d1c2", weight: 0.35 },  // Classical
            { move: "f2f3", weight: 0.25 }   // Samisch - fighting
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════
// GLOBAL STATE - Enhanced for AlphaZero Strategy
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
let threatLevel = 0;           // Opponent threat assessment
let counterPlayNeeded = false; // Flag for counter-play mode
let passedPawnAlert = false;   // Opponent has dangerous passed pawn
let initiativeScore = 0;       // Our initiative level
let lastEvaluation = 0;        // Track position evaluation trend
let positionHistory = [];      // For detecting repetitions/stagnation

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO CORE HELPERS - Counter-Play & Strategic Analysis
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
 * Count specific piece type
 */
function countPieceType(fen, piece) {
    let count = 0;
    const board = fen.split(' ')[0];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === piece) count++;
    }
    return count;
}

/**
 * ALPHAZERO PASSED PAWN DETECTION - Critical for counter-play
 * Detects opponent's passed pawns that need immediate attention
 */
function detectPassedPawns(fen) {
    const dominated = fen.split(' ')[0];
    const rows = dominated.split('/');
    const dominated_array = [];
    let hasEnemyPassedPawn = false;
    let passedPawnRank = 0;
    
    // Convert FEN to array
    for (let row of rows) {
        let rowArr = [];
        for (let c of row) {
            if (c >= '1' && c <= '8') {
                for (let i = 0; i < parseInt(c); i++) rowArr.push('.');
            } else {
                rowArr.push(c);
            }
        }
        dominated_array.push(rowArr);
    }
    
    // Check for enemy passed pawns (simplified but effective)
    const enemyPawn = myColor === 'w' ? 'p' : 'P';
    const dangerZone = myColor === 'w' ? [0, 1, 2] : [5, 6, 7]; // Ranks close to promotion
    
    for (let rank of dangerZone) {
        for (let file = 0; file < 8; file++) {
            if (dominated_array[rank] && dominated_array[rank][file] === enemyPawn) {
                // Check if it's likely passed (no friendly pawns ahead)
                let blocked = false;
                const checkRange = myColor === 'w' ? 
                    Array.from({length: rank}, (_, i) => i) : 
                    Array.from({length: 7 - rank}, (_, i) => rank + 1 + i);
                
                for (let r of checkRange) {
                    if (dominated_array[r]) {
                        // Check same file and adjacent files
                        for (let f = Math.max(0, file - 1); f <= Math.min(7, file + 1); f++) {
                            const myPawn = myColor === 'w' ? 'P' : 'p';
                            if (dominated_array[r][f] === myPawn) {
                                blocked = true;
                                break;
                            }
                        }
                    }
                    if (blocked) break;
                }
                
                if (!blocked) {
                    hasEnemyPassedPawn = true;
                    passedPawnRank = myColor === 'w' ? (7 - rank) : rank;
                    break;
                }
            }
        }
        if (hasEnemyPassedPawn) break;
    }
    
    return { hasPassedPawn: hasEnemyPassedPawn, rank: passedPawnRank };
}

/**
 * ALPHAZERO THREAT ASSESSMENT - Never get thrashed passively
 */
function assessThreats(fen) {
    let threat = 0;
    const dominated = fen.split(' ')[0];
    
    // Check for passed pawn danger
    const passedInfo = detectPassedPawns(fen);
    if (passedInfo.hasPassedPawn) {
        threat += 30 + (passedInfo.rank * 10); // Higher rank = more dangerous
        passedPawnAlert = true;
    } else {
        passedPawnAlert = false;
    }
    
    // Check for piece activity imbalance (enemy pieces more active)
    const enemyQueen = myColor === 'w' ? 'q' : 'Q';
    const enemyRook = myColor === 'w' ? 'r' : 'R';
    
    // Enemy heavy pieces on open files/ranks (simplified)
    if (countPieceType(dominated, enemyQueen) > 0) {
        // Check if queen is active (not on back rank)
        const queenActive = myColor === 'w' ? 
            (dominated.indexOf('q') < dominated.length / 2) :
            (dominated.indexOf('Q') > dominated.length / 2);
        if (queenActive) threat += 15;
    }
    
    // Multiple enemy rooks
    if (countPieceType(dominated, enemyRook) >= 2) {
        threat += 10;
    }
    
    return threat;
}

/**
 * ALPHAZERO COUNTER-PLAY DETECTOR - Identify when we need to fight back
 */
function needsCounterPlay(fen, evaluation) {
    // If we're worse, we MUST create counter-play
    if (evaluation < -50) return true;
    
    // If opponent has threats, counter-attack
    if (threatLevel > 30) return true;
    
    // If passed pawn is dangerous
    if (passedPawnAlert) return true;
    
    // If position is getting worse (trend)
    if (lastEvaluation > evaluation + 30) return true;
    
    return false;
}

/**
 * Game phase detection (enhanced for AlphaZero style)
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    
    if (moveNum <= 10) return "opening";
    if (moveNum <= 15 && pieces > 28) return "early-middlegame";
    if (pieces > 20) return "middlegame";
    if (pieces > 12) return "late-middlegame";
    if (pieces > 6) return "endgame";
    return "deep-endgame"; // NEW: Special handling for K+P endings
}

/**
 * ALPHAZERO Position type detection - Enhanced tactical awareness
 */
function analyzePositionType(fen) {
    // Check for immediate tactical needs
    if (fen.indexOf("+") !== -1) return "tactical";
    
    // Passed pawn situations require active play
    if (passedPawnAlert) return "counter-play";
    
    // Counter-play needed
    if (counterPlayNeeded) return "counter-play";
    
    // High threat level
    if (threatLevel > 40) return "defensive-active";
    
    // Check for open position (tactical potential)
    const dominated = fen.split(' ')[0];
    let emptySquares = 0;
    for (let c of dominated) {
        if (c >= '1' && c <= '8') emptySquares += parseInt(c);
    }
    
    if (emptySquares > 40) return "tactical";
    
    // Check for pawn tension (dynamic potential)
    if (dominated.indexOf("Pp") !== -1 || dominated.indexOf("pP") !== -1) {
        return "dynamic";
    }
    
    // Closed position - requires strategic maneuvering
    if (emptySquares < 25) return "strategic";
    
    return "positional";
}

/**
 * ALPHAZERO Adaptive thinking time - Decisive but thorough
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // Phase-based timing
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middlegameSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame" || phase === "deep-endgame") speedMultiplier = CONFIG.endgameSpeed;
    
    // Position type adjustments - AlphaZero takes time for critical decisions
    if (posType === "tactical") {
        speedMultiplier *= CONFIG.criticalSpeed;
    } else if (posType === "counter-play" || posType === "defensive-active") {
        speedMultiplier *= CONFIG.counterPlaySpeed; // Take time to find counter-play
    } else if (posType === "dynamic") {
        speedMultiplier *= 1.1; // Dynamic positions need calculation
    }
    
    // Passed pawn situations - critical, take time
    if (passedPawnAlert) {
        speedMultiplier *= 1.15;
    }
    
    // Time pressure adjustments
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.5;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.35;
    if (timeLeft < 4000) speedMultiplier *= 0.25;
    if (timeLeft < 2500) speedMultiplier *= 0.2;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance);
    return Math.floor(Math.max(100, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * ALPHAZERO Adaptive depth - Deeper for critical positions
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    // Phase-based depth
    if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        depth = CONFIG.endgameDepth; // FLAWLESS endgame
    } else if (phase === "deep-endgame") {
        depth = CONFIG.endgameDepth + 2; // Even deeper for K+P endings
    } else if (phase === "middlegame" || phase === "late-middlegame" || phase === "early-middlegame") {
        if (posType === "tactical") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "positional" || posType === "strategic") {
            depth = CONFIG.positionalDepth;
        }
    }
    
    // CRITICAL: Counter-play and passed pawn situations need maximum depth
    if (posType === "counter-play" || posType === "defensive-active") {
        depth = Math.max(depth, CONFIG.counterPlayDepth);
    }
    
    if (passedPawnAlert) {
        depth = Math.max(depth, CONFIG.passedPawnDepth);
    }
    
    // Time pressure depth reduction (but maintain minimum for quality)
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(10, depth - 1);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(9, depth - 2);
    if (timeLeft < 4000) depth = Math.max(8, depth - 3);
    if (timeLeft < 2500) depth = Math.max(7, depth - 4);
    
    return depth;
}

/**
 * Weighted opening book (AlphaZero variety with aggression bias)
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
 * ALPHAZERO Move Selection - Prioritize activity and counter-play
 * TRUE AlphaZero: NO mistakes, only optimal or equally-optimal moves
 * Unconventional ≠ Wrong. It means choosing dynamic options that are EQUALLY strong.
 */
function selectAlphaZeroMove(bestMove, alternatives) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    // In counter-play situations, prefer aggressive/active moves (ONLY if equally good)
    if (counterPlayNeeded || passedPawnAlert) {
        for (let alt of alternatives) {
            const scoreDiff = Math.abs((alternatives[0].score || 0) - (alt.score || 0));
            
            // ONLY choose alternative if it's within 10cp (essentially equal)
            if (scoreDiff <= 10) {
                const move = alt.move;
                if (move && (
                    move.includes('e4') || move.includes('d4') || 
                    move.includes('e5') || move.includes('d5') ||
                    move.length === 5 // Likely a capture or promotion
                )) {
                    return alt.move;
                }
            }
        }
    }
    
    // AlphaZero's unconventional play - choose dynamic option ONLY if equally strong
    if (Math.random() < CONFIG.dynamicPlayChance && alternatives.length > 1) {
        const secondBest = alternatives[1];
        const scoreDiff = Math.abs((alternatives[0].score || 0) - (secondBest.score || 0));
        
        // ONLY if moves are EQUAL (within 10cp) - not a mistake, just style choice
        if (scoreDiff <= 10) {
            return secondBest.move;
        }
    }
    
    // Always return the best move - NO intentional mistakes
    return bestMove;
}

/**
 * Fast multi-PV parsing (enhanced)
 */
function parseMultiPV(output) {
    const lines = output.split('\n');
    const pvLines = [];
    
    for (let line of lines) {
        if (line.indexOf('multipv') !== -1 || line.indexOf('pv ') !== -1) {
            const pvMatch = line.match(/pv\s+(\w+)/);
            const scoreMatch = line.match(/score\s+cp\s+(-?\d+)/);
            const mateMatch = line.match(/score\s+mate\s+(-?\d+)/);
            
            if (pvMatch) {
                let score = 0;
                if (mateMatch) {
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
    
    return pvLines.sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - AlphaZero Aggressive Settings
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    
    // ALPHAZERO SETTINGS - Aggressive, no-draw mentality
    chessEngine.postMessage(`setoption name MultiPV value ${CONFIG.multiPVCount}`);
    chessEngine.postMessage(`setoption name Contempt value ${CONFIG.contempt}`); // HIGH - never settle
    chessEngine.postMessage("setoption name Move Overhead value 30");
    chessEngine.postMessage("setoption name Ponder value false");
    
    // Aggressive style options (if supported)
    chessEngine.postMessage("setoption name Aggressiveness value 200");
    chessEngine.postMessage("setoption name Cowardice value 0");
    
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - Enhanced with Threat Analysis
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
                        
                        moveCount = Math.floor(message.v / 2) + 1;
                        
                        // ALPHAZERO ANALYSIS - Assess position before calculating
                        threatLevel = assessThreats(currentFen);
                        gamePhase = getGamePhase(moveCount, currentFen);
                        positionType = analyzePositionType(currentFen);
                        
                        // Track position for strategic planning
                        positionHistory.push(currentFen.split(' ')[0]);
                        if (positionHistory.length > 10) positionHistory.shift();
                        
                        calculateMove();
                    }
                    
                    // Track time remaining
                    if (message.d && message.d.clock) {
                        const clock = message.d.clock;
                        timeRemaining = myColor === 'w' ? clock.white : clock.black;
                    }
                } catch (e) {
                    // Silent fail - don't break the game
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO MOVE CALCULATION - Strategic Web Weaving
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book (dynamic variety)
    if (gamePhase === "opening" || (gamePhase === "early-middlegame" && moveCount <= 12)) {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            const thinkTime = Math.random() * 250 + 200;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // ALPHAZERO ENGINE CALCULATION
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    // Clear engine state for fresh calculation
    chessEngine.postMessage("stop");
    chessEngine.postMessage("position fen " + currentFen);
    
    // Use appropriate search based on situation
    if (passedPawnAlert || counterPlayNeeded || positionType === "counter-play") {
        // CRITICAL POSITION - Search deeper with more options
        chessEngine.postMessage(`setoption name MultiPV value ${CONFIG.multiPVCount + 1}`);
        chessEngine.postMessage(`go depth ${depth}`);
    } else {
        chessEngine.postMessage(`go depth ${depth}`);
    }
}

/**
 * Send move with natural timing
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
        // Silent fail
    }
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO ENGINE MESSAGE HANDLER - Strategic Move Selection
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    let currentEvaluation = 0;
    
    chessEngine.onmessage = function (event) {
        if (!event) return;
        
        engineOutput += event + "\n";
        
        // Parse multi-PV lines for strategic options
        if (event.indexOf('pv ') !== -1) {
            const lines = parseMultiPV(event);
            if (lines.length > 0) {
                multiPVLines = lines;
                
                // Track evaluation for counter-play detection
                if (lines[0] && lines[0].score !== undefined) {
                    currentEvaluation = lines[0].score;
                    
                    // Adjust for color
                    if (myColor === 'b') currentEvaluation = -currentEvaluation;
                    
                    // Detect if counter-play is needed
                    counterPlayNeeded = needsCounterPlay(currentFen, currentEvaluation);
                }
            }
        }
        
        // Best move found - apply AlphaZero selection
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            if (!bestMove || bestMove === "(none)") {
                engineOutput = "";
                return;
            }
            
            // ALPHAZERO MOVE SELECTION - Not just best, but strategic
            let finalMove = bestMove;
            
            if (multiPVLines.length > 1) {
                finalMove = selectAlphaZeroMove(bestMove, multiPVLines);
            }
            
            // Update evaluation history for trend tracking
            lastEvaluation = currentEvaluation;
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - AlphaZero Marvel Activated
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();

console.log("🏆 AlphaZero Marvel Edition v4.0 - Counter-Play Enabled");
