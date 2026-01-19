import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState('signup'); // 'signup' or 'verify'
    const { signup, verifyEmail } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(email, password);
            setStep('verify');
        } catch (err) {
            console.error("Signup error details:", err);
            const errorMsg = err.response?.data?.message ||
                (typeof err.response?.data?.error === 'string' ? err.response?.data?.error : 'Signup failed');
            setError(errorMsg);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await verifyEmail(email, otp);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-fuchsia-50/50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-fuchsia-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {step === 'signup' ? 'Create Account' : 'Verify Email'}
                    </h2>
                    <p className="text-gray-500">
                        {step === 'signup' ? 'Join TaskFlow and get organized' : `Enter code sent to ${email}`}
                    </p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 mb-6 rounded-xl text-sm font-medium border border-red-100">{error}</div>}

                {step === 'signup' ? (
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-fuchsia-50/30 border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all font-medium placeholder:text-gray-400 text-gray-900"
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
                                className="w-full px-4 py-3 bg-fuchsia-50/30 border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all font-medium placeholder:text-gray-400 text-gray-900"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-fuchsia-600 text-white py-3 rounded-xl hover:bg-fuchsia-700 transition-all font-bold shadow-lg shadow-fuchsia-600/30 hover:shadow-fuchsia-600/40 active:scale-95"
                        >
                            Sign Up
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Verification Code</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-fuchsia-50/30 border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all font-medium text-center tracking-widest text-lg text-gray-900"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-fuchsia-600 text-white py-3 rounded-xl hover:bg-fuchsia-700 transition-all font-bold shadow-lg shadow-fuchsia-600/30 hover:shadow-fuchsia-600/40 active:scale-95"
                        >
                            Verify & Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('signup')}
                            className="w-full text-sm text-gray-500 font-medium hover:text-gray-700 mt-2 hover:underline"
                        >
                            Back to Signup
                        </button>
                    </form>
                )}

                {step === 'signup' && (
                    <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                        Already have an account? <Link to="/login" className="text-fuchsia-600 hover:text-fuchsia-700 hover:underline">Sign in</Link>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Signup;
