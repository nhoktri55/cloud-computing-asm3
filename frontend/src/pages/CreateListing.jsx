import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../services/api";

const CreateListing = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [form, setForm] = useState({ price: '', type: 'sell', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedGame(null);
        if (value.length < 2) return setResults([]);
        const res = await api.get(`/bgg/search?query=${encodeURIComponent(value)}`);
        setResults(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!selectedGame) return setError('Please select a game from the list.');
        setSubmitting(true);

        try {
            let imageUrl = null;
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                const uploadRes = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imageUrl = uploadRes.data.imageUrl;
            }

            const res = await api.post('/listings', {
                gameId: selectedGame.gameId,
                price: Number(form.price),
                type: form.type,
                description: form.description,
                imageUrl,
            });

            navigate(`/listings/${res.data.listingId}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create listing');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">New listing</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-700">Game</label>
                    <input
                        type="text" placeholder="Search a game..." value={query} onChange={handleSearch}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {results.length > 0 && !selectedGame && (
                        <div className="mt-1 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                            {results.map((game) => (
                                <button
                                    type="button" key={game.gameId}
                                    onClick={() => { setSelectedGame(game); setQuery(game.name); setResults([]); }}
                                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                >
                                    {game.name} {game.yearPublished && `(${game.yearPublished})`}
                                </button>
                            ))}
                        </div>
                    )}
                    {selectedGame && (
                        <p className="mt-1 text-xs text-green-600">Selected: {selectedGame.name}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Photo</label>
                    <input
                        type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])}
                        className="mt-1 w-full text-sm"
                    />
                </div>

                <div className="flex gap-3">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">Price ($)</label>
                        <input
                            type="number" required value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-700">Type</label>
                        <select
                            value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="sell">For sale</option>
                            <option value="trade">For trade</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        rows={3} value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                    type="submit" disabled={submitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm"
                >
                    {submitting ? 'Posting...' : 'Post listing'}
                </button>
            </form>
        </div>
    );
}

export default CreateListing;