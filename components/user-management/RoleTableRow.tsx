import React from 'react';
import { Role } from '../../types';
import Tooltip from '../ui/Tooltip';
import { Icon, PencilIcon } from '../ui/Icons';

interface RoleTableRowProps {
    role: Role;
    onEdit: (role: Role) => void;
}

const RoleTableRow: React.FC<RoleTableRowProps> = ({ role, onEdit }) => {
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(role.createdOn)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(role.updatedOn)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center">
                    <Tooltip text="Edit">
                        <button onClick={() => onEdit(role)} className="text-gray-400 hover:text-green-600">
                            <Icon svg={PencilIcon} className="w-5 h-5" />
                        </button>
                    </Tooltip>
                </div>
            </td>
        </tr>
    );
};

export default RoleTableRow;
