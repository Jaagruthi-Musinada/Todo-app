import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            const errorMsg = err.response?.data?.message ||
                (typeof err.response?.data?.error === 'string' ? err.response?.data?.error : 'Login failed');
            setError(errorMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-fuchsia-50/50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-fuchsia-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to continue to TaskFlow</p>
                </div>
                {error && <div className="bg-red-50 text-red-600 p-3 mb-6 rounded-xl text-sm font-medium border border-red-100">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-fuchsia-50/30 border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all font-medium placeholder:text-gray-400"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-fuchsia-50/30 border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all font-medium placeholder:text-gray-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm font-semibold text-fuchsia-600 hover:text-fuchsia-700 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-fuchsia-600 text-white py-3 rounded-xl hover:bg-fuchsia-700 transition-all font-bold shadow-lg shadow-fuchsia-600/30 hover:shadow-fuchsia-600/40 active:scale-95"
                    >
                        Sign In
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                    Don't have an account? <Link to="/signup" className="text-fuchsia-600 hover:text-fuchsia-700 hover:underline">Create account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
