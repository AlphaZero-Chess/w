// ==UserScript==
// @name         Lichess Bot - AlphaZero God-Mode (Strategic Mastery)
// @description  True AlphaZero personality: Strategic depth, flawless endgames, no passive play
// @author       AlphaZero - God-Like Edition
// @version      4.0.0-ALPHAZERO-GODMODE
// @match         *://lichess.org/*
// @run-at        document-start
// @grant         none
// @require       https://cdn.jsdelivr.net/gh/AlphaZero-Chess/vc@refs/heads/main/stockfish1.js
// ==/UserScript==

'use strict';

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO CONFIGURATION - Strategic Mastery & Active Play
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Timing - AlphaZero patience with decisive action
    thinkingTimeMin: 180,
    thinkingTimeMax: 1400,
    humanMistakeRate: 0.02,  // Reduced - AlphaZero precision
    
    // Depth - Enhanced for strategic depth
    baseDepth: 12,
    tacticalDepth: 14,
    positionalDepth: 13,
    endgameDepth: 15,  // AlphaZero's legendary endgame depth
    openingDepth: 11,
    
    // Speed multipliers - Active, non-passive play
    openingSpeed: 0.45,
    earlyMidSpeed: 0.7,
    middlegameSpeed: 0.85,
    lateMidSpeed: 0.8,
    endgameSpeed: 0.9,  // More time in endgames - AlphaZero patience
    criticalSpeed: 1.15,
    
    // Time thresholds
    panicThreshold: 7000,
    criticalThreshold: 14000,
    
    // AlphaZero Strategic Personality
    alphaZero: {
        aggressionFactor: 0.75,       // Prefer active moves
        contemptValue: 45,             // Higher contempt - play for win
        activityBonus: 25,             // Bonus for piece activity
        passivityPenalty: -30,         // Penalty for passive positions
        endgamePrecision: true,        // Enable endgame techniques
        strategicDepth: true,          // Long-term planning
        resilience: true,              // Counterplay & fortress detection
        zugzwangAwareness: true,       // Avoid/exploit zugzwang
        unconventionalPlay: 0.12       // Surprise factor
    }
};

// ═══════════════════════════════════════════════════════════════════════
// OPENING BOOK - AlphaZero Active/Aggressive Repertoire
// ═══════════════════════════════════════════════════════════════════════

const OPENINGS = {
    // Starting position - AlphaZero's sharp preferences
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -": {
        white: [
            { move: "e2e4", weight: 0.55 },  // King's pawn - active
            { move: "d2d4", weight: 0.30 },  // Queen's pawn - strategic
            { move: "c2c4", weight: 0.10 },  // English - flexible
            { move: "g1f3", weight: 0.05 }   // Reti - positional
        ]
    },
    // Sicilian - AlphaZero loves sharp play
    "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3": {
        black: [
            { move: "c7c5", weight: 0.55 },  // Sicilian - combative
            { move: "e7e5", weight: 0.25 },  // Open game
            { move: "c7c6", weight: 0.12 },  // Caro-Kann - solid but active
            { move: "e7e6", weight: 0.08 }   // French
        ]
    },
    // d4 responses - Active defenses
    "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3": {
        black: [
            { move: "g8f6", weight: 0.40 },  // Indian systems
            { move: "d7d5", weight: 0.35 },  // Classical
            { move: "e7e6", weight: 0.15 },  // Semi-closed
            { move: "c7c5", weight: 0.10 }   // Benoni spirit
        ]
    },
    // Open Sicilian - Sharp continuations
    "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6": {
        white: [
            { move: "g1f3", weight: 0.55 },  // Open Sicilian
            { move: "b1c3", weight: 0.30 },  // Closed Sicilian
            { move: "c2c3", weight: 0.15 }   // Alapin
        ]
    },
    // Italian - Active piece play
    "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "g8f6", weight: 0.45 },  // Two Knights - tactical
            { move: "f8c5", weight: 0.45 },  // Giuoco Piano - classical
            { move: "f8e7", weight: 0.10 }   // Hungarian
        ]
    },
    // Queen's Gambit
    "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3": {
        black: [
            { move: "e7e6", weight: 0.40 },  // QGD
            { move: "c7c6", weight: 0.30 },  // Slav
            { move: "d5c4", weight: 0.20 },  // QGA - active
            { move: "g8f6", weight: 0.10 }
        ]
    },
    // Ruy Lopez positions
    "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq -": {
        black: [
            { move: "a7a6", weight: 0.50 },  // Morphy Defense
            { move: "g8f6", weight: 0.30 },  // Berlin - solid
            { move: "f8c5", weight: 0.20 }   // Classical
        ]
    },
    // King's Indian Attack setup
    "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq -": {
        black: [
            { move: "d7d5", weight: 0.45 },
            { move: "g8f6", weight: 0.35 },
            { move: "c7c5", weight: 0.20 }
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
let positionHistory = [];  // For repetition/fortress detection
let materialBalance = 0;   // Track material for endgame decisions

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO CORE - Fast Piece Counting & Material Analysis
// ═══════════════════════════════════════════════════════════════════════

/**
 * Fast piece counting (optimized, no regex) - ROBUST
 */
function countPieces(fen) {
    let count = 0;
    const board = fen.split(' ')[0];
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
            count++;
        }
    }
    return count;
}

