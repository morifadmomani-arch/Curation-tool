import React, { useState, useMemo, useEffect } from 'react';
import { Playlist } from '../../types';
import PlaylistToolbar from './PlaylistToolbar';
import PlaylistTable from './PlaylistTable';
import Pagination from './Pagination';

interface PlaylistManagerProps {
  playlists: Playlist[];
  onCreate: () => void;
  onEdit: (playlist: Playlist) => void;
  onPreview: (playlist: Playlist) => void;
  onDelete: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
  onToggleStatus: (playlist: Playlist) => void;
  onDuplicate: (playlist: Playlist) => void;
}

const PlaylistManager: React.FC<PlaylistManagerProps> = ({ 
  playlists, 
  onCreate, 
  onEdit, 
  onPreview,
  onDelete,
  onBulkDelete,
  onToggleStatus,
  onDuplicate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPlaylists, setSelectedPlaylists] = useState<number[]>([]);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const initialFilters = {
    status: '',
    createdFrom: '',
    createdTo: '',
    modifiedFrom: '',
    modifiedTo: '',
  };
  const [filters, setFilters] = useState(initialFilters);
  
  // When playlists prop changes from parent, clean up deletingIds for items that are gone
  useEffect(() => {
    if (deletingIds.length > 0) {
      setDeletingIds(prev => prev.filter(id => playlists.some(p => p.id === id)));
    }
  }, [playlists]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredPlaylists = useMemo(() => {
    return playlists
      .filter(playlist => { // Search Query Filter
        return (
          playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
      .filter(playlist => { // Advanced Filters
        let passes = true;
        // Status
        if (filters.status && playlist.status !== filters.status) {
          passes = false;
        }
        // Created Date (string comparison works for YYYY-MM-DD)
        if (filters.createdFrom && playlist.created < filters.createdFrom) {
          passes = false;
        }
        if (filters.createdTo && playlist.created > filters.createdTo) {
          passes = false;
        }
        // Modified Date (string comparison works for YYYY-MM-DD)
        if (filters.modifiedFrom && playlist.modified < filters.modifiedFrom) {
          passes = false;
        }
        if (filters.modifiedTo && playlist.modified > filters.modifiedTo) {
          passes = false;
        }

        return passes;
      });
  }, [playlists, searchQuery, filters]);

  // When filters or search query change, go back to the first page
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);


  const paginatedPlaylists = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPlaylists.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPlaylists, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredPlaylists.length / itemsPerPage);

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedPlaylists(paginatedPlaylists.map(p => p.id));
    } else {
      setSelectedPlaylists([]);
    }
  };

  const handleSelectOne = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedPlaylists(prev => [...prev, id]);
    } else {
      setSelectedPlaylists(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const isAllSelected = paginatedPlaylists.length > 0 && selectedPlaylists.length === paginatedPlaylists.length;

  const handleLocalDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
        setDeletingIds(prev => [...prev, id]);
        setTimeout(() => {
            onDelete(id);
        }, 300);
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedPlaylists.length} playlists?`)) {
      setDeletingIds(prev => [...prev, ...selectedPlaylists]);
      setTimeout(() => {
        onBulkDelete(selectedPlaylists);
        setSelectedPlaylists([]);
      }, 300);
    }
  };

  const handleToggleStatusSelected = (newStatus: 'Active' | 'Inactive') => {
     selectedPlaylists.forEach(id => {
        const playlist = playlists.find(p => p.id === id);
        if (playlist && playlist.status !== newStatus) {
          onToggleStatus(playlist);
        }
     });
     setSelectedPlaylists([]);
  }

  return (
    <div className="bg-white shadow-md rounded-lg">
      <PlaylistToolbar 
        selectedCount={selectedPlaylists.length}
        onSearch={setSearchQuery}
        onCreate={onCreate}
        onDeleteSelected={handleDeleteSelected}
        onActivateSelected={() => handleToggleStatusSelected('Active')}
        onDeactivateSelected={() => handleToggleStatusSelected('Inactive')}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
      />
      <PlaylistTable 
        playlists={paginatedPlaylists}
        selectedPlaylists={selectedPlaylists}
        deletingIds={deletingIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        isAllSelected={isAllSelected}
        onEdit={onEdit}
        onPreview={onPreview}
        onDelete={handleLocalDelete}
        onToggleStatus={onToggleStatus}
        onDuplicate={onDuplicate}
      />
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredPlaylists.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(num) => {
            setItemsPerPage(num);
            setCurrentPage(1); // Reset to first page
          }}
        />
      )}
    </div>
  );
};

export default PlaylistManager;