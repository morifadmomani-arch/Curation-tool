import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

export interface FilterCategory {
    id: string;
    name: string;
    options: string[];
}

export type AppliedFilters = Record<string, string[]>;

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableFilters: FilterCategory[];
    appliedFilters: AppliedFilters;
    onApply: (filters: AppliedFilters) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, availableFilters, appliedFilters, onApply }) => {
    const [localFilters, setLocalFilters] = useState<AppliedFilters>(appliedFilters);

    useEffect(() => {
        // Reset local state when modal is opened with new props
        setLocalFilters(appliedFilters);
    }, [appliedFilters, isOpen]);

    const handleCheckboxChange = (categoryId: string, option: string) => {
        setLocalFilters(prev => {
            const currentCategoryFilters = prev[categoryId] || [];
            const newCategoryFilters = currentCategoryFilters.includes(option)
                ? currentCategoryFilters.filter(item => item !== option)
                : [...currentCategoryFilters, option];
            
            return {
                ...prev,
                [categoryId]: newCategoryFilters
            };
        });
    };

    const handleApplyClick = () => {
        onApply(localFilters);
        onClose();
    };

    const handleClearAll = () => {
        setLocalFilters({});
    }

    const footer = (
        <>
            <button onClick={handleClearAll} className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                Clear All
            </button>
            <button onClick={onClose} className="px-4 py-2 text-sm bg-white text-gray-700 rounded-md hover:bg-gray-100 border">
                Cancel
            </button>
            <button onClick={handleApplyClick} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Apply Filters
            </button>
        </>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Apply Filters" footer={footer}>
            <div className="space-y-6">
                {availableFilters.map(category => (
                    <div key={category.id}>
                        <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mb-3">{category.name}</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                            {category.options.map(option => (
                                <div key={option} className="flex items-center">
                                    <input
                                        id={`${category.id}-${option}`}
                                        type="checkbox"
                                        checked={(localFilters[category.id] || []).includes(option)}
                                        onChange={() => handleCheckboxChange(category.id, option)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor={`${category.id}-${option}`} className="ml-2 block text-sm text-gray-900 truncate cursor-pointer">
                                        {option}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default FilterModal;
