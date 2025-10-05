import React from 'react';
import { Playlist } from '../../types';
import Tooltip from '../ui/Tooltip';
import { Icon, EyeIcon, PencilIcon, DuplicateIcon, PowerIcon, TrashIcon } from '../ui/Icons';

interface PlaylistTableRowProps {
  playlist: Playlist;
  isSelected: boolean;
  isDeleting?: boolean;
  onSelect: (id: number, isChecked: boolean) => void;
  onEdit: (playlist: Playlist) => void;
  onPreview: (playlist: Playlist) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (playlist: Playlist) => void;
  onDuplicate: (playlist: Playlist) => void;
}

const PlaylistTableRow: React.FC<PlaylistTableRowProps> = ({ 
  playlist, 
  isSelected, 
  isDeleting,
  onSelect, 
  onEdit, 
  onPreview,
  onDelete,
  onToggleStatus,
  onDuplicate
}) => {
  
  const statusIsActive = playlist.status === 'Active';
  
  const getStatusBadge = () => {
    switch (playlist.status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
            Active
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
            Inactive
          </span>
        );
      case 'Draft':
        return (
           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-blue-400" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    // The date string is in YYYY-MM-DD format, which is parsed as UTC.
    // Adding a time and 'Z' ensures it's treated as UTC, then toLocaleDateString handles the user's timezone correctly.
    const date = new Date(`${dateString}T00:00:00Z`);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
  };


  return (
    <tr className={`hover:bg-gray-50 ${isDeleting ? 'fade-out' : ''}`}>
      <td className="p-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            checked={isSelected}
            onChange={(e) => onSelect(playlist.id, e.target.checked)}
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{playlist.id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{playlist.title}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{playlist.description}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{playlist.items}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(playlist.created)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(playlist.modified)}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-3">
          <Tooltip text="Preview">
            <button onClick={() => onPreview(playlist)} className="text-gray-400 hover:text-indigo-600">
              <Icon svg={EyeIcon} className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip text="Edit">
            <button onClick={() => onEdit(playlist)} className="text-gray-400 hover:text-green-600">
              <Icon svg={PencilIcon} className="w-5 h-5" />
            </button>
          </Tooltip>
           <Tooltip text="Duplicate">
            <button onClick={() => onDuplicate(playlist)} className="text-gray-400 hover:text-blue-600">
              <Icon svg={DuplicateIcon} className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip text={statusIsActive ? 'Deactivate' : 'Activate'}>
            <button onClick={() => onToggleStatus(playlist)} className={`text-gray-400 ${statusIsActive ? 'hover:text-yellow-600' : 'hover:text-green-600'}`}>
               <Icon svg={PowerIcon} className="w-5 h-5" />
            </button>
          </Tooltip>
          <Tooltip text="Delete">
            <button onClick={() => onDelete(playlist.id)} className="text-gray-400 hover:text-red-600">
              <Icon svg={TrashIcon} className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </td>
    </tr>
  );
};

export default PlaylistTableRow;