import { Link, useNavigate } from 'react-router-dom';
import { Dices, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-blue-600 font-semibold text-lg">
                    <Dices size={22} />
                    BoardGameTrade
                </Link>
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link to="/create-listing" className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors">
                                <PlusCircle size={16} />
                                New listing
                            </Link>
                            <Link to="/profile" className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-blue-600">
                                <User size={18} />
                                {user.name}
                            </Link>
                            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer">Log in</Link>
                            <Link to="/register" className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg cursor-pointer">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;