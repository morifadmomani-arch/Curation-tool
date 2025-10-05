import React, { useState, useMemo } from 'react';
import { ContentItem, ActionLog, UserInterestProfile } from '../../types';
import Modal from '../ui/Modal';
import { Icon, SearchIcon, ChevronDownIcon, ChevronUpIcon } from '../ui/Icons';
import PreviewItemCard from './PreviewItemCard';

// Helper component for collapsible filter sections
const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-2 text-left font-semibold text-gray-700 hover:text-gray-900"
            >
                <span>{title}</span>
                <Icon svg={isOpen ? ChevronUpIcon : ChevronDownIcon} className="w-4 h-4" />
            </button>
            {isOpen && <div className="pl-2 pt-2 space-y-2 border-l">{children}</div>}
        </div>
    );
};


interface ContentSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentItems: ContentItem[];
    onUserAction: (content: ContentItem, action: ActionLog['action'], details?: any) => void;
    interestProfile: UserInterestProfile;
    addToast: (message: string) => void;
}

const ContentSearchModal: React.FC<ContentSearchModalProps> = ({ isOpen, onClose, contentItems, onUserAction, interestProfile, addToast }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

    // Dynamically generate available filter options from content metadata
    const availableFilters = useMemo(() => {
        const filters: Record<string, Set<string>> = {
            contentType: new Set(),
            genre: new Set(),
            theme: new Set(),
            mood: new Set(),
            cast: new Set(),
            audience: new Set(),
        };

        contentItems.forEach(item => {
            Object.keys(filters).forEach(key => {
                const values = key === 'contentType' ? (item.contentType ? [item.contentType] : []) : item.metadata[key];
                if (Array.isArray(values)) {
                    values.forEach(value => {
                        if (value) filters[key].add(value);
                    });
                }
            });
        });

        const filterEntries = Object.entries(filters)
            .map(([key, valueSet]) => ({
                id: key,
                name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), // Prettify name e.g. contentType -> Content Type
                options: Array.from(valueSet).sort(),
            }))
            .filter(f => f.options.length > 0);
        
        // Ensure Content Type is always the first filter if it exists
        const contentTypeIndex = filterEntries.findIndex(f => f.id === 'contentType');
        if (contentTypeIndex > 0) {
            const contentTypeFilter = filterEntries.splice(contentTypeIndex, 1)[0];
            filterEntries.unshift(contentTypeFilter);
        }

        return filterEntries;
    }, [contentItems]);

    // Filter content based on active filters and search query
    const searchResults = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase().trim();
        // FIX: Add type guard to ensure value is an array before accessing .length, as Object.values can return `unknown[]`.
        const hasActiveFilters = Object.values(activeFilters).some(v => Array.isArray(v) && v.length > 0);

        if (!lowercasedQuery && !hasActiveFilters) {
            return contentItems; // Show all items if no search or filters
        }

        return contentItems.filter(item => {
            const passesFilters = Object.entries(activeFilters).every(([key, selectedValues]) => {
                // FIX: Add type guard to ensure selectedValues is an array before accessing its properties, as Object.entries can return values of type `unknown`.
                if (!Array.isArray(selectedValues) || selectedValues.length === 0) return true;
                
                if (key === 'contentType') {
                    return selectedValues.includes(item.contentType);
                }
                
                const itemValues = item.metadata[key];
                if (!Array.isArray(itemValues)) return false;
                return selectedValues.some(selectedValue => itemValues.includes(selectedValue));
            });
            if (!passesFilters) return false;

            if (!lowercasedQuery) return true;
            return (
                item.title.toLowerCase().includes(lowercasedQuery) ||
                Object.values(item.metadata).flat().some(meta => String(meta).toLowerCase().includes(lowercasedQuery))
            );
        });
    }, [searchQuery, contentItems, activeFilters]);
    
    const handleFilterChange = (categoryId: string, option: string) => {
        setActiveFilters(prev => {
            const currentCategoryFilters = prev[categoryId] || [];
            const newCategoryFilters = currentCategoryFilters.includes(option)
                ? currentCategoryFilters.filter(item => item !== option)
                : [...currentCategoryFilters, option];

            const newFilters = { ...prev };
            if (newCategoryFilters.length > 0) {
                newFilters[categoryId] = newCategoryFilters;
            } else {
                delete newFilters[categoryId];
            }
            return newFilters;
        });
    };
    
    const handleModalAction = (content: ContentItem, action: ActionLog['action'], details?: any) => {
        onUserAction(content, action, details);
        if (action === 'like' || action === 'play' || action === 'download') {
            addToast(`'${content.title}' interaction logged for recommendations.`);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Explore & Search Content (Shahid CMS)">
            <div className="flex gap-6 h-[70vh]">
                {/* Left: Filters */}
                <div className="w-64 flex-shrink-0 bg-gray-50 p-4 rounded-lg overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-gray-800">Filters</h3>
                         <button
                            onClick={() => setActiveFilters({})}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                            Clear All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {availableFilters.map(category => (
                            <FilterSection key={category.id} title={category.name}>
                                {category.options.map(option => (
                                    <div key={option} className="flex items-center">
                                        <input
                                            id={`${category.id}-${option}`}
                                            type="checkbox"
                                            checked={(activeFilters[category.id] || []).includes(option)}
                                            onChange={() => handleFilterChange(category.id, option)}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label htmlFor={`${category.id}-${option}`} className="ml-2 block text-sm text-gray-700 truncate cursor-pointer">
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </FilterSection>
                        ))}
                    </div>
                </div>

                 {/* Right: Search + Results */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="relative mb-4">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Icon svg={SearchIcon} className="w-5 h-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search filtered content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                    </div>
                    <div className="flex justify-between items-center mb-2 px-1">
                        <h3 className="text-sm font-medium text-gray-600">
                           Showing {searchResults.length} result(s)
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
                                {searchResults.map(item => (
                                    <PreviewItemCard 
                                        key={item.id} 
                                        item={item} 
                                        onUserAction={handleModalAction}
                                        interestProfile={interestProfile}
                                        deviceView="desktop" // Modal view is always desktop-like
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 text-gray-500 h-full flex flex-col items-center justify-center">
                                <h3 className="text-lg font-medium">No Results Found</h3>
                                <p className="mt-1 text-sm">Try adjusting your filters or search term.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ContentSearchModal;