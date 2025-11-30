// ==UserScript==
// @name         Lichess Bot - True AlphaZero (Aggressive Edition)
// @description  True AlphaZero style - Maximum aggression, no passive play, redefining chess
// @author       AlphaZero - Aggressive Edition
// @version      4.0.0-ALPHAZERO-AGGRESSIVE
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION - TRUE ALPHAZERO: MAXIMUM AGGRESSION, NO PASSIVE PLAY
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing - Fast and decisive like AlphaZero
    thinkingTimeMin: 100,
    thinkingTimeMax: 800,
    
    // NO MISTAKES - AlphaZero plays perfectly aggressive
    humanMistakeRate: 0,
    
    // Depth - Optimized for aggressive tactical vision
    baseDepth: 14,
    tacticalDepth: 16,
    positionalDepth: 14,
    endgameDepth: 15,
    openingDepth: 12,
    
    // Speed multipliers - Fast decisive play
    openingSpeed: 0.3,
    earlyMidSpeed: 0.5,
    middlegameSpeed: 0.7,
    lateMidSpeed: 0.6,
    endgameSpeed: 0.5,
    criticalSpeed: 0.9,
    
    // Time thresholds - More aggressive time management
    panicThreshold: 5000,
    criticalThreshold: 10000,
    
    // AlphaZero Aggression Settings
    aggressionLevel: 100,        // Maximum aggression (0-100)
    preferSacrifices: true,      // Prefer piece sacrifices for initiative
    avoidDraws: true,            // Never play for draws
    kingAttackBonus: 50,         // Bonus for king attacks
    spaceControlBonus: 30,       // Bonus for space control
    initiativeBonus: 40          // Bonus for maintaining initiative
};

// ═══════════════════════════════════════════════════════════════════════
// OPENING BOOK - ALPHAZERO AGGRESSIVE REPERTOIRE
// Sharp gambits, aggressive lines, maximum initiative
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - Aggressive openings only
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.70 },  // King's pawn - aggressive
            { move: "d2d4", weight: 0.25 },  // Queen's pawn - can be aggressive
            { move: "f2f4", weight: 0.05 }   // Bird's Opening - ultra aggressive
        ]
    },
    // After 1.e4 - Black plays sharp
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.45 },  // Sicilian - fighting chess
            { move: "e7e5", weight: 0.35 },  // Open game - tactical
            { move: "d7d5", weight: 0.15 },  // Scandinavian - sharp
            { move: "g8f6", weight: 0.05 }   // Alekhine - counterattacking
        ]
    },
    // After 1.d4 - Black plays aggressive
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.40 },  // Indian defenses
            { move: "d7d5", weight: 0.30 },  // Classical
            { move: "f7f5", weight: 0.20 },  // Dutch - aggressive
            { move: "c7c5", weight: 0.10 }   // Benoni style - sharp
        ]
    },
    // Sicilian - White plays Open Sicilian aggressively
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.50 },  // Open Sicilian prep
            { move: "b1c3", weight: 0.25 },  // Closed - but aggressive
            { move: "f2f4", weight: 0.15 },  // Grand Prix Attack - ultra sharp
            { move: "d2d4", weight: 0.10 }   // Immediate central break
        ]
    },
    // Italian Game position - Attack!
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.40 },  // Two Knights - sharp
            { move: "f8c5", weight: 0.50 },  // Giuoco Piano - can be aggressive
            { move: "d7d6", weight: 0.10 }   // Solid but allows attack
        ]
    },
    // Queen's Gambit - Black accepts or fights
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "d5c4", weight: 0.40 },  // QGA - fighting for the pawn
            { move: "c7c6", weight: 0.30 },  // Slav - solid but sharp
            { move: "e7e5", weight: 0.20 },  // Albin Counter-Gambit - ultra aggressive!
            { move: "c7c5", weight: 0.10 }   // Tarrasch - active play
        ]
    },
    // King's Gambit - Maximum aggression
    "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq f3": {
        black: [
            { move: "e5f4", weight: 0.60 },  // Accept - sharp play
            { move: "d7d5", weight: 0.30 },  // Falkbeer Counter-Gambit
            { move: "f8c5", weight: 0.10 }   // Decline but stay active
        ]
    },
    // Evans Gambit position
    "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq -": {
        white: [
            { move: "b2b4", weight: 0.70 },  // Evans Gambit! Maximum attack
            { move: "c2c3", weight: 0.20 },  // Italian prep
            { move: "d2d3", weight: 0.10 }   // Solid but less exciting
        ]
    },
    // Ruy Lopez - Aggressive Marshall Attack territory
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },  // Morphy Defense - prep for Marshall
            { move: "g8f6", weight: 0.35 },  // Berlin - but can transpose to sharp
            { move: "f8c5", weight: 0.15 }   // Classical - active piece play
        ]
    },
    // Scandinavian accepted
    "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq -": {
        black: [
            { move: "d8d5", weight: 0.60 },  // Take back - fighting
            { move: "g8f6", weight: 0.40 }   // Modern Scandinavian - sharp
        ]
    },
    // French Defense - White breaks through
    "rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.60 },  // Main line - build pressure
            { move: "d2d3", weight: 0.20 },  // King's Indian Attack
            { move: "b1c3", weight: 0.20 }   // Development
        ]
    },
    // Caro-Kann - White attacks
    "rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "d2d4", weight: 0.50 },  // Classical approach
            { move: "b1c3", weight: 0.30 },  // Two Knights
            { move: "c2c4", weight: 0.20 }   // Panov Attack - aggressive pawn play
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
let positionType = "aggressive";  // Default to aggressive
let multiPVLines = [];
let myColor = null;
let moveCount = 0;
let timeRemaining = 30000;

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO AGGRESSIVE HELPERS
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
 * Count specific piece types for aggression analysis
 */
