import { AlertTriangle } from 'lucide-react';

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white dark:bg-dark-card border border-white/20 dark:border-white/5 rounded-3xl shadow-2xl w-full max-w-sm p-8 transform transition-all animate-slide-up">
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                        <AlertTriangle className="text-red-600 dark:text-red-400" size={28} />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Delete Task?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                        Are you sure you want to delete this task? This action cannot be undone.
                    </p>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="w-full px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
