import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, API_BASE } from '../context/AuthContext';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.token);
                navigate('/admin/write');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Connection failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-[#111] border border-neutral-800 rounded-2xl p-8 shadow-2xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-full bg-neutral-900 border border-neutral-800">
                        <Lock className="text-white" size={24} />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center text-white mb-2">Admin Access</h1>
                <p className="text-neutral-500 text-center mb-8 text-sm">Restricted area. Authorized personnel only.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Access Key"
                            className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Authenticate'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