function countPieceTypes(fen) {
    const board = fen.split(' ')[0];
    let counts = { wQ: 0, bQ: 0, wR: 0, bR: 0, wB: 0, bB: 0, wN: 0, bN: 0, wP: 0, bP: 0 };
    
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
    }
    return counts;
}

/**
 * Check if king is in center (target for attack)
 */
function isKingInCenter(fen) {
    const board = fen.split(' ')[0];
    const rows = board.split('/');
    
    // Check if enemy king is in center files (d, e, f) and not castled
    for (let i = 0; i < rows.length; i++) {
        let col = 0;
        for (let j = 0; j < rows[i].length; j++) {
            const c = rows[i][j];
            if (c >= '1' && c <= '8') {
                col += parseInt(c);
            } else {
                if ((c === 'k' || c === 'K') && col >= 3 && col <= 5) {
                    return true;
                }
                col++;
            }
        }
    }
    return false;
}

/**
 * Game phase detection - AlphaZero style (always looking for attack)
 */
function getGamePhase(moveNum, fen) {
    const pieces = countPieces(fen);
    
    if (moveNum <= 8) return "opening";
    if (moveNum <= 12 && pieces > 28) return "early-middlegame";
    if (pieces > 18) return "middlegame";
    if (pieces > 10) return "late-middlegame";
    return "endgame";
}

/**
 * AlphaZero Position Analysis - ALWAYS prefer aggressive positions
 */
function analyzePositionType(fen) {
    const pieces = countPieceTypes(fen);
    
    // Check for open position (good for attacks)
    const board = fen.split(' ')[0];
    let centerPawns = 0;
    if (board.indexOf('P') !== -1 || board.indexOf('p') !== -1) {
        // Count center pawns - fewer = more open = more attacking chances
        const rows = board.split('/');
        for (let row of rows) {
            let col = 0;
            for (let c of row) {
                if (c >= '1' && c <= '8') col += parseInt(c);
                else {
                    if ((c === 'P' || c === 'p') && col >= 2 && col <= 5) centerPawns++;
                    col++;
                }
            }
        }
    }
    
    // King in center = ATTACK
    if (isKingInCenter(fen)) return "king-hunt";
    
    // Open center = tactical aggression
    if (centerPawns < 3) return "tactical";
    
    // Material imbalance = attack to capitalize
    const myPieces = myColor === 'w' ? 
        (pieces.wQ * 9 + pieces.wR * 5 + pieces.wB * 3 + pieces.wN * 3 + pieces.wP) :
        (pieces.bQ * 9 + pieces.bR * 5 + pieces.bB * 3 + pieces.bN * 3 + pieces.bP);
    const oppPieces = myColor === 'w' ?
        (pieces.bQ * 9 + pieces.bR * 5 + pieces.bB * 3 + pieces.bN * 3 + pieces.bP) :
        (pieces.wQ * 9 + pieces.wR * 5 + pieces.wB * 3 + pieces.wN * 3 + pieces.wP);
    
    if (myPieces > oppPieces + 2) return "converting";  // Convert advantage aggressively
    if (myPieces < oppPieces - 2) return "counterattack"; // Must attack to save game
    
    // Default: tactical aggression
    return "tactical";
}

/**
 * AlphaZero Thinking Time - Fast and decisive
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // AlphaZero is fast and confident
    if (phase === "opening") speedMultiplier = CONFIG.openingSpeed;
    else if (phase === "early-middlegame") speedMultiplier = CONFIG.earlyMidSpeed;
    else if (phase === "middlegame") speedMultiplier = CONFIG.middlegameSpeed;
    else if (phase === "late-middlegame") speedMultiplier = CONFIG.lateMidSpeed;
    else if (phase === "endgame") speedMultiplier = CONFIG.endgameSpeed;
    
    // Critical positions need slightly more time
    if (posType === "king-hunt" || posType === "counterattack") {
        speedMultiplier *= CONFIG.criticalSpeed;
    }
    
    // Time pressure - play fast but still aggressive
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.5;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.35;
    if (timeLeft < 3000) speedMultiplier *= 0.25;
    if (timeLeft < 1500) speedMultiplier *= 0.15;
    
    let baseTime = CONFIG.thinkingTimeMin;
    let variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    
    const thinkTime = baseTime + (Math.random() * variance * 0.3);  // Less variance for consistency
    return Math.floor(Math.max(80, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * AlphaZero Depth - Deep tactical vision
 */
