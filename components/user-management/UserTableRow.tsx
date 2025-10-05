import React, { useState } from 'react';
import { User } from '../../types';
import Tooltip from '../ui/Tooltip';
import { Icon, PencilIcon, PowerIcon } from '../ui/Icons';
import Modal from '../ui/Modal';


interface UserTableRowProps {
    user: User;
    roleName: string;
    onEdit: (user: User) => void;
    onUpdateStatus: (userId: string, status: 'Active' | 'Inactive') => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({ user, roleName, onEdit, onUpdateStatus }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const statusIsActive = user.status === 'Active';
    const newStatus = statusIsActive ? 'Inactive' : 'Active';
    const actionVerb = statusIsActive ? 'Deactivate' : 'Activate';

    const getStatusBadge = () => {
        return statusIsActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                Active
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-yellow-400" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" /></svg>
                Inactive
            </span>
        );
    };
    
    const handleStatusUpdate = () => {
        onUpdateStatus(user.id, newStatus);
        setIsModalOpen(false);
    };

    const modalFooter = (
        <>
            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm bg-white text-gray-700 rounded-md hover:bg-gray-100 border">
                Cancel
            </button>
            <button onClick={handleStatusUpdate} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Update
            </button>
        </>
    );

    return (
        <>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{roleName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                        <Tooltip text="Edit">
                            <button onClick={() => onEdit(user)} className="text-gray-400 hover:text-green-600">
                                <Icon svg={PencilIcon} className="w-5 h-5" />
                            </button>
                        </Tooltip>
                        <Tooltip text={actionVerb}>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className={`text-gray-400 ${statusIsActive ? 'hover:text-yellow-600' : 'hover:text-green-600'}`}
                            >
                                <Icon svg={PowerIcon} className="w-5 h-5" />
                            </button>
                        </Tooltip>
                    </div>
                </td>
            </tr>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirm Status Update"
                footer={modalFooter}
            >
                <p>Are you sure you want to update the status to <span className="font-semibold">{newStatus}</span>?</p>
            </Modal>
        </>
    );
};

export default UserTableRow;
