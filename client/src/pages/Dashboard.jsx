import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';
import { LogOut, Plus, Menu, Clock } from 'lucide-react';

const Dashboard = () => {
    const { user, logout, api } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    // Default open on larger screens if desired, but user asked for "click to open", so defaulting to false (closed) or true?
    // User said "side bar should open only when its clicked", implying default closed.
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);

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

        return tasks.filter(task => {
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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                isOpen={isSidebarOpen}
                toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="flex-1 lg:flex-none" />

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-900">{user?.email}</span>
                                <span className="text-xs text-gray-500">Free Plan</span>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 capitalize">
                                    {activeFilter.replace('-', ' ')} Tasks
                                </h1>
                                <p className="text-gray-500 mt-2 font-medium">
                                    You have {getFilteredTasks().length} tasks in this list
                                </p>
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-fuchsia-600 text-white px-6 py-3 rounded-xl hover:bg-fuchsia-700 transition-all shadow-lg shadow-fuchsia-600/30 hover:shadow-fuchsia-600/40 active:scale-95 font-semibold"
                            >
                                <Plus size={20} />
                                Create New Task
                            </button>
                        </div>

                        {getFilteredTasks().length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Clock className="text-gray-300" size={40} />
                                </div>
                                <p className="text-xl font-semibold text-gray-900">No tasks found</p>
                                <p className="text-gray-500 mt-2">Create a new task to get started!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {getFilteredTasks().map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onEdit={openEditModal}
                                        onDelete={handleDeleteClick}
                                        onToggleComplete={toggleComplete}
                                    />
                                ))}
                            </div>
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
