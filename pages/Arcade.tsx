import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2, Zap, Shield, Bug, Loader2, AlertTriangle,
    Keyboard, Activity, X, Database, Wifi, Cpu, Lock, Server, Code, MousePointer2, Skull, Trophy, ArrowLeft
} from 'lucide-react';
import { API_BASE } from '../context/AuthContext';
import { Link } from 'react-router-dom';
// import { io } from 'socket.io-client'; // Removed to prevent build error

// --- SHARED TYPES ---
type GameState = 'lobby' | 'waiting' | 'playing' | 'result';
type MenuState = 'menu' | 'rps' | 'typing' | 'memory' | 'glitch';

const SOCKET_URL = API_BASE || window.location.origin;

// -----------------------------------------------------------------------------
// LEADERBOARD COMPONENT
// -----------------------------------------------------------------------------
interface LeaderboardEntry {
    id: number;
    player_name: string;
    score: number;
    date: string;
}

const LeaderboardModal: React.FC<{
    gameId: string;
    isOpen: boolean;
    onClose: () => void;
    currentScore?: number | null;
}> = ({ gameId, isOpen, onClose, currentScore }) => {
    const [scores, setScores] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen) fetchScores();
    }, [isOpen, gameId]);

    const fetchScores = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/leaderboard/${gameId}`);
            if (res.ok) {
                setScores(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const submitScore = async () => {
        if (!name.trim() || currentScore === null || currentScore === undefined) return;
        setSubmitting(true);
        try {
            await fetch(`${API_BASE}/api/leaderboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameId, playerName: name, score: currentScore })
            });
            setSubmitted(true);
            fetchScores(); // Refresh
        } catch (e) {
            alert("Failed to submit score");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                        className="relative bg-[#111] border border-white/20 rounded-2xl w-full max-w-md p-6 shadow-2xl z-10"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Trophy className="text-yellow-400" /> Leaderboard
                            </h3>
                            <button onClick={onClose}><X size={20} className="text-neutral-500 hover:text-white" /></button>
                        </div>

                        {/* Score Submission Form */}
                        {currentScore !== null && currentScore !== undefined && !submitted && (
                            <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-sm text-neutral-400 mb-2 font-mono uppercase text-center">Your Score</p>
                                <p className="text-4xl font-bold text-center text-white mb-4">{currentScore}</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter Name"
                                        maxLength={10}
                                        className="flex-1 bg-black border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-center uppercase"
                                    />
                                    <button
                                        onClick={submitScore}
                                        disabled={submitting || !name}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500 disabled:opacity-50"
                                    >
                                        {submitting ? <Loader2 size={16} className="animate-spin" /> : "Submit"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* List */}
                        <div className="h-64 overflow-y-auto custom-scrollbar space-y-2">
                            {loading ? (
                                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-neutral-500" /></div>
                            ) : scores.length === 0 ? (
                                <div className="text-center py-8 text-neutral-600 font-mono text-sm">No records yet. Be the first.</div>
                            ) : (
                                scores.map((s, idx) => (
                                    <div key={s.id} className={`flex justify-between items-center p-3 rounded-lg ${idx === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : idx === 1 ? 'bg-neutral-300/10 border border-neutral-300/30' : idx === 2 ? 'bg-orange-700/10 border border-orange-700/30' : 'bg-white/5 border border-white/5'}`}>
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full ${idx < 3 ? 'bg-white text-black' : 'text-neutral-500 bg-black'}`}>{idx + 1}</span>
                                            <span className="font-bold text-white uppercase">{s.player_name}</span>
                                        </div>
                                        <span className="font-mono text-blue-400 font-bold">{s.score}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// =============================================================================
// GAME 1: NEURAL CLASH (RPS)
// =============================================================================
type RPSMove = 'OVERLOAD' | 'FIREWALL' | 'VIRUS';
interface Challenge { id: string; creatorName: string; }
interface RPSPlayer { id: string; name: string; score: number; }

const NeuralClash: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [socket, setSocket] = useState<any>(null);
    const [gameState, setGameState] = useState<GameState>('lobby');
    const [playerName, setPlayerName] = useState('');
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [players, setPlayers] = useState<RPSPlayer[]>([]);
    const [roundResult, setRoundResult] = useState<{ moves: any, result: string | null } | null>(null);
    const [hasMoved, setHasMoved] = useState(false);
    const [gameMessage, setGameMessage] = useState('');
    const [isSinglePlayer, setIsSinglePlayer] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useEffect(() => {
        try {
            // Use global IO from CDN to avoid build errors
            const io = (window as any).io;
            if (!io) {
                console.warn("Socket.io CDN not loaded");
                return;
            }

            const newSocket = io(SOCKET_URL);
            setSocket(newSocket);
            newSocket.on('update_challenges', (data: Challenge[]) => setChallenges(data));
            newSocket.on('game_created', (id: string) => { setRoomId(id); setGameState('waiting'); });
            newSocket.on('game_start', (data: { players: RPSPlayer[], roomId: string }) => {
                setIsSinglePlayer(false); setPlayers(data.players); setRoomId(data.roomId);
                setGameState('playing'); setRoundResult(null); setHasMoved(false);
                setGameMessage('Battle Protocol Initiated!');
            });
            newSocket.on('round_result', (data: any) => {
                setRoundResult(data);
                setPlayers(prev => prev.map(p => ({ ...p, score: data.scores[p.id] })));
                setGameState('result');
                const myId = newSocket.id;
                const result = data.result;
                if (result === 'draw') setGameMessage('System Status: STALEMATE');
                else if (result === myId) setGameMessage('System Status: VICTORY');
                else setGameMessage('System Status: BREACH DETECTED (DEFEAT)');
                setTimeout(() => {
                    setGameState('playing'); setRoundResult(null); setHasMoved(false);
                    setGameMessage('Prepare for Next Cycle...');
                }, 3000);
            });
            newSocket.on('player_left', () => { alert("Opponent disconnected."); setGameState('lobby'); setRoomId(null); setPlayers([]); });
            return () => { newSocket.disconnect(); };
        } catch(e) {
            console.warn("Socket.io client failed to connect.");
        }
    }, []);

    const createChallenge = () => { if (!playerName.trim()) return alert("Enter codename first."); socket?.emit('create_challenge', playerName); };
    const joinChallenge = (id: string) => { if (!playerName.trim()) return alert("Enter codename first."); socket?.emit('join_challenge', { roomId: id, playerName }); };
    const startSinglePlayer = () => {
        if (!playerName.trim()) return alert("Enter codename first.");
        setIsSinglePlayer(true); setRoomId('local_cpu');
        setPlayers([{ id: 'me', name: playerName, score: 0 }, { id: 'cpu', name: 'SYSTEM_CPU_V9', score: 0 }]);
        setGameState('playing'); setRoundResult(null); setHasMoved(false); setGameMessage('Training Simulation Initialized.');
    };
    const makeMove = (move: RPSMove) => {
        if (hasMoved) return;
        setHasMoved(true);
        if (isSinglePlayer) {
            setGameMessage('Processing Move...');
            setTimeout(() => {
                const moves: RPSMove[] = ['OVERLOAD', 'FIREWALL', 'VIRUS'];
                const cpuMove = moves[Math.floor(Math.random() * 3)];
                let result = null;
                if (move === cpuMove) result = 'draw';
                else if ((move === 'OVERLOAD' && cpuMove === 'VIRUS') || (move === 'FIREWALL' && cpuMove === 'OVERLOAD') || (move === 'VIRUS' && cpuMove === 'FIREWALL')) result = 'me';
                else result = 'cpu';
                const newPlayers = players.map(p => { if (p.id === result) return { ...p, score: p.score + 1 }; return p; });
                setPlayers(newPlayers);
                setRoundResult({ moves: { me: move, cpu: cpuMove }, result: result === 'me' ? 'me' : result === 'cpu' ? 'cpu' : 'draw' });
                setGameState('result');
                if (result === 'draw') setGameMessage('Simulation Result: DRAW');
                else if (result === 'me') setGameMessage('Simulation Result: VICTORY');
                else setGameMessage('Simulation Result: DEFEAT');
                setTimeout(() => { setGameState('playing'); setRoundResult(null); setHasMoved(false); setGameMessage('Select next vector...'); }, 2500);
            }, 800);
        } else {
            socket?.emit('make_move', { roomId, move });
            setGameMessage('Command Sent. Awaiting Opponent...');
        }
    };
    const myPlayer = isSinglePlayer ? players[0] : players.find(p => p.id === socket?.id);
    const opponent = isSinglePlayer ? players[1] : players.find(p => p.id !== socket?.id);
    const myMoveKey = isSinglePlayer ? 'me' : socket?.id;
    const oppMoveKey = isSinglePlayer ? 'cpu' : opponent?.id;

    return (
        <div className="w-full max-w-5xl mx-auto relative">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Gamepad2 className="text-red-500" /> Neural Clash</h2>
                <div className="flex gap-4">
                    <button onClick={() => setShowLeaderboard(true)} className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"><Trophy size={16} /> Rank</button>
                    <button onClick={onExit} className="text-sm text-neutral-500 hover:text-white flex items-center gap-1"><X size={16} /> Exit Game</button>
                </div>
            </div>

            <LeaderboardModal
                gameId="rps"
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                currentScore={myPlayer?.score}
            />

            {gameState === 'lobby' && (
                <div className="grid lg:grid-cols-2 gap-12">
                    <div className="bg-[#111] border border-white/10 p-8 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-6">Identity Config</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="ENTER CODENAME" value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={12} className="w-full bg-black border border-white/20 rounded-xl px-4 py-4 text-white text-center font-bold tracking-widest focus:outline-none focus:border-red-500 uppercase" />
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={createChallenge} disabled={!playerName} className="py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-500 disabled:opacity-50">PvP LOBBY</button>
                                <button onClick={startSinglePlayer} disabled={!playerName} className="py-4 bg-neutral-800 text-white rounded-xl font-bold hover:bg-neutral-700 disabled:opacity-50">CPU TRAIN</button>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 h-[500px] flex flex-col">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-yellow-500"/> Active Signals ({challenges.length})</h3>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {challenges.map((c) => (
                                <div key={c.id} className="flex justify-between p-4 bg-white/5 border border-white/10 rounded-xl items-center">
                                    <span className="text-white font-mono text-sm">{c.creatorName}</span>
                                    <button onClick={() => joinChallenge(c.id)} className="px-3 py-1 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded text-xs font-bold">ENGAGE</button>
                                </div>
                            ))}
                            {challenges.length === 0 && <p className="text-neutral-600 text-center mt-10 text-sm font-mono">SCANNING...</p>}
                        </div>
                    </div>
                </div>
            )}
            {gameState === 'waiting' && <div className="text-center py-20"><Loader2 size={48} className="animate-spin text-red-500 mx-auto mb-4" /><h3 className="text-xl text-white font-bold">Broadcasting Signal...</h3></div>}
            {(gameState === 'playing' || gameState === 'result') && (
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                        <div className="text-center"><p className="text-blue-400 font-bold text-xl">{myPlayer?.name}</p><p className="text-3xl font-black text-white">{myPlayer?.score}</p></div>
                        <div className="text-center text-red-500 font-mono font-bold text-xl">VS</div>
                        <div className="text-center"><p className="text-red-400 font-bold text-xl">{opponent?.name}</p><p className="text-3xl font-black text-white">{opponent?.score}</p></div>
                    </div>
                    <div className="bg-[#050505] border border-neutral-800 rounded-3xl p-8 min-h-[350px] flex flex-col items-center justify-center relative">
                        <p className="text-neutral-400 font-mono mb-8 animate-pulse text-sm">{gameMessage}</p>
                        {gameState === 'result' ? (
                            <div className="flex gap-16 items-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-xl border border-white/20 flex items-center justify-center bg-white/5 mb-2">
                                        {roundResult?.moves[myMoveKey || ''] === 'OVERLOAD' && <Zap size={40} className="text-orange-500" />}
                                        {roundResult?.moves[myMoveKey || ''] === 'FIREWALL' && <Shield size={40} className="text-blue-500" />}
                                        {roundResult?.moves[myMoveKey || ''] === 'VIRUS' && <Bug size={40} className="text-red-500" />}
                                    </div>
                                    <p className="text-xs text-neutral-500">YOU</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-xl border border-white/20 flex items-center justify-center bg-white/5 mb-2">
                                        {roundResult?.moves[oppMoveKey || ''] === 'OVERLOAD' && <Zap size={40} className="text-orange-500" />}
                                        {roundResult?.moves[oppMoveKey || ''] === 'FIREWALL' && <Shield size={40} className="text-blue-500" />}
                                        {roundResult?.moves[oppMoveKey || ''] === 'VIRUS' && <Bug size={40} className="text-red-500" />}
                                    </div>
                                    <p className="text-xs text-neutral-500">ENEMY</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                                {['OVERLOAD', 'FIREWALL', 'VIRUS'].map((m) => (
                                    <button key={m} onClick={() => makeMove(m as RPSMove)} disabled={hasMoved} className={`p-4 rounded-xl border border-white/10 flex flex-col items-center gap-2 hover:bg-white/5 transition-all ${hasMoved ? 'opacity-30' : ''}`}>
                                        {m === 'OVERLOAD' && <Zap className="text-orange-500" />}
                                        {m === 'FIREWALL' && <Shield className="text-blue-500" />}
                                        {m === 'VIRUS' && <Bug className="text-red-500" />}
                                        <span className="text-xs font-bold text-white">{m}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// =============================================================================
// GAME 2: QUANTUM STREAM (TYPING)
// =============================================================================
interface FallingWord { id: number; text: string; x: number; y: number; speed: number; }
const WORD_LIST = ["REACT", "NODE", "DOCKER", "GEMINI", "KUBERNETES", "TYPESCRIPT", "EVENT", "STREAM", "PRISMA", "NEXTJS", "TAILWIND", "DEPLOY", "BUILD", "COMMIT", "PUSH", "MERGE", "SERVER", "CLIENT", "SOCKET", "API", "JSON", "ASYNC", "AWAIT", "PROMISE", "HOOK"];

const QuantumStream: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(5);
    const [words, setWords] = useState<FallingWord[]>([]);
    const [input, setInput] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const requestRef = useRef<number>(0);
    const lastSpawnTime = useRef<number>(0);
    const spawnRate = useRef<number>(2000);

    const spawnWord = useCallback(() => {
        const text = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
        setWords(prev => [...prev, { id: Date.now() + Math.random(), text, x: Math.random() * 80 + 10, y: -10, speed: 0.1 + (Math.random() * 0.1) + (score * 0.005) }]);
    }, [score]);

    const gameLoop = useCallback((time: number) => {
        if (!lastSpawnTime.current) lastSpawnTime.current = time;
        if (time - lastSpawnTime.current > Math.max(500, spawnRate.current - (score * 50))) { spawnWord(); lastSpawnTime.current = time; }
        setWords(prevWords => {
            const nextWords: FallingWord[] = [];
            let damage = 0;
            prevWords.forEach(word => {
                const nextY = word.y + word.speed;
                if (nextY > 100) damage++; else nextWords.push({ ...word, y: nextY });
            });
            if (damage > 0) setLives(prev => {
                const newLives = prev - damage;
                if (newLives <= 0) { setGameOver(true); setIsPlaying(false); }
                return newLives;
            });
            return nextWords;
        });
        if (lives > 0) requestRef.current = requestAnimationFrame((t) => gameLoop(t));
    }, [lives, score, spawnWord]);

    useEffect(() => {
        if (isPlaying && !gameOver) requestRef.current = requestAnimationFrame((t) => gameLoop(t));
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
    }, [isPlaying, gameOver, gameLoop]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toUpperCase();
        setInput(val);
        const matchIndex = words.findIndex(w => w.text === val);
        if (matchIndex !== -1) { setWords(prev => prev.filter((_, i) => i !== matchIndex)); setScore(prev => prev + 10); setInput(''); }
    };

    const startGame = () => { setScore(0); setLives(5); setWords([]); setGameOver(false); setIsPlaying(true); setInput(''); lastSpawnTime.current = 0; };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Keyboard className="text-cyan-400" /> Quantum Stream</h2>
                <div className="flex gap-4">
                    <button onClick={() => setShowLeaderboard(true)} className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"><Trophy size={16} /> Rank</button>
                    <button onClick={onExit} className="text-sm text-neutral-500 hover:text-white flex items-center gap-1"><X size={16} /> Exit Game</button>
                </div>
            </div>

            <LeaderboardModal gameId="typing" isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} currentScore={gameOver ? score : null} />

            <div className="relative bg-[#050505] border border-neutral-800 rounded-3xl h-[600px] overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
                    <div className="bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded-xl"><p className="text-xs text-neutral-500 font-mono uppercase">System Integrity</p><div className="flex gap-1 mt-1">{Array.from({length: 5}).map((_, i) => (<div key={i} className={`w-8 h-2 rounded-full ${i < lives ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-neutral-800'}`} />))}</div></div>
                    <div className="bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded-xl text-right"><p className="text-xs text-neutral-500 font-mono uppercase">Data Processed</p><p className="text-2xl font-bold text-white font-mono">{score}</p></div>
                </div>
                {!isPlaying && !gameOver && (<div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/60 backdrop-blur-sm"><Activity size={48} className="text-cyan-400 mb-4 animate-pulse" /><h1 className="text-4xl font-bold text-white mb-2">QUANTUM STREAM</h1><p className="text-neutral-400 mb-8 max-w-md text-center">Data breach imminent. Type the falling keywords to process the stream.</p><button onClick={startGame} className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all scale-110">INITIALIZE DEFENSE</button></div>)}
                {gameOver && (<div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-red-900/20 backdrop-blur-md"><AlertTriangle size={48} className="text-red-500 mb-4" /><h1 className="text-4xl font-bold text-white mb-2">SYSTEM FAILURE</h1><p className="text-neutral-300 mb-2">Final Score: <span className="text-cyan-400 font-bold">{score}</span></p><button onClick={startGame} className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition-all">REBOOT SYSTEM</button></div>)}
                <AnimatePresence>{words.map(word => (<motion.div key={word.id} initial={{ y: -20, opacity: 0 }} animate={{ y: `${word.y}%`, opacity: 1 }} className="absolute text-cyan-400 font-mono font-bold text-sm md:text-base tracking-wider drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" style={{ left: `${word.x}%` }}>{word.text}</motion.div>))}</AnimatePresence>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md z-30"><input type="text" autoFocus value={input} onChange={handleInput} disabled={!isPlaying} placeholder={isPlaying ? "TYPE COMMAND..." : ""} className="w-full bg-black/80 border border-cyan-500/50 rounded-full py-4 px-8 text-center text-xl text-white font-mono uppercase tracking-widest focus:outline-none focus:shadow-[0_0_30px_rgba(6,182,212,0.3)] placeholder-neutral-700" /></div>
            </div>
        </div>
    );
};

// =============================================================================
// GAME 3: MEMORY LEAK (CARD MATCHING)
// =============================================================================
interface CardItem { id: number; iconId: number; isFlipped: boolean; isMatched: boolean; }
const ICONS = [Cpu, Database, Wifi, Lock, Server, Code, Bug, Zap];

const MemoryLeak: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [cards, setCards] = useState<CardItem[]>([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState<CardItem | null>(null);
    const [choiceTwo, setChoiceTwo] = useState<CardItem | null>(null);
    const [disabled, setDisabled] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const shuffleCards = () => {
        const shuffledCards = [...ICONS, ...ICONS]
            .sort(() => Math.random() - 0.5)
            .map((icon, idx) => ({ id: idx, iconId: ICONS.indexOf(icon), isFlipped: false, isMatched: false }));
        setChoiceOne(null); setChoiceTwo(null); setCards(shuffledCards); setTurns(0); setGameWon(false); setDisabled(false);
    };

    useEffect(() => { shuffleCards(); }, []);

    const handleChoice = (card: CardItem) => {
        if (choiceOne) setChoiceTwo(card); else setChoiceOne(card);
    };

    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);
            if (cards[choiceOne.id].iconId === cards[choiceTwo.id].iconId) {
                setCards(prev => prev.map(c => c.iconId === choiceOne.iconId ? { ...c, isMatched: true } : c));
                resetTurn();
            } else {
                setTimeout(() => resetTurn(), 1000);
            }
        }
    }, [choiceOne, choiceTwo]);

    const resetTurn = () => { setChoiceOne(null); setChoiceTwo(null); setTurns(prev => prev + 1); setDisabled(false); };

    useEffect(() => { if (cards.length > 0 && cards.every(c => c.isMatched)) setGameWon(true); }, [cards]);

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Database className="text-green-500" /> Memory Leak</h2>
                <div className="flex gap-4">
                    <button onClick={() => setShowLeaderboard(true)} className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"><Trophy size={16} /> Rank</button>
                    <button onClick={onExit} className="text-sm text-neutral-500 hover:text-white flex items-center gap-1"><X size={16} /> Exit Game</button>
                </div>
            </div>

            {/* Since Memory uses LOWEST turns as best score, we pass 100 - turns or similar for "Score", but simplified logic here */}
            <LeaderboardModal gameId="memory" isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} currentScore={gameWon ? Math.max(100 - turns, 0) : null} />

            <div className="relative bg-[#050505] border border-neutral-800 rounded-3xl p-8 min-h-[600px] flex flex-col items-center">
                <div className="flex justify-between w-full mb-6 text-neutral-400 font-mono text-sm">
                    <span>Attempt Cycles: {turns}</span>
                    <button onClick={shuffleCards} className="flex items-center gap-2 hover:text-white"><Zap size={14}/> Reboot System</button>
                </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-md">
                    {cards.map(card => {
                        const IconComp = ICONS[cards[card.id].iconId];
                        const flipped = card === choiceOne || card === choiceTwo || card.isMatched;
                        return (
                            <div key={card.id} className="relative aspect-square perspective-1000 cursor-pointer" onClick={() => !disabled && !flipped && handleChoice(card)}>
                                <motion.div
                                    initial={false} animate={{ rotateY: flipped ? 180 : 0 }}
                                    transition={{ duration: 0.6 }}
                                    className="w-full h-full preserve-3d relative"
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Front (Hidden) */}
                                    <div className="absolute inset-0 bg-neutral-900 border border-green-500/30 rounded-xl flex items-center justify-center backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                                        <div className="text-green-900/40 text-xs font-mono font-bold">404</div>
                                    </div>
                                    {/* Back (Revealed) */}
                                    <div className="absolute inset-0 bg-green-500/10 border border-green-400 rounded-xl flex items-center justify-center backface-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                        <IconComp size={32} className="text-green-400" />
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
                {gameWon && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-20">
                        <h3 className="text-4xl font-bold text-white mb-2">MEMORY RESTORED</h3>
                        <p className="text-green-400 font-mono mb-6">Cycles Used: {turns}</p>
                        <button onClick={shuffleCards} className="px-8 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400">RUN DIAGNOSTICS AGAIN</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// =============================================================================
// GAME 4: GLITCH HUNTER (REACTION)
// =============================================================================
const GlitchHunter: React.FC<{ onExit: () => void }> = ({ onExit }) => {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    useEffect(() => {
        let timer: any;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timeLeft === 0) {
            setIsPlaying(false);
            setGameFinished(true);
            setActiveIdx(null);
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);

    const moveGlitch = useCallback(() => {
        const newIdx = Math.floor(Math.random() * 16);
        setActiveIdx(newIdx);
    }, []);

    const handleClick = (idx: number) => {
        if (!isPlaying) return;
        if (idx === activeIdx) {
            setScore(prev => prev + 100);
            moveGlitch();
        } else {
            setScore(prev => Math.max(0, prev - 50));
        }
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setIsPlaying(true);
        setGameFinished(false);
        moveGlitch();
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><MousePointer2 className="text-purple-400" /> Glitch Hunter</h2>
                <div className="flex gap-4">
                    <button onClick={() => setShowLeaderboard(true)} className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1"><Trophy size={16} /> Rank</button>
                    <button onClick={onExit} className="text-sm text-neutral-500 hover:text-white flex items-center gap-1"><X size={16} /> Exit Game</button>
                </div>
            </div>

            <LeaderboardModal gameId="glitch" isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} currentScore={gameFinished ? score : null} />

            <div className="relative bg-[#050505] border border-neutral-800 rounded-3xl p-8 min-h-[600px] flex flex-col items-center justify-center">
                {/* HUD */}
                <div className="absolute top-6 left-6 right-6 flex justify-between font-mono text-lg font-bold z-10">
                    <div className="text-purple-400">SCORE: {score}</div>
                    <div className={`${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>TIME: {timeLeft}s</div>
                </div>

                {!isPlaying && !gameFinished && (
                    <div className="text-center z-20">
                        <Skull size={64} className="text-purple-500 mx-auto mb-4 opacity-50" />
                        <h1 className="text-4xl font-bold text-white mb-4">PURGE THE GLITCHES</h1>
                        <p className="text-neutral-400 mb-8">Click the bugs before they corrupt the system.</p>
                        <button onClick={startGame} className="px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-all scale-105">START PURGE</button>
                    </div>
                )}

                {gameFinished && (
                    <div className="text-center z-20">
                        <h1 className="text-4xl font-bold text-white mb-4">SYSTEM SECURE</h1>
                        <p className="text-2xl text-purple-400 font-mono mb-8">FINAL SCORE: {score}</p>
                        <button onClick={startGame} className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all">PLAY AGAIN</button>
                    </div>
                )}

                {/* Grid */}
                {isPlaying && (
                    <div className="grid grid-cols-4 gap-4 w-full max-w-md z-10">
                        {Array.from({length: 16}).map((_, idx) => (
                            <button
                                key={idx}
                                onMouseDown={() => handleClick(idx)}
                                className={`aspect-square rounded-xl border border-white/5 transition-all relative overflow-hidden ${idx === activeIdx ? 'bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.6)] scale-95' : 'bg-black/40 hover:bg-white/5'}`}
                            >
                                {idx === activeIdx && (
                                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                                        <Bug className="text-white" size={32} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// =============================================================================
// MAIN ARCADE COMPONENT
// =============================================================================
const Arcade: React.FC = () => {
    const [currentGame, setCurrentGame] = useState<MenuState>('menu');

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 relative z-40 overflow-hidden">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900/50 via-black to-black -z-10" />

            <AnimatePresence mode='wait'>
                {currentGame === 'menu' && (
                    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, scale:0.95}} className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                                <Gamepad2 size={14} className="text-red-400" />
                                <span className="text-xs font-mono uppercase tracking-widest text-red-300">System Arcade</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                                Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Playground</span>.
                            </h1>
                            <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed">
                                Test your reflexes, logic, and coding speed in these system-level mini-games.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Card 1: Neural Clash */}
                            <div onClick={() => setCurrentGame('rps')} className="group relative bg-[#111] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-red-500/50 transition-all overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-red-900/30 rounded-xl flex items-center justify-center mb-4 text-red-400 group-hover:scale-110 transition-transform"><Gamepad2 /></div>
                                    <h3 className="text-xl font-bold text-white mb-2">Neural Clash</h3>
                                    <p className="text-sm text-neutral-400">Rock-Paper-Scissors with a cyberpunk twist. Multiplayer enabled.</p>
                                </div>
                            </div>

                            {/* Card 2: Quantum Stream */}
                            <div onClick={() => setCurrentGame('typing')} className="group relative bg-[#111] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-cyan-500/50 transition-all overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-cyan-900/30 rounded-xl flex items-center justify-center mb-4 text-cyan-400 group-hover:scale-110 transition-transform"><Keyboard /></div>
                                    <h3 className="text-xl font-bold text-white mb-2">Quantum Stream</h3>
                                    <p className="text-sm text-neutral-400">High-speed typing defense. Process the data before overflow.</p>
                                </div>
                            </div>

                            {/* Card 3: Memory Leak */}
                            <div onClick={() => setCurrentGame('memory')} className="group relative bg-[#111] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-green-500/50 transition-all overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center mb-4 text-green-400 group-hover:scale-110 transition-transform"><Database /></div>
                                    <h3 className="text-xl font-bold text-white mb-2">Memory Leak</h3>
                                    <p className="text-sm text-neutral-400">Restore system integrity by matching corrupted data blocks.</p>
                                </div>
                            </div>

                            {/* Card 4: Glitch Hunter */}
                            <div onClick={() => setCurrentGame('glitch')} className="group relative bg-[#111] border border-white/10 rounded-3xl p-6 cursor-pointer hover:border-purple-500/50 transition-all overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform"><MousePointer2 /></div>
                                    <h3 className="text-xl font-bold text-white mb-2">Glitch Hunter</h3>
                                    <p className="text-sm text-neutral-400">Reflex test. Purge the system bugs before time runs out.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <Link to="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors">
                                <ArrowLeft size={16} /> Return to Base
                            </Link>
                        </div>
                    </motion.div>
                )}

                {currentGame !== 'menu' && (
                    <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.95}}>
                        {currentGame === 'rps' && <NeuralClash onExit={() => setCurrentGame('menu')} />}
                        {currentGame === 'typing' && <QuantumStream onExit={() => setCurrentGame('menu')} />}
                        {currentGame === 'memory' && <MemoryLeak onExit={() => setCurrentGame('menu')} />}
                        {currentGame === 'glitch' && <GlitchHunter onExit={() => setCurrentGame('menu')} />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Arcade;