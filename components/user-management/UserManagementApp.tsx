import React, { useState } from 'react';
import { User, Role } from '../../types';
import AdminUsers from './AdminUsers';
import ManageRoles from './ManageRoles';
import UserForm from './UserForm';
import RoleForm from './RoleForm';

interface UserManagementAppProps {
    users: User[];
    roles: Role[];
    onSaveUser: (user: User) => void;
    onUpdateUserStatus: (userId: string, status: 'Active' | 'Inactive') => void;
    onSaveRole: (role: Role) => void;
}

type UserManagementView = 'usersList' | 'rolesList' | 'userForm' | 'roleForm';

const UserManagementApp: React.FC<UserManagementAppProps> = (props) => {
    const [view, setView] = useState<UserManagementView>('usersList');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const handleNavigate = (targetView: UserManagementView) => {
        setSelectedUser(null);
        setSelectedRole(null);
        setView(targetView);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setView('userForm');
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        setView('userForm');
    };

    const handleAddRole = () => {
        setSelectedRole(null);
        setView('roleForm');
    };

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        setView('roleForm');
    };

    const handleSaveUser = (user: User) => {
        props.onSaveUser(user);
        handleNavigate('usersList');
    };

    const handleSaveRole = (role: Role) => {
        props.onSaveRole(role);
        handleNavigate('rolesList');
    };


    const renderContent = () => {
        switch (view) {
            case 'usersList':
                return (
                    <AdminUsers
                        users={props.users}
                        roles={props.roles}
                        onAddUser={handleAddUser}
                        onEditUser={handleEditUser}
                        onManageRoles={() => handleNavigate('rolesList')}
                        onUpdateUserStatus={props.onUpdateUserStatus}
                    />
                );
            case 'rolesList':
                return (
                    <ManageRoles
                        roles={props.roles}
                        onBack={() => handleNavigate('usersList')}
                        onAddRole={handleAddRole}
                        onEditRole={handleEditRole}
                    />
                );
            case 'userForm':
                return (
                    <UserForm
                        user={selectedUser}
                        roles={props.roles}
                        allUsers={props.users}
                        onCancel={() => handleNavigate('usersList')}
                        onSave={handleSaveUser}
                    />
                );
            case 'roleForm':
                 return (
                    <RoleForm
                        role={selectedRole}
                        allRoles={props.roles}
                        onCancel={() => handleNavigate('rolesList')}
                        onSave={handleSaveRole}
                    />
                );
            default:
                return null;
        }
    };

    return <>{renderContent()}</>;
};

export default UserManagementApp;
