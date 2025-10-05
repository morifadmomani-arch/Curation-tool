import React, { useState, useEffect, useMemo } from 'react';
import { User, Role, ALL_MODULES, ALL_PERMISSIONS } from '../../types';
import FormSection from '../ui/FormSection';

// --- Reusable Field Components ---
interface InputFieldProps {
    label: string;
    id: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    type?: string;
    error?: string;
    disabled?: boolean;
}
const InputField: React.FC<InputFieldProps> = ({ label, id, name, value, onChange, required = false, type = 'text', error, disabled = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input 
            type={type} 
            id={id} 
            name={name}
            value={value} 
            onChange={onChange} 
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 sm:text-sm ${error ? 'border-red-500 ring-red-200' : 'border-gray-300 focus:ring-indigo-500'} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`} />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

interface SelectFieldProps {
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
}
const SelectField: React.FC<SelectFieldProps> = ({ label, id, name, value, onChange, children, required = false, disabled = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select id={id} name={name} value={value} onChange={onChange} disabled={disabled} className={`w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}>
            {children}
        </select>
    </div>
);


interface UserFormProps {
    user?: User | null;
    roles: Role[];
    allUsers: User[];
    onCancel: () => void;
    onSave: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, roles, allUsers, onCancel, onSave }) => {
    const isEditMode = !!user;
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        roleId: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
    
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                roleId: user.roleId,
            });
        } else {
            // Set default role if available
            if (roles.length > 0) {
                setFormData(prev => ({...prev, roleId: roles[0].id}));
            }
        }
    }, [user, roles]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof typeof formData, string>> = {};
        if (!formData.username.trim()) newErrors.username = 'Username is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        } else {
            const emailInUse = allUsers.some(u => u.email === formData.email && u.id !== user?.id);
            if (emailInUse) newErrors.email = 'This email is already in use.';
        }
        if (!formData.roleId) newErrors.roleId = 'Role is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = () => {
        if (!validate()) return;
        
        const userToSave: User = {
             ...(user ? user : {
                id: `user-${Date.now()}`,
                status: 'Active' as 'Active' | 'Inactive',
                createdOn: new Date().toISOString(),
                userType: 'Publisher' as 'Content Partner' | 'Publisher',
                projects: ['Production'] as ('Production' | 'Staging')[],
            }),
            // Overwrite the fields managed by the form
            username: formData.username,
            email: formData.email,
            roleId: formData.roleId,
        };
        onSave(userToSave);
    };

    const selectedRolePermissions = useMemo(() => {
        const role = roles.find(r => r.id === formData.roleId);
        return role ? role.permissions : {};
    }, [formData.roleId, roles]);

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
                {isEditMode ? 'Edit User' : 'Create New User Account'}
            </h1>
            
            <div className="space-y-8">
                <FormSection title="User Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="User Name" id="username" name="username" value={formData.username} onChange={handleChange} required error={errors.username} />
                        <InputField label="Email" id="email" name="email" value={formData.email} onChange={handleChange} required error={errors.email} />
                        <SelectField label="Assigned Role" id="roleId" name="roleId" value={formData.roleId} onChange={handleChange} required>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </SelectField>
                    </div>
                </FormSection>

                {formData.roleId && (
                    <FormSection title="Role Permissions Preview">
                        <div className="border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Module</th>
                                        {ALL_PERMISSIONS.map(p => <th key={p} className="px-4 py-2 text-center text-xs font-bold text-gray-500 uppercase">{p}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ALL_MODULES.map(module => {
                                        const permissions = selectedRolePermissions[module] || [];
                                        const hasAll = permissions.includes('All');
                                        return (
                                            <tr key={module}>
                                                <td className="px-4 py-2 font-medium text-sm text-gray-900">{module}</td>
                                                {ALL_PERMISSIONS.map(p => (
                                                    <td key={p} className="px-4 py-2 text-center">
                                                        {(hasAll || permissions.includes(p)) && (
                                                            <span className="text-green-500">✓</span>
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </FormSection>
                )}
            </div>

            <div className="flex justify-end items-center mt-8 pt-6 border-t space-x-3">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300">Cancel</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300" disabled={Object.values(errors).some(e => e)}>
                    {isEditMode ? 'Save Changes' : 'Create User'}
                </button>
            </div>
        </div>
    );
};

export default UserForm;