import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(form.email, form.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-16 px-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Log in</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="email" placeholder="Email" required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password" placeholder="Password" required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm">
                    Log in
                </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
                No account yet? <Link to="/register" className="text-blue-600 font-medium">Sign up</Link>
            </p>
        </div>
    );
}

export default Login;