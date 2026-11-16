import { useEffect, useState } from 'react';
import axios from 'axios';

// 1. Define data types (TypeScript)
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

function App() {
    // 2. Application state
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // User form state
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    // Tournament form state
    const [tournamentName, setTournamentName] = useState('');
    const [game, setGame] = useState('CS2');
    const [maxTeams, setMaxTeams] = useState('8'); // Змінено на рядок, щоб уникнути нуля

    // 3. Fetch tournaments function (GET)
    const fetchTournaments = () => {
        axios.get('http://localhost:5121/api/Tournaments')
            .then(res => setTournaments(res.data))
            .catch(err => console.error("Error fetching tournaments:", err));
    };

    useEffect(() => {
        fetchTournaments();
    }, []);

    // 4. Create user function (POST)
    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault();
        axios.post('http://localhost:5121/api/Users', { username, email })
            .then(res => {
                setCurrentUser(res.data);
                setUsername('');
                setEmail('');
                alert(`Organizer [${res.data.username}] successfully created!`);
            })
            .catch(err => {
                console.error("Error creating user:", err);
                alert("Failed to create user. Is the backend running?");
            });
    };

    // 5. Create tournament function (POST)
    const handleCreateTournament = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            alert("Error: Please create a tournament organizer in the panel above first!");
            return;
        }

        axios.post('http://localhost:5121/api/Tournaments', {
            name: tournamentName,
            game,
            maxTeams: parseInt(maxTeams, 10), // Перетворення рядка в число перед відправкою
            organizerId: currentUser.id
        })
            .then(() => {
                alert("Tournament created successfully!");
                setTournamentName('');
                setMaxTeams('8'); // Скидання до стандартного значення
                fetchTournaments();
            })
            .catch(err => console.error("Error creating tournament:", err));
    };

    // 6. UI Wireframe
    return (
        <div className="min-h-screen bg-white p-8 font-sans text-black">
            <h1 className="mb-6 text-3xl font-bold">Tournamaker: Functional Test</h1>

            <div className="flex gap-8">
                <div className="w-1/2 space-y-8">

                    <div className="rounded border bg-gray-50 p-4 shadow-sm">
                        <h2 className="mb-4 text-xl font-bold">1. Create Organizer</h2>
                        <form onSubmit={handleCreateUser} className="space-y-3">
                            <input
                                type="text" placeholder="Username" required
                                className="w-full border bg-white p-2"
                                value={username} onChange={e => setUsername(e.target.value)}
                            />
                            <input
                                type="email" placeholder="Email" required
                                className="w-full border bg-white p-2"
                                value={email} onChange={e => setEmail(e.target.value)}
                            />
                            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                                Create User
                            </button>
                        </form>
                        {currentUser && (
                            <div className="mt-4 rounded border border-green-200 bg-green-50 p-2 font-bold text-green-600">
                                Active Organizer: {currentUser.username} (Ready to create tournaments)
                            </div>
                        )}
                    </div>

                    <div className="rounded border bg-gray-50 p-4 shadow-sm">
                        <h2 className="mb-4 text-xl font-bold">2. Create Tournament</h2>
                        <form onSubmit={handleCreateTournament} className="space-y-3">
                            <input
                                type="text" placeholder="Tournament Name" required
                                className="w-full border bg-white p-2"
                                value={tournamentName} onChange={e => setTournamentName(e.target.value)}
                            />
                            <select
                                className="w-full border bg-white p-2"
                                value={game} onChange={e => setGame(e.target.value)}
                            >
                                <option value="CS2">CS2</option>
                                <option value="Dota 2">Dota 2</option>
                                <option value="Valorant">Valorant</option>
                            </select>
                            <input
                                type="number" placeholder="Max Teams (e.g., 8)" required min="2" max="128"
                                className="w-full border bg-white p-2"
                                value={maxTeams} onChange={e => setMaxTeams(e.target.value)}
                            />
                            <button
                                type="submit"
                                className={`px-4 py-2 text-white transition rounded ${currentUser ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                                disabled={!currentUser}
                            >
                                Create Tournament
                            </button>
                        </form>
                    </div>

                </div>

                <div className="w-1/2 rounded border bg-white p-4 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold">Tournaments in Database</h2>
                    <button onClick={fetchTournaments} className="mb-4 text-sm text-blue-500 underline hover:text-blue-700">
                        Refresh List
                    </button>

                    <ul className="space-y-3">
                        {tournaments.map(t => (
                            <li key={t.id} className="border-b pb-2">
                                <strong>{t.name}</strong> — {t.game} (Teams: {t.maxTeams})
                            </li>
                        ))}
                        {tournaments.length === 0 && <p className="text-gray-500">No tournaments found.</p>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;