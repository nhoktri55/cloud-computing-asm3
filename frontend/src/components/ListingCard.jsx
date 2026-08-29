import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
    return (
        <Link
            to={`/listings/${listing.listingId}`}
            className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
        >
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {listing.imageUrl ? (
                    <img src={listing.imageUrl} alt={listing.gameName} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                )}
            </div>
            <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-gray-900 truncate">{listing.gameName}</h3>
                    <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${listing.type === 'sell' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                            }`}
                    >
                        {listing.type === 'sell' ? 'For sale' : 'For trade'}
                    </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">${listing.price}</p>
                {listing.gameRating && (
                    <p className="text-xs text-gray-400 mt-1">★ {listing.gameRating} · {listing.gameMinPlayers}-{listing.gameMaxPlayers} players</p>
                )}
            </div>
        </Link>
    );
}

export default ListingCard;