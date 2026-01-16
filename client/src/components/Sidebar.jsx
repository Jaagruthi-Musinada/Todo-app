import { LayoutDashboard, CheckSquare, Clock, Calendar } from 'lucide-react';

const Sidebar = ({ activeFilter, setActiveFilter, isOpen, toggleSidebar }) => {
    const filters = [
        { id: 'all', label: 'All Tasks', icon: LayoutDashboard },
        { id: 'completed', label: 'Completed Tasks', icon: CheckSquare },
        { id: 'pending', label: 'Pending Tasks', icon: Clock },
        { id: 'today', label: 'Today\'s Tasks', icon: Calendar },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-64
                bg-gradient-to-b from-fuchsia-100 to-pink-100
                border-r border-pink-200/50 shadow-2xl shadow-pink-100/50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-10 text-fuchsia-900">
                        <div className="bg-white p-2 rounded-xl shadow-md shadow-fuchsia-900/10">
                            <LayoutDashboard size={24} className="text-fuchsia-600" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">TaskFlow</h1>
                    </div>

                    <nav className="space-y-2">
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
                                        w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium
                                        ${isActive
                                            ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/30 translate-x-1'
                                            : 'text-fuchsia-900/70 hover:bg-white/60 hover:text-fuchsia-900 hover:pl-5'
                                        }
                                    `}
                                >
                                    <Icon size={20} className={isActive ? 'text-white' : 'text-fuchsia-900/50'} />
                                    <span>{filter.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
