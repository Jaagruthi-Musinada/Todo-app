import { Trash2, Edit, Check } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
    const isExpired = task.deadline && new Date(task.deadline) < new Date();

    // Status Logic
    const isCompleted = task.completed;

    // Color Schemes
    const cardStyles = isCompleted
        ? "bg-emerald-50/50 border-emerald-100 opacity-75"
        : "bg-white border-white shadow-xl shadow-fuchsia-900/5 hover:-translate-y-1";

    return (
        <div className={`p-6 rounded-3xl transition-all duration-300 border ${cardStyles} group relative overflow-hidden flex flex-col`}>
            {/* Status Indicator Stripe */}
            <div className={`absolute top-0 left-0 w-1.5 h-full ${isCompleted ? 'bg-emerald-400' : 'bg-fuchsia-500'}`} />

            {/* Badges Row (Top) */}
            <div className="flex items-center gap-2 mb-3 pl-2">
                {isCompleted && (
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide">
                        Completed
                    </span>
                )}
                {isExpired && !isCompleted && (
                    <span className="bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide">
                        Overdue
                    </span>
                )}
            </div>

            <div className="flex-1 min-w-0 pl-2">
                {/* Title Row with Checkbox */}
                <div className="flex items-start gap-3 mb-2">
                    <button
                        onClick={() => onToggleComplete && onToggleComplete(task)}
                        className={`
                            flex-shrink-0 w-6 h-6 mt-1 rounded-md border-2 cursor-pointer transition-all duration-200 flex items-center justify-center
                            ${isCompleted
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-gray-300 hover:border-fuchsia-500 bg-white'
                            }
                        `}
                    >
                        {isCompleted && <Check size={16} strokeWidth={3} />}
                    </button>

                    <h3
                        onClick={() => onToggleComplete && onToggleComplete(task)}
                        className={`font-bold text-lg truncate transition-all cursor-pointer flex-1 ${isCompleted ? 'text-gray-400 line-through decoration-2 decoration-gray-300' : 'text-gray-800'}`}
                    >
                        {task.title}
                    </h3>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-4 line-clamp-3 ml-9 ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                    {task.description}
                </p>

                {/* Deadline (Bottom) */}
                <div className="flex items-center gap-3 ml-9">
                    {task.deadline && (
                        <div className={`
                            text-xs font-semibold flex items-center gap-1.5
                            ${isCompleted
                                ? 'text-gray-400'
                                : isExpired
                                    ? 'text-red-500'
                                    : 'text-gray-400'
                            }
                        `}>
                            Deadline: {new Date(task.deadline).toLocaleDateString()} at {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    )}
                </div>
            </div>

            {/* Absolute Edit/Delete Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(task)}
                    className="p-2 text-gray-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-xl transition-colors"
                    title="Edit"
                >
                    <Edit size={18} />
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
