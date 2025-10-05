import React, { useState, useEffect } from 'react';
import { Role, Module, Permission, ALL_MODULES, ALL_PERMISSIONS } from '../../types';
import FormSection from '../ui/FormSection';

interface RoleFormProps {
    role?: Role | null;
    allRoles: Role[];
    onCancel: () => void;
    onSave: (role: Role) => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, allRoles, onCancel, onSave }) => {
    const isEditMode = !!role;
    const [roleName, setRoleName] = useState('');
    const [permissions, setPermissions] = useState<Partial<Record<Module, Permission[]>>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (role) {
            setRoleName(role.name);
            setPermissions(role.permissions);
        }
    }, [role]);

    const handlePermissionChange = (module: Module, permission: Permission, isChecked: boolean) => {
        setPermissions(prev => {
            const newPermissions = { ...prev };
            let modulePermissions = newPermissions[module] || [];

            if (isChecked) {
                modulePermissions.push(permission);
            } else {
                modulePermissions = modulePermissions.filter(p => p !== permission && p !== 'All');
            }
            newPermissions[module] = [...new Set(modulePermissions)]; // Ensure uniqueness
            return newPermissions;
        });
    };

    const handleAllPermissionChange = (module: Module, isChecked: boolean) => {
        setPermissions(prev => ({
            ...prev,
            [module]: isChecked ? ['All'] : [],
        }));
    };

    const validate = (): boolean => {
        if (!roleName.trim()) {
            setError('Role Name is required.');
            return false;
        }
        const nameInUse = allRoles.some(r => r.name.toLowerCase() === roleName.trim().toLowerCase() && r.id !== role?.id);
        if (nameInUse) {
            setError('This role name is already in use.');
            return false;
        }
        setError(null);
        return true;
    };
    
    const handleSubmit = () => {
        if (!validate()) return;

        const roleToSave: Role = {
            id: role?.id || `role-${Date.now()}`,
            name: roleName.trim(),
            permissions: permissions,
            createdOn: role?.createdOn || new Date().toISOString(),
            updatedOn: new Date().toISOString(),
        };
        onSave(roleToSave);
    };

    // FIX: Refactored to be more type-safe and readable by checking if any permission arrays have content.
    const hasPermissions = Object.values(permissions).some(p => Array.isArray(p) && p.length > 0);
    const isSaveDisabled = !roleName.trim() || !hasPermissions;

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
                {isEditMode ? 'Edit Role' : 'Create New Role'}
            </h1>
            
            <FormSection title="Role Details">
                <div>
                    <label htmlFor="roleName" className="block text-sm font-medium text-gray-700 mb-1">
                        Role Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="roleName"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        className={`w-full max-w-md px-3 py-2 border rounded-md focus:outline-none focus:ring-2 sm:text-sm ${error ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-indigo-500'}`}
                    />
                    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
                </div>
            </FormSection>

            <FormSection title="Permissions">
                <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Module</th>
                                {ALL_PERMISSIONS.map(p => <th key={p} className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">{p}</th>)}
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">All</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {ALL_MODULES.map(module => {
                               const modulePermissions = permissions[module] || [];
                               const hasAll = modulePermissions.includes('All');
                               return (
                                   <tr key={module}>
                                        <td className="px-4 py-3 font-medium text-sm text-gray-900">{module}</td>
                                        {ALL_PERMISSIONS.map(p => (
                                            <td key={p} className="px-4 py-3 text-center">
                                                <input type="checkbox" disabled={hasAll} checked={hasAll || modulePermissions.includes(p)} onChange={(e) => handlePermissionChange(module, p, e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:bg-gray-200" />
                                            </td>
                                        ))}
                                        <td className="px-4 py-3 text-center">
                                            <input type="checkbox" checked={hasAll} onChange={(e) => handleAllPermissionChange(module, e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                                        </td>
                                   </tr>
                               );
                           })}
                        </tbody>
                    </table>
                </div>
            </FormSection>

            <div className="flex justify-end items-center mt-8 pt-6 border-t space-x-3">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300">Cancel</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300" disabled={isSaveDisabled}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default RoleForm;
