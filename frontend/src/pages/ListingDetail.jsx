import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from "../services/api";
import { useAuth } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';
import { MessageCircle } from 'lucide-react';

const ListingDetail = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);

    useEffect(() => {
        api.get(`/listings/${id}`).then((res) => setListing(res.data));
    }, [id]);

    useEffect(() => {
        if (listing && user && listing.sellerEmail === user.email) {
            api.get(`/chat/listing/${listing.listingId}`).then((res) => setConversations(res.data));
        }
    }, [listing, user]);

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

            <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col items-center justify-between">
                <p className="text-sm text-gray-500">Listed by <span className="font-medium text-gray-900">{listing.sellerName}</span></p>
                {isOwner && (
                    <button onClick={handleDelete} className="text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer">
                        Delete listing
                    </button>
                )}
            </div>

            {user && !isOwner && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h2 className="text-sm font-medium text-gray-900 mb-3">Chat with seller</h2>
                    <ChatBox listingId={listing.listingId} otherEmail={listing.sellerEmail} />
                </div>
            )}

            {user && isOwner && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h2 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-1.5">
                        <MessageCircle size={16} />
                        Messages about this listing
                    </h2>

                    {conversations.length === 0 ? (
                        <p className="text-sm text-gray-400">No one has messaged you about this listing yet.</p>
                    ) : !activeChat ? (
                        <div className="border border-gray-200 rounded-xl divide-y divide-gray-100">
                            {conversations.map((c) => (
                                <button
                                    key={c.otherEmail}
                                    onClick={() => setActiveChat(c.otherEmail)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                >
                                    <p className="text-sm font-medium text-gray-900">{c.otherEmail}</p>
                                    <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={() => setActiveChat(null)}
                                className="text-xs text-blue-600 mb-2 cursor-pointer hover:underline"
                            >
                                ← Back to conversations
                            </button>
                            <ChatBox listingId={listing.listingId} otherEmail={activeChat} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ListingDetail;