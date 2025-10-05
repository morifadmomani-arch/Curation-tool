import React, { useState } from 'react';
import { Icon, InformationCircleIcon, FilterIcon, ChartBarIcon, SpinnerIcon } from '../ui/Icons';
import FilterModal, { AppliedFilters, FilterCategory } from './FilterModal';


interface GraphCardProps {
    title: string;
    availableFilters: FilterCategory[];
    frequencyOptions: string[];
    children?: (frequency: string, appliedFilters: AppliedFilters) => React.ReactNode;
    isLoading?: boolean;
}

const GraphCard: React.FC<GraphCardProps> = ({ title, availableFilters, frequencyOptions, children, isLoading = false }) => {
    // Default to Weekly if available, otherwise the first option
    const defaultFrequency = frequencyOptions.includes('Weekly') ? 'Weekly' : frequencyOptions[0];
    const [frequency, setFrequency] = useState(defaultFrequency);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({});

    const handleApplyFilters = (filters: AppliedFilters) => {
        setAppliedFilters(filters);
        // In a real application, you would trigger a data refetch here
        // using the new filters and current frequency.
    };

    // FIX: By providing an explicit generic type argument to reduce, we ensure the result is a number.
    const activeFilterCount = Object.values(appliedFilters).reduce<number>((count, options) => count + (Array.isArray(options) ? options.length : 0), 0);

    const filtersDescription = availableFilters.map(f => f.name).join(', ');

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 col-span-1 md:col-span-2 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                        <h4 className="text-md font-bold text-gray-800">{title}</h4>
                        <div className="relative group">
                            <Icon svg={InformationCircleIcon} className="w-4 h-4 text-gray-400" />
                            <div className="absolute bottom-full mb-2 w-max max-w-xs px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                               Filters: {filtersDescription}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => setIsFilterModalOpen(true)}
                            className={`flex items-center text-xs px-2 py-1 rounded-md border  transition-colors ${activeFilterCount > 0 ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'text-gray-600 hover:bg-gray-100 border-gray-200'}`}
                        >
                            <Icon svg={FilterIcon} className="w-4 h-4 mr-1" />
                            Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
                        </button>
                         <select 
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="text-xs border-gray-200 rounded-md shadow-sm focus:border-indigo-300 focus:ring-0"
                         >
                            {frequencyOptions.map(freq => <option key={freq}>{freq}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-md mt-2 flex items-center justify-center min-h-[200px]">
                   {isLoading ? (
                        <div className="flex flex-col items-center justify-center text-gray-500">
                            <Icon svg={SpinnerIcon} className="w-8 h-8 animate-spin text-indigo-500" />
                            <p className="mt-2 text-sm">Loading data...</p>
                        </div>
                    ) : children ? children(frequency, appliedFilters) : (
                        <div className="text-center text-gray-500">
                            <Icon svg={ChartBarIcon} className="w-12 h-12 mx-auto text-gray-300" />
                            <p className="mt-2 text-sm">Graph data will be displayed here.</p>
                        </div>
                    )}
                </div>
            </div>

            <FilterModal 
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                availableFilters={availableFilters}
                appliedFilters={appliedFilters}
                onApply={handleApplyFilters}
            />
        </>
    );
};

export default GraphCard;
