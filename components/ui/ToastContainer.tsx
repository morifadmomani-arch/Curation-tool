import React, { useState, useEffect } from 'react';

interface ToastMessage {
    id: number;
    message: string;
}

interface ToastContainerProps {
    toasts: ToastMessage[];
    onRemove: (id: number) => void;
}

const Toast: React.FC<{ message: string; onRemove: () => void }> = ({ message, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // Use requestAnimationFrame to ensure the initial state is rendered before transitioning
        const rafId = requestAnimationFrame(() => {
            setIsVisible(true); // Fade in
        });

        const fadeOutTimer = setTimeout(() => setIsVisible(false), 2700);
        const removeTimer = setTimeout(onRemove, 3000);
        
        return () => {
            cancelAnimationFrame(rafId);
            clearTimeout(fadeOutTimer);
            clearTimeout(removeTimer);
        };
    }, [onRemove]);
    
    return (
        <div className={`transform transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{message}</span>
            </div>
        </div>
    );
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed bottom-8 right-8 z-[100] space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} onRemove={() => onRemove(toast.id)} />
            ))}
        </div>
    );
};

export default ToastContainer;