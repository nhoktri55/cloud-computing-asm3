import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../services/api";
import { useAuth } from '../context/AuthContext';

const ListingDetail = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/listings/${id}`).then((res) => setListing(res.data));
    }, [id]);

    const handleDelete = async () => {
        if (!confirm('Delete this listing?')) return;
        await api.delete(`/listings/${id}`);
        navigate('/');
    };

    if (!listing) return <p className="text-center mt-16 text-gray-400 text-sm">Loading...</p>;

    const isOwner = user?.email === listing.sellerEmail;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-6">
                {listing.imageUrl ? (
                    <img src={listing.imageUrl} alt={listing.gameName} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">{listing.gameName}</h1>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${listing.type === 'sell' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {listing.type === 'sell' ? 'For sale' : 'For trade'}
                </span>
            </div>
            <p className="text-xl text-gray-900 mt-2">${listing.price}</p>

            {listing.gameRating && (
                <div className="flex gap-4 text-sm text-gray-500 mt-3">
                    <span>★ {listing.gameRating} rating</span>
                    <span>{listing.gameMinPlayers}-{listing.gameMaxPlayers} players</span>
                    <span>Complexity {listing.gameComplexity}</span>
                    <span>{listing.gameYearPublished}</span>
                </div>
            )}

            {listing.description && <p className="text-gray-700 mt-4">{listing.description}</p>}

            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-500">Listed by <span className="font-medium text-gray-900">{listing.sellerName}</span></p>
                {isOwner && (
                    <button onClick={handleDelete} className="text-sm text-red-600 hover:text-red-700 font-medium">
                        Delete listing
                    </button>
                )}
            </div>
        </div>
    );
}

export default ListingDetail;