import React, { useState } from 'react';
import { Icon, SearchIcon, PlusIcon, TrashIcon, PowerIcon, FilterIcon } from '../ui/Icons';
import Tooltip from '../ui/Tooltip';

interface PlaylistToolbarProps {
  selectedCount: number;
  onSearch: (query: string) => void;
  onCreate: () => void;
  onDeleteSelected: () => void;
  onActivateSelected: () => void;
  onDeactivateSelected: () => void;
  filters: { [key: string]: string };
  onFilterChange: (field: string, value: string) => void;
  onResetFilters: () => void;
}

const PlaylistToolbar: React.FC<PlaylistToolbarProps> = ({ 
  selectedCount, 
  onSearch,
  onCreate,
  onDeleteSelected,
  onActivateSelected,
  onDeactivateSelected,
  filters,
  onFilterChange,
  onResetFilters
}) => {
  const hasSelection = selectedCount > 0;
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white rounded-t-lg border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
               <Icon svg={SearchIcon} className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search playlists..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center text-sm px-3 py-2 rounded-md ${showFilters ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
            <Icon svg={FilterIcon} className="w-5 h-5 mr-1" />
            Filter
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {hasSelection && (
             <span className="text-sm text-gray-500 mr-2">
              {selectedCount} selected
            </span>
          )}
         {hasSelection && (
            <>
              <Tooltip text="Activate Selected">
                <button onClick={onActivateSelected} className="p-2 text-gray-500 hover:text-green-600 bg-gray-100 rounded-md">
                  <Icon svg={PowerIcon} className="w-5 h-5" />
                </button>
              </Tooltip>
               <Tooltip text="Deactivate Selected">
                <button onClick={onDeactivateSelected} className="p-2 text-gray-500 hover:text-yellow-600 bg-gray-100 rounded-md">
                  <Icon svg={PowerIcon} className="w-5 h-5" />
                </button>
              </Tooltip>
              <Tooltip text="Delete Selected">
                <button onClick={onDeleteSelected} className="p-2 text-gray-500 hover:text-red-600 bg-gray-100 rounded-md">
                   <Icon svg={TrashIcon} className="w-5 h-5" />
                </button>
              </Tooltip>
              <div className="border-l h-6 mx-2 border-gray-300"></div>
            </>
          )}
          <button 
              onClick={onCreate}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Icon svg={PlusIcon} className="w-5 h-5 mr-2" />
            Create Playlist
          </button>
        </div>
      </div>
      {showFilters && (
        <div className="p-4 bg-gray-50 border-b border-gray-200 animate-fade-in-down">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select id="status-filter" value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)} className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="">All</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Draft">Draft</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                    <div className="flex items-center space-x-1">
                        <input type="date" value={filters.createdFrom || ''} onChange={(e) => onFilterChange('createdFrom', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
                        <span className="text-gray-500">-</span>
                        <input type="date" value={filters.createdTo || ''} onChange={(e) => onFilterChange('createdTo', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modified Date</label>
                    <div className="flex items-center space-x-1">
                        <input type="date" value={filters.modifiedFrom || ''} onChange={(e) => onFilterChange('modifiedFrom', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
                        <span className="text-gray-500">-</span>
                        <input type="date" value={filters.modifiedTo || ''} onChange={(e) => onFilterChange('modifiedTo', e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm" />
                    </div>
                </div>
            </div>
             <div className="flex justify-end mt-4">
                <button onClick={onResetFilters} className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Reset Filters</button>
            </div>
        </div>
      )}
    </>
  );
};

export default PlaylistToolbar;