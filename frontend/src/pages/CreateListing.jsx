import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, X } from 'lucide-react';
import api from "../services/api";

const CreateListing = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [form, setForm] = useState({ price: '', type: 'sell', description: '' });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        setSelectedGame(null);
        if (value.length < 2) return setResults([]);
        const res = await fetch(`${import.meta.env.VITE_BGG_LAMBDA_URL}?query=${encodeURIComponent(value)}`);
        const data = await res.json();
        setResults(data);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
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
                                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 cursor-pointer"
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
                    {imagePreview ? (
                        <div className="mt-1 relative w-32 h-32">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 hover:bg-gray-700 cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <label
                            htmlFor="listing-image"
                            className="mt-1 flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors"
                        >
                            <ImagePlus size={22} />
                            <span className="text-xs mt-1">Upload</span>
                            <input
                                id="listing-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
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
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm cursor-pointer disabled:cursor-not-allowed"
                >
                    {submitting ? 'Posting...' : 'Post listing'}
                </button>
            </form>
        </div>
    );
}

export default CreateListing;