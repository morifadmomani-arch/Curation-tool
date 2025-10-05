import React, { useState, useMemo } from 'react';
import { Role } from '../../types';
import { Icon, SearchIcon, PlusIcon, ChevronLeftIcon } from '../ui/Icons';
import RoleTableRow from './RoleTableRow';

interface ManageRolesProps {
    roles: Role[];
    onBack: () => void;
    onAddRole: () => void;
    onEditRole: (role: Role) => void;
}

const ManageRoles: React.FC<ManageRolesProps> = ({ roles, onBack, onAddRole, onEditRole }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRoles = useMemo(() => {
        return roles
            .filter(role => role.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
    }, [roles, searchQuery]);

    const headers = ['Role name', 'Created on', 'Updated on', 'Actions'];

    return (
        <div className="bg-white shadow-md rounded-lg">
            <div className="flex items-center justify-between p-4 bg-white rounded-t-lg border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100">
                        <Icon svg={ChevronLeftIcon} className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Icon svg={SearchIcon} className="w-5 h-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search roles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                 <button
                    onClick={onAddRole}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Icon svg={PlusIcon} className="w-5 h-5 mr-2" />
                    Create Role
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRoles.map((role) => (
                           <RoleTableRow 
                             key={role.id}
                             role={role}
                             onEdit={onEditRole}
                           />
                        ))}
                    </tbody>
                </table>
                {filteredRoles.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No roles found.</div>
                )}
            </div>
        </div>
    );
};

export default ManageRoles;
