import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { api } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/forgot-password', { email });
            // Navigate to Reset Password page, passing email in state
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            const errorMsg = err.response?.data?.message ||
                (typeof err.response?.data?.error === 'string' ? err.response?.data?.error : JSON.stringify(err.response?.data?.error)) ||
                'Failed to send OTP';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-100/40 via-gray-50 to-gray-50">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 animate-fade-in">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                    <p className="text-gray-500">Enter your email to receive a reset code</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 mb-6 rounded-xl text-sm font-medium border border-red-100 animate-slide-up">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all font-medium placeholder:text-gray-400"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-3.5 rounded-2xl hover:opacity-90 transition-all font-bold shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
