"use client";
import React, { useState, useEffect } from 'react';
import playersData from '../players/players.json';

const Home = () => {
    const [players, setPlayers] = useState<{ id: number; name: string; rating: number; selected: boolean }[]>([]);
    const [teams, setTeams] = useState<{ team1: { name: string; rating: number }[]; team2: { name: string; rating: number }[] }>({ team1: [], team2: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);

    useEffect(() => {
        setPlayers(playersData.map(player => ({ ...player, selected: false })));
    }, []);

    const handleCheckboxChange = (id: number) => {
        setPlayers(players.map(player => player.id === id ? { ...player, selected: !player.selected } : player));
    };

    const handleRandomizeTeams = () => {
        const selectedPlayers = players.filter(player => player.selected);
        const shuffledPlayers = selectedPlayers.sort(() => 0.5 - Math.random());
        const half = Math.ceil(shuffledPlayers.length / 2);
        const team1 = shuffledPlayers.slice(0, half).map(player => ({ name: player.name, rating: player.rating }));
        const team2 = shuffledPlayers.slice(half).map(player => ({ name: player.name, rating: player.rating }));
        setTeams({ team1, team2 });
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitScores = () => {
        const updatedPlayers = players.map(player => {
            if (teams.team1.some(p => p.name === player.name)) {
                return { ...player, rating: player.rating + (team1Score > team2Score ? 10 : -10) };
            }
            if (teams.team2.some(p => p.name === player.name)) {
                return { ...player, rating: player.rating + (team2Score > team1Score ? 10 : -10) };
            }
            return player;
        });
        setPlayers(updatedPlayers);
        handleCloseModal();
    };

    const getRank = (rating: number): number => {
        if (rating >= 1401) return 18;
        if (rating >= 1301) return 17;
        if (rating >= 1201) return 16;
        if (rating >= 1121) return 15;
        if (rating >= 1041) return 14;

        if (rating >= 961) return 13;
        if (rating >= 881) return 12;
        if (rating >= 801) return 11;
        if (rating >= 721) return 10;
        if (rating >= 641) return 9;
        if (rating >= 561) return 8;
        if (rating >= 481) return 7;
        if (rating >= 401) return 6;
        if (rating >= 321) return 5;
        if (rating >= 241) return 4;
        if (rating >= 161) return 3;
        if (rating >= 81) return 2;
        return 1;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white font-press-start">
            <h1 className="text-3xl font-bold mb-4">Team Randomizer by JBRKR & Maniek</h1>
            <div className="mb-4 w-full max-w-3xl">
                <div className="grid grid-cols-4 gap-4">
                    {players.map(player => (
                        <div key={player.id} className="flex items-center bg-gray-800 p-2 rounded">
                            <input
                                type="checkbox"
                                checked={player.selected}
                                onChange={() => handleCheckboxChange(player.id)}
                                className="form-checkbox h-4 w-4 text-orange-500 mr-2"
                            />
                            <span>{player.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={handleRandomizeTeams}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
            >
                Randomize Teams
            </button>
            <button
                onClick={handleOpenModal}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 text-sm mt-4"
            >
                Zatwierdź Teamy
            </button>
            <div className="flex justify-around w-full mt-4">
                <div className="w-1/5 p-2">
                    <h2 className="text-xl font-semibold mb-2 text-center">Team 1</h2>
                    <div className="bg-gray-800 p-4 rounded shadow text-sm text-center">
                        {teams.team1.map((player, index) => (
                            <div key={index} className="bg-gray-700 p-2 rounded mb-2 text-white">
                                {player.name} ({player.rating})
                                <img src={`/ranks/${getRank(player.rating)}.svg`} alt={`Rank ${getRank(player.rating)}`} className="ml-2 h-16 w-16 inline-block" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/5 p-2">
                    <h2 className="text-xl font-semibold mb-2 text-center">Team 2</h2>
                    <div className="bg-gray-800 p-4 rounded shadow text-sm text-center">
                        {teams.team2.map((player, index) => (
                            <div key={index} className="bg-gray-700 p-2 rounded mb-2 text-white">
                                {player.name} ({player.rating})
                                <img src={`/ranks/${getRank(player.rating)}.svg`} alt={`Rank ${getRank(player.rating)}`} className="ml-2 h-16 w-16 inline-block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg text-black">
                        <h2 className="text-xl font-semibold mb-4">Wpisz Wyniki</h2>
                        <div className="mb-4">
                            <label className="block mb-2">Team 1 Score:</label>
                            <input
                                type="number"
                                value={team1Score}
                                onChange={(e) => setTeam1Score(Number(e.target.value))}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Team 2 Score:</label>
                            <input
                                type="number"
                                value={team2Score}
                                onChange={(e) => setTeam2Score(Number(e.target.value))}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <button
                            onClick={handleSubmitScores}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                        >
                            Zatwierdź
                        </button>
                        <button
                            onClick={handleCloseModal}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Anuluj
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;