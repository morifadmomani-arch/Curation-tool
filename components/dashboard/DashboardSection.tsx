import React, { useState } from 'react';
import { Icon, ChevronDownIcon, ChevronUpIcon } from '../ui/Icons';

interface DashboardSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white rounded-lg shadow-md mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-t-lg border-b border-gray-200 focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={`section-content-${title.replace(/\s+/g, '-')}`}
            >
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <Icon svg={isOpen ? ChevronUpIcon : ChevronDownIcon} className="w-5 h-5 text-gray-500" />
            </button>
            {isOpen && (
                <div id={`section-content-${title.replace(/\s+/g, '-')}`} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardSection;
