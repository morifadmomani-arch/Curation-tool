import React from 'react';
import { Playlist } from '../../types';
import PlaylistTableRow from './PlaylistTableRow';

interface PlaylistTableProps {
  playlists: Playlist[];
  selectedPlaylists: number[];
  deletingIds: number[];
  onSelectAll: (isChecked: boolean) => void;
  onSelectOne: (id: number, isChecked: boolean) => void;
  isAllSelected: boolean;
  onEdit: (playlist: Playlist) => void;
  onPreview: (playlist: Playlist) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (playlist: Playlist) => void;
  onDuplicate: (playlist: Playlist) => void;
}

const PlaylistTable: React.FC<PlaylistTableProps> = ({ 
  playlists, 
  selectedPlaylists, 
  deletingIds,
  onSelectAll, 
  onSelectOne, 
  isAllSelected, 
  onEdit, 
  onPreview,
  onDelete,
  onToggleStatus,
  onDuplicate,
}) => {
  const headers = ['ID', 'Title', 'Description', 'Items', 'Created', 'Modified', 'Status', 'Actions'];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </div>
            </th>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {playlists.map((playlist) => (
            <PlaylistTableRow 
              key={playlist.id} 
              playlist={playlist}
              isSelected={selectedPlaylists.includes(playlist.id)}
              isDeleting={deletingIds.includes(playlist.id)}
              onSelect={onSelectOne}
              onEdit={onEdit}
              onPreview={onPreview}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              onDuplicate={onDuplicate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaylistTable;