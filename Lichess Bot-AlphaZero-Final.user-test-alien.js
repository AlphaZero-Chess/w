// ==UserScript==
// @name         Lichess Bot - AlphaZero SUPERHUMAN
// @description  SUPERHUMAN AlphaZero-style - Maximum depth, aggressive, crushing play
// @author       AlphaZero - Superhuman Edition
// @version      4.0.0-SUPERHUMAN
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION - SUPERHUMAN MODE (No Human Weakness)
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // SUPERHUMAN Depths - Maximum calculation power
    baseDepth: 18,
    tacticalDepth: 22,
    positionalDepth: 20,
    endgameDepth: 22,
    openingDepth: 16,
    
    // NO mistakes - Pure engine perfection
    humanMistakeRate: 0,
    
    // Timing - Fast and efficient (no fake "thinking")
    thinkingTimeMin: 100,
    thinkingTimeMax: 800,
    
    // Speed multipliers - Quick decisive play
    openingSpeed: 0.3,
    earlyMidSpeed: 0.6,
    middlegameSpeed: 0.7,
    lateMidSpeed: 0.65,
    endgameSpeed: 0.5,
    criticalSpeed: 0.9,
    
    // Time thresholds
    panicThreshold: 5000,
    criticalThreshold: 10000
};

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO-STYLE OPENING BOOK - Aggressive & Dynamic
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - AlphaZero prefers d4, then e4
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },
            { move: "e2e4", weight: 0.40 },
            { move: "c2c4", weight: 0.10 }
        ]
    },
    // After 1.e4 - Sicilian priority
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.50 },
            { move: "e7e5", weight: 0.35 },
            { move: "e7e6", weight: 0.15 }
        ]
    },
    // After 1.d4 - Indian systems
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.55 },
            { move: "d7d5", weight: 0.30 },
            { move: "f7f5", weight: 0.15 }
        ]
    },
    // Sicilian - Open Sicilian
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.70 },
            { move: "b1c3", weight: 0.20 },
            { move: "f2f4", weight: 0.10 }
        ]
    },
    // Italian Game
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.55 },
            { move: "f8c5", weight: 0.45 }
        ]
    },
    // QGD positions
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },
            { move: "c7c6", weight: 0.35 },
            { move: "g8f6", weight: 0.25 }
        ]
    },
    // Nf3 systems
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.45 },
            { move: "g8f6", weight: 0.35 },
            { move: "c7c5", weight: 0.20 }
        ]
    },
    // London counter
    "rnbqkbnr/ppp1pppp/8/3p4/3P1B2/8/PPP1PPPP/RN1QKBNR b KQkq -": {
        black: [
            { move: "c7c5", weight: 0.50 },
            { move: "g8f6", weight: 0.30 },
            { move: "e7e6", weight: 0.20 }
        ]
    },
    // Catalan prep
    "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/8/PP2PPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "g2g3", weight: 0.60 },
            { move: "g1f3", weight: 0.30 },
            { move: "b1c3", weight: 0.10 }
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
let positionType = "normal";
let multiPVLines = [];
let myColor = null;
let moveCount = 0;
let timeRemaining = 30000;

// ═══════════════════════════════════════════════════════════════════════
// POSITION ANALYSIS - Enhanced for Superhuman Play
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
 * Position type detection - For tactical/positional depth adjustment
 */
function analyzePositionType(fen) {
    const board = fen.split(' ')[0];
    
    // Check indication
    if (fen.indexOf("+") !== -1) return "tactical";
    
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
 * Thinking time - Fast and efficient, no fake delays
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middlegameSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame") speedMultiplier = CONFIG.endgameSpeed;
    
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
    return Math.floor(Math.max(80, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * SUPERHUMAN depth selection - Maximum power
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    if (phase === "opening") {
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
 * SUPERHUMAN move selection - Always best move, no mistakes
 */
function selectBestMove(bestMove, alternatives) {
    // NO human variance - always play the absolute best
    // This is what makes it SUPERHUMAN
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
            
            if (pvMatch) {
                pvLines.push({
                    move: pvMatch[1],
                    score: scoreMatch ? parseInt(scoreMatch[1]) : 0
                });
            }
        }
    }
    
    return pvLines.sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - MAXIMUM POWER
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    chessEngine.postMessage("setoption name MultiPV value 3");
    chessEngine.postMessage("setoption name Contempt value 50");  // Aggressive - force wins
    chessEngine.postMessage("setoption name Move Overhead value 30");
    chessEngine.postMessage("isready");
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
                    gamePhase = getGamePhase(moveCount, currentFen);
                    positionType = analyzePositionType(currentFen);
                    
                    calculateMove();
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - SUPERHUMAN
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book for variety
    if (gamePhase === "opening" || gamePhase === "early-middlegame") {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // Fast book moves - no unnecessary delay
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
    
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage(`go depth ${depth}`);
    
    setTimeout(() => {
        // Handled by engine message callback
    }, thinkTime);
}

/**
 * Send move - Clean, no fake lag
 */
function sendMove(move) {
    webSocketWrapper.send(JSON.stringify({
        t: "move",
        d: { 
            u: move, 
            b: 1,
            l: Math.floor(Math.random() * 20) + 10,
            a: 1
        }
    }));
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER (STABLE - Same structure as working version)
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        engineOutput += event + "\n";
        
        if (event.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(event);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            // SUPERHUMAN: Always play the best move - NO variance
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
