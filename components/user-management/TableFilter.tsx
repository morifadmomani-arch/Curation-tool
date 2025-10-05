import React, { useState, useRef, useEffect } from 'react';
import { Icon, FilterIcon } from '../ui/Icons';

interface TableFilterProps {
    options: { value: string, label: string }[];
    value: string;
    onChange: (value: string) => void;
}

const TableFilter: React.FC<TableFilterProps> = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isActive = value !== 'All';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative ml-2" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1 rounded-full ${isActive ? 'text-indigo-600 bg-indigo-100' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <Icon svg={FilterIcon} className="w-4 h-4" />
            </button>
            {isOpen && (
                <div className="absolute mt-2 w-48 rounded-md bg-white shadow-lg z-10 border border-gray-200">
                    <ul className="py-1 max-h-60 overflow-auto">
                        {options.map(option => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`text-gray-900 cursor-default select-none relative py-2 px-4 text-sm hover:bg-gray-100 ${value === option.value ? 'font-semibold bg-gray-100' : ''}`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TableFilter;
