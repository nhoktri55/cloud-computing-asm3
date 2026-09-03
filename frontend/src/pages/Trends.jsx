import { useEffect, useState } from 'react';
import api from '../services/api';
import { TrendingUp } from 'lucide-react';

export default function Trends() {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get('/trends')
            .then((res) => setTrends(res.data.trends))
            .catch(() => setError('Could not load trends. Please try again later.'))
            .finally(() => setLoading(false));
    }, []);

    const maxCount = Math.max(...trends.map((t) => t.listingCount), 1);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-blue-600" size={24} />
                <h1 className="text-2xl font-semibold text-gray-900">Trade trends</h1>
            </div>

            {loading ? (
                <p className="text-gray-400 text-sm">Loading trends...</p>
            ) : error ? (
                <p className="text-red-600 text-sm">{error}</p>
            ) : trends.length === 0 ? (
                <p className="text-gray-400 text-sm">No trend data yet. Check back after a few listings are posted.</p>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                    {trends.map((t) => (
                        <div key={t.gameName}>
                            <div className="flex items-center justify-between text-sm mb-1">
                                <span className="font-medium text-gray-900">{t.gameName}</span>
                                <span className="text-gray-500">
                                    {t.listingCount} listing{t.listingCount !== 1 ? 's' : ''} · avg ${t.averagePrice?.toFixed(2)}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${(t.listingCount / maxCount) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-xs text-gray-400 mt-4">
                Trends are updated automatically every 6 hours.
            </p>
        </div>
    );
}