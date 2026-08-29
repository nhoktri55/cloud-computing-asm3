import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';

const Profile = () => {
    const { user } = useAuth();
    const [myListings, setMyListings] = useState([]);

    useEffect(() => {
        api.get('/listings').then((res) => {
            setMyListings(res.data.filter((l) => l.sellerEmail === user.email));
        });
    }, [user]);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500 mb-6">{user.email}</p>

            <h2 className="text-lg font-medium text-gray-900 mb-3">My listings</h2>
            {myListings.length === 0 ? (
                <p className="text-gray-400 text-sm">You haven't posted anything yet.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {myListings.map((listing) => (
                        <ListingCard key={listing.listingId} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Profile;