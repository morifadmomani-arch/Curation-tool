import React, { DragEvent } from 'react';
import { Carousel } from '../../types';
import Tooltip from '../ui/Tooltip';
import { Icon, EyeIcon, PencilIcon, DuplicateIcon, PowerIcon, TrashIcon, MoveIcon } from '../ui/Icons';


interface CarouselRowProps {
    carousel: Carousel;
    isSelected: boolean;
    isDeleting?: boolean;
    onSelect: (id: string, isChecked: boolean) => void;
    dragOverId: string | null;
    onDragStart: (e: DragEvent<HTMLTableRowElement>, id: string) => void;
    onDragOver: (e: DragEvent<HTMLTableRowElement>, id: string) => void;
    onDrop: (e: DragEvent<HTMLTableRowElement>, id: string) => void;
    onDragEnd: (e: DragEvent<HTMLTableRowElement>) => void;
    onEdit: (carousel: Carousel) => void;
    onPreview: (carousel: Carousel) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
    onDuplicate: (carousel: Carousel) => void;
}

const CarouselRow: React.FC<CarouselRowProps> = (props) => {
  const { 
      carousel, isSelected, isDeleting, onSelect, dragOverId, onDragStart, onDragOver, onDrop, onDragEnd,
      onEdit, onPreview, onDelete, onToggleStatus, onDuplicate
  } = props;

  const statusIsActive = carousel.status === 'Active';
  
  const getStatusBadge = () => {
    switch (carousel.status) {
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

  const handleDeleteClick = () => {
    onDelete(carousel.id);
  };

    return (
        <tr 
            className={`text-sm ${dragOverId === carousel.id ? 'border-t-2 border-blue-500' : ''} ${isDeleting ? 'fade-out' : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, carousel.id)}
            onDragOver={(e) => onDragOver(e, carousel.id)}
            onDrop={(e) => onDrop(e, carousel.id)}
            onDragEnd={onDragEnd}
        >
             <td className="p-4">
                <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={isSelected}
                    onChange={(e) => onSelect(carousel.id, e.target.checked)}
                />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-500">{carousel.id}</td>
            <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">{carousel.editorialName}</td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-500">{carousel.type}</td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-500">{carousel.position}</td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-500">{carousel.items}</td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-500 capitalize">{carousel.platforms.join(', ')}</td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-500">{carousel.recommendationType}</td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-500">{carousel.avodSvod}</td>
            <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge()}</td>
            <td className="px-4 py-3 whitespace-nowrap text-center">
                 <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={carousel.pinned}
                    readOnly
                />
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-3">
                    <Tooltip text="Move">
                        <button className="text-gray-400 hover:text-gray-700 cursor-move">
                            <Icon svg={MoveIcon} className="w-5 h-5" />
                        </button>
                    </Tooltip>
                    <Tooltip text="Preview">
                        <button onClick={() => onPreview(carousel)} className="text-gray-400 hover:text-indigo-600">
                            <Icon svg={EyeIcon} className="w-5 h-5" />
                        </button>
                    </Tooltip>
                    <Tooltip text="Edit">
                        <button onClick={() => onEdit(carousel)} className="text-gray-400 hover:text-green-600">
                            <Icon svg={PencilIcon} className="w-5 h-5" />
                        </button>
                    </Tooltip>
                    <Tooltip text="Duplicate">
                        <button onClick={() => onDuplicate(carousel)} className="text-gray-400 hover:text-blue-600">
                            <Icon svg={DuplicateIcon} className="w-5 h-5" />
                        </button>
                    </Tooltip>
                    <Tooltip text={statusIsActive ? 'Deactivate' : 'Activate'}>
                        <button onClick={() => onToggleStatus(carousel.id)} className={`text-gray-400 ${statusIsActive ? 'hover:text-yellow-600' : 'hover:text-green-600'}`}>
                            <Icon svg={PowerIcon} className="w-5 h-5" />
                        </button>
                    </Tooltip>
                    <Tooltip text="Delete">
                        <button onClick={handleDeleteClick} className="text-gray-400 hover:text-red-600">
                            <Icon svg={TrashIcon} className="w-5 h-5" />
                        </button>
                    </Tooltip>
                </div>
            </td>
        </tr>
    );
};

export default CarouselRow;