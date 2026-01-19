import { useState, useEffect } from 'react';
import { X, Calendar, Type, AlignLeft } from 'lucide-react';

const emptyTask = { title: '', description: '', deadline: '', completed: false };

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit }) => {
    const [task, setTask] = useState(emptyTask);

    useEffect(() => {
        if (taskToEdit) {
            const deadline = taskToEdit.deadline ? new Date(taskToEdit.deadline).toISOString().slice(0, 16) : '';
            setTask({ ...taskToEdit, deadline });
        } else {
            setTask(emptyTask);
        }
    }, [taskToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(task);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl shadow-2xl w-full max-w-lg p-0 transform transition-all animate-slide-up overflow-hidden">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {taskToEdit ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white bg-transparent hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                <Type size={16} className="text-brand-500" />
                                Title
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 font-semibold text-gray-900 dark:text-white"
                                placeholder="What needs to be done?"
                                value={task.title}
                                onChange={(e) => setTask({ ...task, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                <AlignLeft size={16} className="text-brand-500" />
                                Description
                            </label>
                            <textarea
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400 min-h-[120px] resize-none text-gray-900 dark:text-gray-200"
                                placeholder="Add some details..."
                                value={task.description}
                                onChange={(e) => setTask({ ...task, description: e.target.value })}
                            />
                        </div>

                        <div className="group">
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 ml-1">
                                <Calendar size={16} className="text-brand-500" />
                                Due Date
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-gray-900 dark:text-white dark:[color-scheme:dark]"
                                value={task.deadline}
                                onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-brand-600 to-fuchsia-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-600/30 transition-all active:scale-95"
                        >
                            {taskToEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
