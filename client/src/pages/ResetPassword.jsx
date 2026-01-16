import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { api } = useContext(AuthContext);

    // Get email from previous page state, or fallback to empty string
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-100/40 via-gray-50 to-gray-50">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 animate-fade-in">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-gray-500">Enter the code sent to {email}</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 mb-6 rounded-xl text-sm font-medium border border-red-100 animate-slide-up">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="bg-green-50 text-green-600 p-3 mb-6 rounded-xl text-sm font-medium border border-green-100 animate-slide-up">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!location.state?.email && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all font-medium"
                                placeholder="Confirm your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">OTP Code</label>
                        <input
                            type="text"
                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all font-medium tracking-widest text-center text-lg"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">New Password</label>
                        <input
                            type="password"
                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all font-medium"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-fuchsia-500/10 focus:border-fuchsia-500 transition-all font-medium"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-3.5 rounded-2xl hover:opacity-90 transition-all font-bold shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                        Cancel
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