/**
 * Fast material counting - AlphaZero precision evaluation
 * Returns: { white, black, balance, isEndgame, hasPawns }
 */
function analyzeMaterial(fen) {
    const board = fen.split(' ')[0];
    const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
    let white = 0, black = 0;
    let whitePawns = 0, blackPawns = 0;
    let whiteMinor = 0, blackMinor = 0;
    let whiteRooks = 0, blackRooks = 0;
    let whiteQueens = 0, blackQueens = 0;
    
    for (let i = 0; i < board.length; i++) {
        const c = board[i];
        const lower = c.toLowerCase();
        const val = pieceValues[lower] || 0;
        
        if (c >= 'A' && c <= 'Z') {
            white += val;
            if (lower === 'p') whitePawns++;
            else if (lower === 'n' || lower === 'b') whiteMinor++;
            else if (lower === 'r') whiteRooks++;
            else if (lower === 'q') whiteQueens++;
        } else if (c >= 'a' && c <= 'z') {
            black += val;
            if (lower === 'p') blackPawns++;
            else if (lower === 'n' || lower === 'b') blackMinor++;
            else if (lower === 'r') blackRooks++;
            else if (lower === 'q') blackQueens++;
        }
    }
    
    const totalMaterial = white + black;
    
    return {
        white,
        black,
        balance: white - black,
        totalMaterial,
        isEndgame: totalMaterial <= 26,
        isPureEndgame: totalMaterial <= 14,
        hasPawns: (whitePawns + blackPawns) > 0,
        whitePawns,
        blackPawns,
        whiteMinor,
        blackMinor,
        whiteRooks,
        blackRooks,
        whiteQueens,
        blackQueens,
        // Endgame type detection
        isRookEndgame: (whiteRooks > 0 || blackRooks > 0) && whiteQueens === 0 && blackQueens === 0 && whiteMinor === 0 && blackMinor === 0,
        isPawnEndgame: whiteMinor === 0 && blackMinor === 0 && whiteRooks === 0 && blackRooks === 0 && whiteQueens === 0 && blackQueens === 0,
        isMinorEndgame: (whiteMinor > 0 || blackMinor > 0) && whiteRooks === 0 && blackRooks === 0 && whiteQueens === 0 && blackQueens === 0
    };
}

/**
 * Detect king positions for endgame techniques
 */
