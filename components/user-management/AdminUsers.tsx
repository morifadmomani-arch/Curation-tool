import React, { useState, useMemo } from 'react';
import { User, Role } from '../../types';
import { Icon, SearchIcon, PlusIcon, UsersIcon } from '../ui/Icons';
import UserTableRow from './UserTableRow';
import TableFilter from './TableFilter';

interface AdminUsersProps {
    users: User[];
    roles: Role[];
    onAddUser: () => void;
    onEditUser: (user: User) => void;
    onManageRoles: () => void;
    onUpdateUserStatus: (userId: string, status: 'Active' | 'Inactive') => void;
}

const AdminUsers: React.FC<AdminUsersProps> = (props) => {
    const { users, roles, onAddUser, onEditUser, onManageRoles, onUpdateUserStatus } = props;
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [roleFilter, setRoleFilter] = useState('All');

    const roleMap = useMemo(() => new Map(roles.map(r => [r.id, r.name])), [roles]);
    const roleOptions = [{value: 'All', label: 'All'}, ...roles.map(r => ({ value: r.id, label: r.name }))];
    const statusOptions = [{value: 'All', label: 'All'}, {value: 'Active', label: 'Active'}, {value: 'Inactive', label: 'Inactive'}];

    const filteredUsers = useMemo(() => {
        return users
            .filter(user => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(user => statusFilter === 'All' || user.status === statusFilter)
            .filter(user => roleFilter === 'All' || user.roleId === roleFilter)
            .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime());
    }, [users, searchQuery, statusFilter, roleFilter]);


    const headers = ['Usernames', 'Emails', 'Roles', 'Status', 'Actions'];

    return (
        <div className="bg-white shadow-md rounded-lg">
            <div className="flex items-center justify-between p-4 bg-white rounded-t-lg border-b border-gray-200">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon svg={SearchIcon} className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onManageRoles}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Icon svg={UsersIcon} className="w-5 h-5 mr-2" />
                        Manage Roles
                    </button>
                    <button
                        onClick={onAddUser}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Icon svg={PlusIcon} className="w-5 h-5 mr-2" />
                        Add New User
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {headers.map((header) => (
                                <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        {header}
                                        {header === 'Roles' && <TableFilter options={roleOptions} value={roleFilter} onChange={setRoleFilter} />}
                                        {header === 'Status' && <TableFilter options={statusOptions} value={statusFilter} onChange={setStatusFilter} />}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                           <UserTableRow 
                             key={user.id}
                             user={user}
                             roleName={roleMap.get(user.roleId) || 'Unknown Role'}
                             onEdit={onEditUser}
                             onUpdateStatus={onUpdateUserStatus}
                           />
                        ))}
                    </tbody>
                </table>
                 {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No users found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
