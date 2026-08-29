import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(form.email, form.password, form.name);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-16 px-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create your account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text" placeholder="Name" required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
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
                    Sign up
                </button>
            </form>
            <p className="text-sm text-gray-500 mt-4">
                Already have an account? <Link to="/login" className="text-blue-600 font-medium">Log in</Link>
            </p>
        </div>
    );
}

export default Register;