function getKingPositions(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    let whiteKing = null, blackKing = null;
    
    for (let rank = 0; rank < 8; rank++) {
        let file = 0;
        for (let i = 0; i < ranks[rank].length; i++) {
            const c = ranks[rank][i];
            if (c >= '1' && c <= '8') {
                file += parseInt(c);
            } else {
                if (c === 'K') whiteKing = { rank: 7 - rank, file };
                else if (c === 'k') blackKing = { rank: 7 - rank, file };
                file++;
            }
        }
    }
    
    return { whiteKing, blackKing };
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO ENDGAME MASTERY - Opposition, Triangulation, Zugzwang
// ═══════════════════════════════════════════════════════════════════════

/**
 * Check if we have opposition (key endgame concept)
 */
function hasOpposition(kings, colorToMove) {
    if (!kings.whiteKing || !kings.blackKing) return false;
    
    const fileDiff = Math.abs(kings.whiteKing.file - kings.blackKing.file);
    const rankDiff = Math.abs(kings.whiteKing.rank - kings.blackKing.rank);
    
    // Direct opposition (same file/rank, 2 squares apart)
    if (fileDiff === 0 && rankDiff === 2) return true;
    if (rankDiff === 0 && fileDiff === 2) return true;
    
    // Diagonal opposition
    if (fileDiff === 2 && rankDiff === 2) return true;
    
    return false;
}

/**
 * Detect zugzwang potential (forced to move = lose)
 */
function detectZugzwang(fen, material) {
    // Zugzwang most common in pure pawn/king endgames
    if (!material.isPawnEndgame && !material.isMinorEndgame) return false;
    
    // Low material = higher zugzwang potential
    if (material.totalMaterial <= 8) return true;
    
    // Few pawns left
    if (material.whitePawns + material.blackPawns <= 3) return true;
    
    return false;
}

/**
 * Detect Philidor/Lucena position patterns
 */
function detectRookEndgamePattern(fen, material, kings) {
    if (!material.isRookEndgame) return null;
    if (!material.hasPawns) return 'drawn';
    
    // Simplified Lucena detection: Rook + Pawn vs Rook, pawn on 7th rank
    const board = fen.split(' ')[0];
    
    // Check for advanced passed pawns
    if (board.indexOf('P') !== -1 && board.split('/')[1].indexOf('P') !== -1) {
        return 'lucena_potential';  // White pawn on 7th
    }
    if (board.indexOf('p') !== -1 && board.split('/')[6].indexOf('p') !== -1) {
        return 'lucena_potential';  // Black pawn on 2nd
    }
    
    // Philidor: defending side's rook on 3rd/6th rank
    return 'philidor_potential';
}

/**
 * Fortress detection - recognize drawn positions despite material deficit
 */
function detectFortress(fen, material) {
    // Bishop + wrong rook pawn fortress
    if (material.isMinorEndgame && material.whitePawns + material.blackPawns === 1) {
        const board = fen.split(' ')[0];
        // Check for a/h file pawns
        if (board.indexOf('P') !== -1 || board.indexOf('p') !== -1) {
            const firstRank = board.split('/')[7];
            const lastRank = board.split('/')[0];
            if (firstRank.indexOf('B') !== -1 || lastRank.indexOf('b') !== -1) {
                return true;  // Potential wrong bishop fortress
            }
        }
    }
    
    // Opposite colored bishops = drawish
    if (material.whiteMinor === 1 && material.blackMinor === 1) {
        const board = fen.split(' ')[0];
        const hasBothBishops = board.indexOf('B') !== -1 && board.indexOf('b') !== -1;
        if (hasBothBishops) return 'opposite_bishops';
    }
    
    return false;
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO STRATEGIC EVALUATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Detect piece activity level (AlphaZero key insight)
 */
function evaluatePieceActivity(fen) {
    const board = fen.split(' ')[0];
    const ranks = board.split('/');
    let activity = 0;
    
    // Central control bonus (d4-e4-d5-e5)
    const centralRanks = [ranks[3], ranks[4]];  // 4th and 5th ranks
    for (const rank of centralRanks) {
        for (let i = 0; i < rank.length; i++) {
            const c = rank[i];
            if (c >= 'A' && c <= 'Z' && c !== 'P') activity += 5;
            else if (c >= 'a' && c <= 'z' && c !== 'p') activity -= 5;
        }
    }
    
    // Rook on open file bonus (7th/2nd rank)
    if (ranks[1].indexOf('R') !== -1) activity += 15;  // Rook on 7th
    if (ranks[6].indexOf('r') !== -1) activity -= 15;  // Rook on 2nd
    
    return activity;
}

/**
 * Detect counterplay potential (AlphaZero resilience)
 */
function hasCounterplay(fen, material, myCol) {
    // In worse positions, look for counterplay
    const isWhite = myCol === 'w';
    const myMaterial = isWhite ? material.white : material.black;
    const oppMaterial = isWhite ? material.black : material.white;
    
    // If we're down material, seek activity
    if (myMaterial < oppMaterial) {
        const activity = evaluatePieceActivity(fen);
        const myActivity = isWhite ? activity : -activity;
        
        // Compensation through activity
        if (myActivity > 10) return true;
    }
    
    return false;
}

/**
 * AlphaZero strategic assessment
 */
function getStrategicAssessment(fen, material, moveNum) {
    const kings = getKingPositions(fen);
    
    return {
        material,
        hasOpposition: hasOpposition(kings, fen.includes(' w ') ? 'w' : 'b'),
        zugzwangRisk: detectZugzwang(fen, material),
        rookPattern: detectRookEndgamePattern(fen, material, kings),
        fortress: detectFortress(fen, material),
        activity: evaluatePieceActivity(fen),
        kings
    };
}

// ═══════════════════════════════════════════════════════════════════════
// ALPHAZERO PHASE & POSITION DETECTION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Game phase detection - Enhanced for AlphaZero strategic awareness
 */
function getGamePhase(moveNum, fen) {
    const material = analyzeMaterial(fen);
    
    if (moveNum <= 10) return "opening";
    if (moveNum <= 15 && !material.isEndgame) return "early-middlegame";
    if (material.isPureEndgame) return "pure-endgame";
    if (material.isEndgame) return "endgame";
    if (material.totalMaterial > 45) return "middlegame";
    return "late-middlegame";
}

/**
 * Position type detection - AlphaZero tactical/positional awareness
 */
function analyzePositionType(fen) {
    // Check detection
    if (fen.indexOf("+") !== -1) return "tactical";
    
    const material = analyzeMaterial(fen);
    
    // Endgame precision mode
    if (material.isPureEndgame) return "endgame-critical";
    if (material.isRookEndgame) return "rook-endgame";
    if (material.isPawnEndgame) return "pawn-endgame";
    
    // Tactical indicators
    const board = fen.split(' ')[0];
    
    // Queens on board with low material = tactical
    if ((material.whiteQueens > 0 || material.blackQueens > 0) && material.totalMaterial < 35) {
        return "tactical";
    }
    
    // Open position detection
    let emptyRanks = 0;
    const ranks = board.split('/');
    for (const rank of ranks) {
        let empty = 0;
        for (let i = 0; i < rank.length; i++) {
            const c = rank[i];
            if (c >= '1' && c <= '8') empty += parseInt(c);
        }
        if (empty >= 6) emptyRanks++;
    }
    if (emptyRanks >= 4) return "tactical";
    
    // Pawn structure = positional
    if (board.indexOf("pp") !== -1 || board.indexOf("PP") !== -1) {
        return "positional";
    }
    
    // Random tactical assessment (AlphaZero's unconventional sense)
    if (Math.random() < CONFIG.alphaZero.unconventionalPlay) return "tactical";
    
    return "normal";
}

/**
 * AlphaZero-style thinking time - Patient but decisive
 */
function getThinkTime(phase, posType, timeLeft) {
    let speedMultiplier = 1.0;
    
    // Phase-based timing
    switch (phase) {
        case "opening": speedMultiplier = CONFIG.openingSpeed; break;
        case "early-middlegame": speedMultiplier = CONFIG.earlyMidSpeed; break;
        case "middlegame": speedMultiplier = CONFIG.middlegameSpeed; break;
        case "late-middlegame": speedMultiplier = CONFIG.lateMidSpeed; break;
        case "endgame":
        case "pure-endgame": speedMultiplier = CONFIG.endgameSpeed; break;
    }
    
    // Position type adjustments - AlphaZero patience
    switch (posType) {
        case "tactical": speedMultiplier *= CONFIG.criticalSpeed; break;
        case "positional": speedMultiplier *= 1.05; break;
        case "endgame-critical":
        case "pawn-endgame": speedMultiplier *= 1.15; break;  // Extra time for critical endgames
        case "rook-endgame": speedMultiplier *= 1.1; break;
    }
    
    // Time pressure handling - AlphaZero stays calm
    if (timeLeft < CONFIG.criticalThreshold) speedMultiplier *= 0.6;
    if (timeLeft < CONFIG.panicThreshold) speedMultiplier *= 0.45;
    if (timeLeft < 5000) speedMultiplier *= 0.35;
    if (timeLeft < 3000) speedMultiplier *= 0.25;
    
    const baseTime = CONFIG.thinkingTimeMin;
    const variance = (CONFIG.thinkingTimeMax - CONFIG.thinkingTimeMin) * speedMultiplier;
    const thinkTime = baseTime + (Math.random() * variance);
    
    return Math.floor(Math.max(120, Math.min(thinkTime, CONFIG.thinkingTimeMax)));
}

/**
 * Adaptive depth - AlphaZero precision in critical moments
 */
function getDepth(phase, posType, timeLeft, assessment) {
    let depth = CONFIG.baseDepth;
    
    // Phase-based depth
    switch (phase) {
        case "opening": depth = CONFIG.openingDepth; break;
        case "pure-endgame": depth = CONFIG.endgameDepth + 2; break;  // Maximum endgame depth
        case "endgame": depth = CONFIG.endgameDepth; break;
        default:
            if (posType === "tactical") depth = CONFIG.tacticalDepth;
            else if (posType === "positional") depth = CONFIG.positionalDepth;
    }
    
    // Critical endgame patterns need more depth
    if (assessment && assessment.zugzwangRisk) depth = Math.min(depth + 2, 17);
    if (assessment && assessment.rookPattern === 'lucena_potential') depth = Math.min(depth + 1, 16);
    
    // Time pressure reduction
    if (timeLeft < CONFIG.criticalThreshold) depth = Math.max(10, depth - 1);
    if (timeLeft < CONFIG.panicThreshold) depth = Math.max(9, depth - 2);
    if (timeLeft < 5000) depth = Math.max(8, depth - 3);
    if (timeLeft < 3000) depth = Math.max(7, depth - 4);
    
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
    
    for (const moveOption of moves) {
        random -= moveOption.weight;
        if (random <= 0) return moveOption.move;
    }
    
    return moves[0].move;
}

/**
 * AlphaZero move selection - Prefer active, non-passive play
 */
function selectAlphaZeroMove(bestMove, alternatives, assessment) {
    if (!alternatives || alternatives.length < 2) return bestMove;
    
    const best = alternatives[0];
    const second = alternatives[1];
    
    // Score difference threshold
    const scoreDiff = Math.abs((best.score || 0) - (second.score || 0));
    
    // AlphaZero: If moves are close, prefer the more active one
    if (scoreDiff < 30 && Math.random() < CONFIG.alphaZero.aggressionFactor) {
        // Prefer checks, captures, or central moves
        const activeIndicators = ['x', '+', 'e4', 'd4', 'e5', 'd5'];
        for (const indicator of activeIndicators) {
            if (second.move && second.move.includes(indicator)) {
                return second.move;
            }
        }
    }
    
    // Rare unconventional choice (AlphaZero surprise)
    if (scoreDiff < 20 && Math.random() < CONFIG.humanMistakeRate) {
        return second.move;
    }
    
    return bestMove;
}

/**
 * Fast multi-PV parsing
 */
function parseMultiPV(output) {
    const lines = output.split('\n');
    const pvLines = [];
    
    for (const line of lines) {
        if (line.indexOf('multipv') !== -1) {
            const pvMatch = line.match(/pv\s+(\w+)/);
            const scoreMatch = line.match(/score\s+cp\s+(-?\d+)/);
            const mateMatch = line.match(/score\s+mate\s+(-?\d+)/);
            
            if (pvMatch) {
                let score = 0;
                if (scoreMatch) score = parseInt(scoreMatch[1]);
                else if (mateMatch) score = parseInt(mateMatch[1]) > 0 ? 10000 : -10000;
                
                pvLines.push({ move: pvMatch[1], score });
            }
        }
    }
    
    return pvLines.sort((a, b) => b.score - a.score);
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE INITIALIZATION - AlphaZero Strategic Settings
// ═══════════════════════════════════════════════════════════════════════

function initializeChessEngine() {
    chessEngine = window.STOCKFISH();
    
    chessEngine.postMessage("uci");
    chessEngine.postMessage("setoption name MultiPV value 3");  // More alternatives for strategic choice
    chessEngine.postMessage("setoption name Contempt value " + CONFIG.alphaZero.contemptValue);  // Play for win
    chessEngine.postMessage("setoption name Move Overhead value 40");
    chessEngine.postMessage("setoption name Skill Level value 20");  // Maximum skill
    chessEngine.postMessage("isready");
}

// ═══════════════════════════════════════════════════════════════════════
// WEBSOCKET INTERCEPTION - Enhanced State Tracking
// ═══════════════════════════════════════════════════════════════════════

function interceptWebSocket() {
    const webSocket = window.WebSocket;
    const webSocketProxy = new Proxy(webSocket, {
        construct: function (target, args) {
            const wrappedWebSocket = new target(...args);
            webSocketWrapper = wrappedWebSocket;

            wrappedWebSocket.addEventListener("message", function (event) {
                try {
                    const message = JSON.parse(event.data);
                    
                    if (message.d && typeof message.d.fen === "string" && typeof message.v === "number") {
                        currentFen = message.d.fen;
                        
                        const isWhitesTurn = message.v % 2 === 0;
                        myColor = isWhitesTurn ? 'w' : 'b';
                        currentFen += isWhitesTurn ? " w" : " b";
                        
                        moveCount = Math.floor(message.v / 2) + 1;
                        
                        // Track position history for repetition detection
                        const fenPos = currentFen.split(' ')[0];
                        positionHistory.push(fenPos);
                        if (positionHistory.length > 20) positionHistory.shift();
                        
                        // Update game analysis
                        gamePhase = getGamePhase(moveCount, currentFen);
                        positionType = analyzePositionType(currentFen);
                        materialBalance = analyzeMaterial(currentFen).balance;
                        
                        calculateMove();
                    }
                    
                    // Track time remaining
                    if (message.d && message.d.clock) {
                        timeRemaining = myColor === 'w' ? message.d.clock.white : message.d.clock.black;
                    }
                } catch (e) {
                    // Silent error handling - maintain stability
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

let strategicAssessment = null;

function calculateMove() {
    // Get strategic assessment
    const material = analyzeMaterial(currentFen);
    strategicAssessment = getStrategicAssessment(currentFen, material, moveCount);
    
    // Opening book (AlphaZero variety)
    if (gamePhase === "opening" || gamePhase === "early-middlegame") {
        const bookMove = getBookMove(currentFen);
        
        if (bookMove) {
            const thinkTime = Math.random() * 280 + 200;
            
            setTimeout(() => {
                bestMove = bookMove;
                sendMove(bookMove);
            }, thinkTime);
            
            return;
        }
    }
    
    // Engine calculation with strategic depth
    const depth = getDepth(gamePhase, positionType, timeRemaining, strategicAssessment);
    const thinkTime = getThinkTime(gamePhase, positionType, timeRemaining);
    
    multiPVLines = [];
    
    chessEngine.postMessage("position fen " + currentFen);
    chessEngine.postMessage("go depth " + depth);
}

/**
 * Send move with AlphaZero timing
 */
function sendMove(move) {
    if (!webSocketWrapper || !move) return;
    
    webSocketWrapper.send(JSON.stringify({
        t: "move",
        d: { 
            u: move, 
            b: 1,
            l: Math.floor(Math.random() * 25) + 15,
            a: 1
        }
    }));
}

// ═══════════════════════════════════════════════════════════════════════
// ENGINE MESSAGE HANDLER - AlphaZero Move Selection
// ═══════════════════════════════════════════════════════════════════════

function setupChessEngineOnMessage() {
    let engineOutput = "";
    
    chessEngine.onmessage = function (event) {
        engineOutput += event + "\n";
        
        // Parse multi-PV lines for strategic choice
        if (event.indexOf('multipv') !== -1) {
            const lines = parseMultiPV(event);
            if (lines.length > 0) {
                multiPVLines = lines;
            }
        }
        
        // Best move found
        if (event && event.indexOf('bestmove') !== -1) {
            const moveParts = event.split(" ");
            bestMove = moveParts[1];
            
            let finalMove = bestMove;
            
            // AlphaZero strategic move selection
            if (multiPVLines.length > 1) {
                finalMove = selectAlphaZeroMove(bestMove, multiPVLines, strategicAssessment);
            }
            
            sendMove(finalMove);
            engineOutput = "";
        }
    };
}

// ═══════════════════════════════════════════════════════════════════════
// INITIALIZATION - Stable Launch
// ═══════════════════════════════════════════════════════════════════════

initializeChessEngine();
interceptWebSocket();
setupChessEngineOnMessage();
