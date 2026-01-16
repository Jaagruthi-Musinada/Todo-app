import { useState, useEffect } from 'react';

const emptyTask = { title: '', description: '', deadline: '', completed: false };

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit }) => {
    const [task, setTask] = useState(emptyTask);

    useEffect(() => {
        if (taskToEdit) {
            // Format date for datetime-local input
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Title</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all placeholder:text-gray-400 font-medium"
                                placeholder="What needs to be done?"
                                value={task.title}
                                onChange={(e) => setTask({ ...task, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Description</label>
                            <textarea
                                className="w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all placeholder:text-gray-400 min-h-[100px] resize-none"
                                placeholder="Add some details..."
                                value={task.description}
                                onChange={(e) => setTask({ ...task, description: e.target.value })}
                            />
                        </div>

                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Due Date</label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 bg-gray-50 border-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all text-gray-600"
                                value={task.deadline}
                                onChange={(e) => setTask({ ...task, deadline: e.target.value })}
                            />
                        </div>

                        {taskToEdit && (
                            <div className="flex items-center pt-2">
                                <label className="relative inline-flex items-center cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={(e) => setTask({ ...task, completed: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fuchsia-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">Mark as Completed</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 bg-fuchsia-600 text-white font-medium rounded-xl hover:bg-fuchsia-700 shadow-lg shadow-fuchsia-600/30 transition-all hover:shadow-fuchsia-600/40"
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