function getDepth(phase, posType, timeLeft) {
    let depth = CONFIG.baseDepth;
    
    if (phase === "opening") {
        depth = CONFIG.openingDepth;
    } else if (phase === "endgame") {
        depth = CONFIG.endgameDepth;
    } else {
        // Middlegame - maximum tactical depth
        if (posType === "king-hunt") {
            depth = CONFIG.tacticalDepth + 2;  // Extra depth for king attacks!
        } else if (posType === "tactical" || posType === "counterattack") {
            depth = CONFIG.tacticalDepth;
        } else if (posType === "converting") {
            depth = CONFIG.positionalDepth + 1;  // Careful conversion
        } else {
            depth = CONFIG.positionalDepth;
        }
    }
    
    // Time pressure - still maintain reasonable depth
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
 * AlphaZero Move Selection - NO mistakes, prefer aggressive moves
 */
function selectBestAggressiveMove(bestMove, alternatives) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    // AlphaZero NEVER makes intentional mistakes
    // But it does prefer aggressive moves when scores are close
    
    const bestScore = alternatives[0].score || 0;
    
    // Look for equally good but more aggressive moves
    for (let i = 1; i < Math.min(alternatives.length, 4); i++) {
        const alt = alternatives[i];
        const scoreDiff = bestScore - (alt.score || 0);
        
        // If move is within 15 centipawns, check if it's more aggressive
        if (scoreDiff < 15 && scoreDiff >= 0) {
            const move = alt.move;
            // Prefer captures, checks, and central moves
            if (isAggressiveMove(move)) {
                return move;
            }
        }
    }
    
    return bestMove;
}

/**
 * Check if move is aggressive (captures, checks, central play)
 */
function isAggressiveMove(move) {
    if (!move || move.length < 4) return false;
    
    const toSquare = move.substring(2, 4);
    const toFile = toSquare[0];
    const toRank = toSquare[1];
    
    // Central squares are aggressive
    if ((toFile === 'd' || toFile === 'e') && (toRank === '4' || toRank === '5')) {
        return true;
    }
    
    // Moves toward enemy king side (ranks 7-8 for white, 1-2 for black)
    if (myColor === 'w' && (toRank === '7' || toRank === '8')) return true;
    if (myColor === 'b' && (toRank === '1' || toRank === '2')) return true;
    
    // Pawn promotions
    if (move.length === 5) return true;
    
    return false;
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
                    // Mate scores - very high value
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
// ENGINE INITIALIZATION - AlphaZero Aggressive Settings
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    
    // AlphaZero Aggressive Settings
    chessEngine.postMessage("setoption name MultiPV value 3");       // Analyze top 3 moves
    chessEngine.postMessage("setoption name Contempt value 100");    // MAXIMUM contempt - never draw
    chessEngine.postMessage("setoption name Move Overhead value 30"); // Fast response
    chessEngine.postMessage("setoption name Aggressiveness value 200"); // If available
    
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - Stable and efficient
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
                    
                    // Extract time if available
                    if (message.d.wc !== undefined && message.d.bc !== undefined) {
                        timeRemaining = myColor === 'w' ? message.d.wc : message.d.bc;
                    }
                    
                    calculateMove();
                }
            });
            
            return wrappedWebSocket;
        }
    });

    window.WebSocket = webSocketProxy;
}

// ═══════════════════════════════════════════════════════════════════════
// MOVE CALCULATION - AlphaZero Style
// ═══════════════════════════════════════════════════════════════════════

function calculateMove() {
    // Opening book - aggressive repertoire
    if (gamePhase === "opening" || (gamePhase === "early-middlegame" && moveCount <= 10)) {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            // Fast opening play
            const thinkTime = Math.random() * 150 + 100;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // Engine calculation with aggressive settings
    const depth = getDepth(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage(`go depth ${depth}`);
}

/**
 * Send move - fast and clean
 */
function sendMove(move) {
    if (!webSocketWrapper || !move) return;
    
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
// ENGINE MESSAGE HANDLER - AlphaZero Selection
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        engineOutput += event + "\n";
        
        // Parse multi-PV lines for aggressive move selection
        if (event.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(event);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            let finalMove = bestMove;
            
            // AlphaZero aggressive move selection
            if (multiPVLines.length > 1) {
                finalMove = selectBestAggressiveMove(bestMove, multiPVLines);
            }
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - Clean and stable
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
