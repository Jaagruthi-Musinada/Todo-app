import { Edit2, Trash2, Calendar, Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {

    // Calculate Status
    const getStatus = () => {
        if (task.completed) return { label: 'Completed', color: 'green', priority: 'low' };
        if (!task.deadline) return { label: 'No Deadline', color: 'gray', priority: 'neutral' };

        const now = new Date();
        const deadline = new Date(task.deadline);
        const diffTime = deadline - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffTime < 0) return { label: 'Overdue', color: 'red', priority: 'high' };
        if (diffDays <= 1) return { label: 'Due Today', color: 'orange', priority: 'medium' };
        return { label: 'Scheduled', color: 'brand', priority: 'low' };
    };

    const status = getStatus();

    // specific styles based on color key
    const styles = {
        red: "bg-red-50 hover:border-red-300 dark:bg-red-900/10 dark:hover:border-red-900/50 border-red-100 dark:border-red-900/20",
        orange: "bg-orange-50 hover:border-orange-300 dark:bg-orange-900/10 dark:hover:border-orange-900/50 border-orange-100 dark:border-orange-900/20",
        green: "bg-green-50 hover:border-green-300 dark:bg-green-900/10 dark:hover:border-green-900/50 border-green-100 dark:border-green-900/20",
        brand: "bg-white hover:border-brand-300 dark:bg-dark-card dark:hover:border-brand-500/30 border-gray-100 dark:border-white/5", // Default distinct style
        gray: "bg-gray-50 hover:border-gray-300 dark:bg-white/5 dark:hover:border-white/10 border-gray-100 dark:border-white/5"
    };

    const badgeStyles = {
        red: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300 border-red-200 dark:border-red-500/30",
        orange: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-500/30",
        green: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border-green-200 dark:border-green-500/30",
        brand: "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 border-brand-200 dark:border-brand-500/30",
        gray: "bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 border-gray-200 dark:border-gray-600"
    };

    // Format Date: dd/mm/yyyy
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // en-GB uses dd/mm/yyyy
    };

    return (
        <div className={cn(
            "group relative p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full backdrop-blur-sm",
            styles[status.color],
            task.completed && "opacity-75 grayscale-[0.8]"
        )}>
            {/* Header: Status Badge & Actions */}
            <div className="flex justify-between items-start mb-4">
                <div className={cn(
                    "flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider shadow-sm",
                    badgeStyles[status.color]
                )}>
                    {status.color === 'red' && <AlertCircle size={12} />}
                    {status.color === 'orange' && <Clock size={12} />}
                    {status.label}
                </div>

                <div className="flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200 bg-white/50 dark:bg-black/20 p-1 rounded-xl backdrop-blur-sm shadow-sm">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-500 hover:text-brand-600 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                        title="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 mb-6">
                <h3 className={cn(
                    "text-xl font-bold mb-2 transition-colors",
                    task.completed ? "text-gray-500 line-through decoration-2 decoration-gray-300" : "text-gray-900 dark:text-white"
                )}>
                    {task.title}
                </h3>
                {task.description && (
                    <p className={cn(
                        "text-sm leading-relaxed",
                        task.completed ? "text-gray-400" : "text-gray-500 dark:text-gray-400"
                    )}>
                        {task.description}
                    </p>
                )}
            </div>

            {/* Footer: Date & Complete Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-black/5 dark:border-white/5 mt-auto">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-0.5">Deadline</span>
                    <div className={cn(
                        "flex items-center gap-2 text-sm font-semibold",
                        status.color === 'red' ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
                    )}>
                        <Calendar size={14} />
                        <span>{task.deadline ? formatDate(task.deadline) : 'No Date'}</span>
                    </div>
                </div>

                <button
                    onClick={() => onToggleComplete(task)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95",
                        task.completed
                            ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-900/50"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-brand-600 hover:text-white hover:border-brand-600 hover:shadow-brand-500/25 dark:bg-white/5 dark:text-gray-300 dark:border-white/10 dark:hover:bg-brand-600"
                    )}
                >
                    {task.completed ? <CheckCircle size={16} /> : <Circle size={16} />}
                    <span>{task.completed ? 'Done' : 'Complete'}</span>
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
