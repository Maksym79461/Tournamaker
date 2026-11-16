import { useEffect, useState } from 'react';
import axios from 'axios';

// 1. Data Interfaces
interface Tournament {
    id: string;
    name: string;
    game: string;
    maxTeams: number;
}
interface User {
    id: string;
    username: string;
    email: string;
}
interface Team {
    id: string;
    name: string;
    captainId: string;
}
interface Match {
    id: string;
    round: number;
    status: string;
    team1Name: string;
    team2Name: string;
    winnerName: string | null;
}

function App() {
    // 2. States
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Forms states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [tournamentName, setTournamentName] = useState('');
    const [game, setGame] = useState('CS2');
    const [maxTeams, setMaxTeams] = useState('8');
    const [teamName, setTeamName] = useState('');
    const [selectedTournamentId, setSelectedTournamentId] = useState('');

    // Bracket states
    const [activeBracketTournament, setActiveBracketTournament] = useState<Tournament | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);

    // 3. Data Fetching
    const fetchTournaments = () => {
        axios.get('http://localhost:5121/api/Tournaments').then(res => setTournaments(res.data));
    };
    const fetchTeams = () => {
        axios.get('http://localhost:5121/api/Teams').then(res => setTeams(res.data));
    };

    useEffect(() => {
        fetchTournaments();
        fetchTeams();
    }, []);

    // 4. Bracket Logic
    const loadBracket = (tournament: Tournament) => {
        setActiveBracketTournament(tournament);
        axios.get(`http://localhost:5121/api/Matches/tournament/${tournament.id}`)
            .then(res => setMatches(res.data))
            .catch(err => console.error("Error loading bracket:", err));
    };

    const generateBracket = () => {
        if (!activeBracketTournament) return;
        axios.post(`http://localhost:5121/api/Matches/generate/${activeBracketTournament.id}`)
            .then(() => {
                alert("Round 1 matches generated successfully!");
                loadBracket(activeBracketTournament); // Reload bracket view
            })
            .catch(err => alert(err.response?.data || "Error generating bracket"));
    };

    // 5. Form Handlers
    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:5121/api/Users', { username, email }).then(res => {
            setCurrentUser(res.data); setUsername(''); setEmail('');
        });
    };
    const handleCreateTournament = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:5121/api/Tournaments', {
            name: tournamentName, game, maxTeams: parseInt(maxTeams, 10), organizerId: currentUser?.id
        }).then(() => { fetchTournaments(); setTournamentName(''); });
    };
    const handleCreateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:5121/api/Teams', {
            name: teamName, captainId: currentUser?.id, tournamentId: selectedTournamentId
        }).then(() => { fetchTeams(); setTeamName(''); });
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans text-black">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Tournamaker: Milestone 3 (Bracket Generation)</h1>

            <div className="flex items-start gap-8">

                {/* COLUMN 1: Forms */}
                <div className="w-1/3 space-y-6">
                    <div className="rounded border-t-4 border-blue-500 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 font-bold">1. Create User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-2">
                            <input type="text" placeholder="Username" required className="w-full border p-2" value={username} onChange={e => setUsername(e.target.value)} />
                            <input type="email" placeholder="Email" required className="w-full border p-2" value={email} onChange={e => setEmail(e.target.value)} />
                            <button type="submit" className="w-full rounded bg-blue-600 px-4 py-2 text-white">Create</button>
                        </form>
                        {currentUser && <p className="mt-2 text-sm font-bold text-green-600">Active: {currentUser.username}</p>}
                    </div>

                    <div className="rounded border-t-4 border-green-500 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 font-bold">2. Create Tournament</h2>
                        <form onSubmit={handleCreateTournament} className="space-y-2">
                            <input type="text" placeholder="Name" required className="w-full border p-2" value={tournamentName} onChange={e => setTournamentName(e.target.value)} />
                            <button type="submit" disabled={!currentUser} className="w-full rounded bg-green-600 px-4 py-2 text-white disabled:bg-gray-400">Create</button>
                        </form>
                    </div>

                    <div className="rounded border-t-4 border-purple-500 bg-white p-4 shadow-sm">
                        <h2 className="mb-2 font-bold">3. Create Team</h2>
                        <form onSubmit={handleCreateTeam} className="space-y-2">
                            <input type="text" placeholder="Team Name" required className="w-full border p-2" value={teamName} onChange={e => setTeamName(e.target.value)} />
                            <select className="w-full border p-2" value={selectedTournamentId} onChange={e => setSelectedTournamentId(e.target.value)} required>
                                <option value="">Assign to Tournament...</option>
                                {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <button type="submit" disabled={!currentUser} className="w-full rounded bg-purple-600 px-4 py-2 text-white disabled:bg-gray-400">Create</button>
                        </form>
                    </div>
                </div>

                {/* COLUMN 2: Tournaments & Teams List */}
                <div className="w-1/3 rounded bg-white p-4 shadow-sm">
                    <h2 className="mb-4 border-b pb-2 font-bold">Tournaments in DB</h2>
                    <ul className="mb-6 space-y-3">
                        {tournaments.map(t => (
                            <li key={t.id} className="flex items-center justify-between rounded border p-3 hover:bg-gray-50">
                                <div><strong>{t.name}</strong><br /><span className="text-xs text-gray-500">Teams capacity: {t.maxTeams}</span></div>
                                <button onClick={() => loadBracket(t)} className="bg-gray-800 text-white text-sm px-3 py-1 rounded">Open</button>
                            </li>
                        ))}
                    </ul>

                    <h2 className="mb-4 border-b pb-2 font-bold">Teams in DB</h2>
                    <ul className="space-y-1 text-sm">
                        {teams.map(t => <li key={t.id}>🛡 {t.name}</li>)}
                    </ul>
                </div>

                {/* COLUMN 3: Match Bracket Viewer */}
                <div className="min-h-[500px] w-1/3 rounded border-2 border-dashed border-gray-300 bg-white p-4 shadow-sm">
                    {activeBracketTournament ? (
                        <div>
                            <h2 className="mb-2 text-xl font-bold text-indigo-700">{activeBracketTournament.name} Bracket</h2>

                            {matches.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p className="mb-4 text-gray-500">No matches found for this tournament.</p>
                                    <button onClick={generateBracket} className="rounded bg-indigo-600 px-4 py-2 font-bold text-white shadow hover:bg-indigo-700">
                                        🎲 Generate Round 1 Matches
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-4">
                                    {matches.map((m, index) => (
                                        <div key={m.id} className="rounded border border-indigo-200 bg-indigo-50 p-3">
                                            <div className="mb-2 text-xs font-bold uppercase text-indigo-400">Match {index + 1} (Round {m.round})</div>
                                            <div className="flex items-center justify-between rounded bg-white p-2 shadow-sm">
                                                <span className="font-semibold">{m.team1Name}</span>
                                                <span className="px-2 text-xs text-gray-400">VS</span>
                                                <span className="font-semibold">{m.team2Name}</span>
                                            </div>
                                            <div className="mt-2 text-center text-xs text-gray-500">Status: {m.status}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-20 text-center text-gray-400">
                            <p>Select "Open" on a tournament to view its bracket.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default App;