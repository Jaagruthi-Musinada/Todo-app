import { LayoutDashboard, CheckSquare, Clock, Calendar, Moon, Sun, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

const Sidebar = ({ activeFilter, setActiveFilter, isOpen, toggleSidebar, logout, user }) => {
    // Dark mode logic inside Sidebar for simplicity, could be moved to context
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const filters = [
        { id: 'all', label: 'All Tasks', icon: LayoutDashboard },
        { id: 'completed', label: 'Completed', icon: CheckSquare },
        { id: 'pending', label: 'Pending', icon: Clock },
        { id: 'today', label: 'Today', icon: Calendar },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-72
                bg-white/80 dark:bg-dark-card/90 backdrop-blur-xl
                border-r border-brand-100 dark:border-white/5
                shadow-2xl shadow-brand-900/10
                transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                flex flex-col
            `}>
                <div className="p-8">
                    {/* Logo */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="bg-gradient-to-tr from-brand-600 to-fuchsia-600 p-3 rounded-2xl shadow-lg shadow-brand-500/30">
                            <LayoutDashboard size={26} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">TaskFlow</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Manage everyday</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-3">
                        {filters.map((filter) => {
                            const Icon = filter.icon;
                            const isActive = activeFilter === filter.id;

                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => {
                                        setActiveFilter(filter.id);
                                        if (window.innerWidth < 1024) toggleSidebar();
                                    }}
                                    className={`
                                        w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-semibold group relative overflow-hidden
                                        ${isActive
                                            ? 'bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white shadow-lg shadow-brand-500/25'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-brand-50/50 dark:hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <Icon size={22} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-300'}`} />
                                    <span className="relative z-10">{filter.label}</span>
                                    {isActive && <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="mt-auto p-8 border-t border-gray-100 dark:border-white/5 space-y-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="w-full flex items-center justify-between px-5 py-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-brand-200 dark:hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isDark ? 'bg-brand-900/50 text-brand-300' : 'bg-orange-100 text-orange-500'}`}>
                                {isDark ? <Moon size={18} /> : <Sun size={18} />}
                            </div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">Dark Mode</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${isDark ? 'bg-brand-600' : 'bg-gray-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${isDark ? 'left-5' : 'left-1'}`} />
                        </div>
                    </button>

                    {/* User Profile / Logout */}
                    {user && (
                        <div className="flex items-center gap-3 px-2 pt-2">
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email?.split('@')[0]}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate text-ellipsis">{user.email}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/10 rounded-xl transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
