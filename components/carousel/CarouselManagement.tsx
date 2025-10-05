import React, { useState, useMemo, useEffect, DragEvent } from 'react';
import { RouteNode, Carousel } from '../../types';
import { Icon, PlusIcon, TrashIcon, PowerIcon, FilterIcon } from '../ui/Icons';
import Tooltip from '../ui/Tooltip';
import CarouselRow from './CarouselRow';

interface CarouselManagementProps {
    selectedRoute: RouteNode | null;
    carousels: Carousel[];
    onStartCreate: () => void;
    onEdit: (carousel: Carousel) => void;
    onPreview: (carousel: Carousel) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
    onDuplicate: (carousel: Carousel) => void;
    onBulkDelete: (ids: string[]) => void;
    onBulkToggleStatus: (ids: string[], status: 'Active' | 'Inactive') => void;
    onReorder: (sourceId: string, destinationId: string) => void;
}

const FilterSelect: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, children: React.ReactNode}> = ({ label, value, onChange, children }) => (
    <div>
        <label className="text-xs font-medium text-gray-500">{label}</label>
        <select value={value} onChange={onChange} className="ml-2 text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            {children}
        </select>
    </div>
);

const CarouselManagement: React.FC<CarouselManagementProps> = (props) => {
    const { 
        selectedRoute, carousels, onStartCreate, onEdit, onPreview, onDelete, onToggleStatus, onDuplicate, 
        onBulkDelete, onBulkToggleStatus, onReorder 
    } = props;
    const [selectedCarousels, setSelectedCarousels] = useState<string[]>([]);
    const [platformFilter, setPlatformFilter] = useState('All');
    const [avodSvodFilter, setAvodSvodFilter] = useState('All');
    const [dragOverId, setDragOverId] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [deletingIds, setDeletingIds] = useState<string[]>([]);

    // Reset state when the route changes
    useEffect(() => {
        setSelectedCarousels([]);
        setPlatformFilter('All');
        setAvodSvodFilter('All');
        setShowFilters(false);
        setDeletingIds([]);
    }, [selectedRoute]);

    const filteredCarousels = useMemo(() => {
        return (carousels || [])
            .sort((a, b) => a.position - b.position)
            .filter(c => {
                if (platformFilter === 'All') return true;
                if (platformFilter === 'Mobile') return c.platforms.includes('mobile_android') || c.platforms.includes('mobile_ios');
                if (platformFilter === 'TV') return c.platforms.includes('android_tv');
                return c.platforms.includes(platformFilter.toLowerCase().replace(' ', '_'));
            })
            .filter(c => {
                if (avodSvodFilter === 'All') return true;
                return c.avodSvod.includes(avodSvodFilter);
            });
    }, [carousels, platformFilter, avodSvodFilter]);

    const isAllSelected = useMemo(() => {
        return filteredCarousels.length > 0 && selectedCarousels.length === filteredCarousels.length;
    }, [filteredCarousels, selectedCarousels]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedCarousels(filteredCarousels.map(c => c.id));
        } else {
            setSelectedCarousels([]);
        }
    };

    const handleSelectOne = (id: string, isChecked: boolean) => {
        if (isChecked) {
            setSelectedCarousels(prev => [...prev, id]);
        } else {
            setSelectedCarousels(prev => prev.filter(selectedId => selectedId !== id));
        }
    };

    const handleLocalDelete = (id: string) => {
        setDeletingIds(prev => [...prev, id]);
        setTimeout(() => {
            onDelete(id);
        }, 300);
    };

    const handleDeleteSelected = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedCarousels.length} selected carousels?`)) {
            setDeletingIds(prev => [...prev, ...selectedCarousels]);
            setTimeout(() => {
                onBulkDelete(selectedCarousels);
                setSelectedCarousels([]);
                setDeletingIds([]);
            }, 300);
        }
    };

    const handleToggleStatusSelected = (status: 'Active' | 'Inactive') => {
        onBulkToggleStatus(selectedCarousels, status);
        setSelectedCarousels([]);
    };
    
    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: DragEvent<HTMLTableRowElement>, id: string) => {
        e.dataTransfer.setData('carouselId', id);
        e.currentTarget.style.opacity = '0.4';
    };

    const handleDragOver = (e: DragEvent<HTMLTableRowElement>, id: string) => {
        e.preventDefault();
        setDragOverId(id);
    };

    const handleDrop = (e: DragEvent<HTMLTableRowElement>, destinationId: string) => {
        e.preventDefault();
        const sourceId = e.dataTransfer.getData('carouselId');
        if (sourceId && destinationId && sourceId !== destinationId) {
            onReorder(sourceId, destinationId);
        }
        setDragOverId(null);
    };

    const handleDragEnd = (e: DragEvent<HTMLTableRowElement>) => {
        e.currentTarget.style.opacity = '1';
        setDragOverId(null);
    };

    if (!selectedRoute) {
        return (
            <div className="bg-white rounded-lg shadow-md h-full flex items-center justify-center">
                <p className="text-gray-500">Select a page from the routing structure to manage carousels.</p>
            </div>
        );
    }

    const tableHeaders = ['ID', 'Carousel Title', 'Carousel Type', 'Position', 'Items', 'Platforms', 'Type', 'AVOD/SOVD', 'Status', 'Pinned', 'Actions'];
    const hasSelection = selectedCarousels.length > 0;

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Carousels for: <span className="text-indigo-600">{selectedRoute.name}</span></h2>
                        <p className="text-sm text-gray-500">Manage and reorder carousels for this page.</p>
                    </div>
                     <div className="flex items-center space-x-2">
                        {hasSelection && (
                            <>
                                <span className="text-sm text-gray-500 mr-2">
                                    {selectedCarousels.length} selected
                                </span>
                                <Tooltip text="Activate Selected"><button onClick={() => handleToggleStatusSelected('Active')} className="p-2 text-gray-500 hover:text-green-600 bg-gray-100 rounded-md"><Icon svg={PowerIcon} className="w-5 h-5" /></button></Tooltip>
                                <Tooltip text="Deactivate Selected"><button onClick={() => handleToggleStatusSelected('Inactive')} className="p-2 text-gray-500 hover:text-yellow-600 bg-gray-100 rounded-md"><Icon svg={PowerIcon} className="w-5 h-5" /></button></Tooltip>
                                <Tooltip text="Delete Selected"><button onClick={handleDeleteSelected} className="p-2 text-gray-500 hover:text-red-600 bg-gray-100 rounded-md"><Icon svg={TrashIcon} className="w-5 h-5" /></button></Tooltip>
                                <div className="border-l h-6 mx-2 border-gray-300"></div>
                            </>
                        )}
                        <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                            <Icon svg={FilterIcon} className="w-5 h-5 mr-1" />
                            Filter
                        </button>
                        <button onClick={onStartCreate} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Icon svg={PlusIcon} className="w-5 h-5 mr-2" />
                            Create Carousel
                        </button>
                    </div>
                </div>
            </div>

            {showFilters && (
                 <div className="p-4 bg-gray-50 border-b border-gray-200 animate-fade-in-down">
                    <div className="flex items-center space-x-4">
                        <FilterSelect label="Platform" value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}>
                            <option>All</option><option>Web</option><option>TV</option><option>Mobile</option><option>Android Mobile</option><option>iOS Mobile</option>
                        </FilterSelect>
                        <FilterSelect label="Monetization" value={avodSvodFilter} onChange={e => setAvodSvodFilter(e.target.value)}>
                            <option>All</option><option>AVOD</option><option>SVOD</option>
                        </FilterSelect>
                    </div>
                </div>
            )}
            
            {filteredCarousels.length > 0 ? (
                <div className="flex-1 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th scope="col" className="p-4"><input type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" checked={isAllSelected} onChange={handleSelectAll} /></th>
                                {tableHeaders.map(header => (<th key={header} className="py-3 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{header}</th>))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {filteredCarousels.map(carousel => 
                                <CarouselRow 
                                    key={carousel.id} 
                                    carousel={carousel} 
                                    isSelected={selectedCarousels.includes(carousel.id)}
                                    isDeleting={deletingIds.includes(carousel.id)}
                                    onSelect={handleSelectOne}
                                    dragOverId={dragOverId}
                                    onDragStart={handleDragStart}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onDragEnd={handleDragEnd}
                                    onEdit={onEdit}
                                    onPreview={onPreview}
                                    onDelete={handleLocalDelete}
                                    onToggleStatus={onToggleStatus}
                                    onDuplicate={onDuplicate}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-700">No Carousels Found</h3>
                        <p className="mt-2 text-sm text-gray-500">No carousels match the current filters. Get started by creating a new carousel.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarouselManagement;