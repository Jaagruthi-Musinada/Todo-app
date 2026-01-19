import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';
import { Plus, Menu, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user, logout, api } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        }
    };

    const getFilteredTasks = () => {
        const today = new Date().toISOString().split('T')[0];

        let filtered = tasks;

        // 1. Filter by Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(lowerQuery) ||
                (t.description && t.description.toLowerCase().includes(lowerQuery))
            );
        }

        // 2. Filter by Category
        return filtered.filter(task => {
            switch (activeFilter) {
                case 'completed': return task.completed;
                case 'pending': return !task.completed;
                case 'today': return task.deadline && task.deadline.startsWith(today);
                default: return true;
            }
        });
    };

    const toggleComplete = async (task) => {
        try {
            const updatedTask = { ...task, completed: !task.completed };
            setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
            await api.put(`/tasks/${task.id}`, updatedTask);
        } catch (err) {
            console.error('Failed to update task status', err);
            setTasks(tasks.map(t => t.id === task.id ? task : t));
        }
    };

    useEffect(() => {
        // Initial Fetch
        fetchTasks();
    }, []);

    const handleSave = async (taskData) => {
        try {
            if (taskData.id) {
                await api.put(`/tasks/${taskData.id}`, taskData);
            } else {
                await api.post('/tasks', taskData);
            }
            await fetchTasks();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to save task', err);
            alert('Failed to save task: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleDeleteClick = (id) => {
        setTaskToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await api.delete(`/tasks/${taskToDelete}`);
            setTasks(tasks.filter(t => t.id !== taskToDelete));
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        } catch (err) {
            console.error('Failed to delete task', err);
            alert('Failed to delete task');
        }
    };

    const openCreateModal = () => {
        setCurrentTask(null);
        setIsModalOpen(true);
    };

    const openEditModal = (task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 font-sans selection:bg-brand-500/30">
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.1),transparent_50%)]"></div>
                <div className="absolute top-1/4 right-0 w-96 h-96 bg-fuchsia-400/10 rounded-full blur-3xl mix-blend-multiply dark:bg-fuchsia-900/10 dark:mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-10 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl mix-blend-multiply dark:bg-brand-900/10 dark:mix-blend-screen animate-pulse-slow"></div>
            </div>

            <Sidebar
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                logout={logout}
                user={user}
            />

            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ease-out ${isSidebarOpen ? 'lg:ml-72' : ''}`}>

                {/* Header */}
                <header className="sticky top-0 z-30 px-6 py-4 glass dark:bg-dark-card/80 dark:border-b dark:border-white/5">
                    <div className="flex justify-between items-center max-w-7xl mx-auto">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 hidden sm:block">
                                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.email?.split('@')[0]}
                            </h2>
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-md mx-4 relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100/50 dark:bg-black/20 border-none rounded-2xl focus:ring-2 focus:ring-brand-500/20 text-sm font-medium transition-all"
                            />
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-brand-500/30 hover:-translate-y-0.5 active:translate-y-0 text-sm font-bold transition-all"
                        >
                            <Plus size={18} />
                            <span>New Task</span>
                        </button>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Title Section */}
                        <div className="flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-gray-200/50 dark:border-white/5 pb-6">
                            <div>
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white capitalize flex items-center gap-3">
                                    {activeFilter === 'all' && 'All Tasks'}
                                    {activeFilter === 'completed' && 'Completed'}
                                    {activeFilter === 'pending' && 'In Progress'}
                                    {activeFilter === 'today' && "Today's Plan"}
                                    <span className="text-sm font-bold bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full align-middle transform -translate-y-1">
                                        {getFilteredTasks().length}
                                    </span>
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium text-lg">
                                    Stay organized and productive.
                                </p>
                            </div>
                        </div>

                        {/* Task Grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        >
                            <AnimatePresence mode='popLayout'>
                                {getFilteredTasks().map(task => (
                                    <motion.div
                                        key={task.id}
                                        variants={itemVariants}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    >
                                        <TaskCard
                                            task={task}
                                            onEdit={openEditModal}
                                            onDelete={handleDeleteClick}
                                            onToggleComplete={toggleComplete}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {getFilteredTasks().length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <div className="bg-white/50 dark:bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-900/5">
                                    <Filter className="text-gray-300 dark:text-gray-600" size={40} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">No tasks found</p>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your filters or search.</p>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                taskToEdit={currentTask}
            />
            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default Dashboard;
