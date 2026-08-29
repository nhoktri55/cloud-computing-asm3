import { useEffect, useState } from 'react';
import api from "../services/api"
import ListingCard from '../components/ListingCard';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/listings')
            .then((res) => setListings(res.data))
            .finally(() => setLoading(false));
    }, []);

    const filtered = listings.filter((l) =>
        l.gameName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Browse listings</h1>
                <input
                    type="text"
                    placeholder="Search by game name..."
                    className="mt-3 w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
            ) : filtered.length === 0 ? (
                <p className="text-gray-400 text-sm">No listings found.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filtered.map((listing) => (
                        <ListingCard key={listing.listingId} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;