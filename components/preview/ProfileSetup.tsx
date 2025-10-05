import React, { useState, useRef, useEffect } from 'react';
import { PreviewProfile, User, RouteNode } from '../../types';
import { Icon, PlusIcon, ChevronDownIcon, PencilIcon, TrashIcon } from '../ui/Icons';

interface ProfileSetupProps {
    users: User[];
    selectedPage: RouteNode | null;
    onLoadProfile: (profile: PreviewProfile) => void;
    onSaveProfile: (profile: PreviewProfile) => void;
    onUpdateProfile: (profile: PreviewProfile) => void;
    onDeleteProfile: (userId: string) => void;
}

const initialProfileState: PreviewProfile = {
    userId: 'new',
    username: '',
    country: 'KSA',
    timezone: 'Asia/Riyadh',
    userType: 'Subscriber',
    packageType: 'VIP',
};

// Map a User object to a PreviewProfile object for the form
const userToProfile = (user: User): PreviewProfile => ({
    userId: user.id,
    username: user.username,
    country: 'KSA', // This could be stored on the user object in a real app
    timezone: 'Asia/Riyadh',
    userType: user.userType === 'Publisher' ? 'Subscriber' : 'Registered',
    packageType: 'VIP',
});

interface InputFieldProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}
const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
    </div>
);


interface SelectFieldProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}
const SelectField: React.FC<SelectFieldProps> = ({ label, id, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <select id={id} value={value} onChange={onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            {children}
        </select>
    </div>
);


const ProfileSetup: React.FC<ProfileSetupProps> = ({ users, selectedPage, onLoadProfile, onSaveProfile, onUpdateProfile, onDeleteProfile }) => {
    const [profile, setProfile] = useState<PreviewProfile>(initialProfileState);
    const [isEditing, setIsEditing] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectProfile = (user: User) => {
        setProfile(userToProfile(user));
        setIsEditing(false);
        setIsDropdownOpen(false);
    };
    
    const handleEditProfile = (user: User) => {
        setProfile(userToProfile(user));
        setIsEditing(true);
        setIsDropdownOpen(false);
    };
    
    const handleDeleteProfile = (userId: string, username: string) => {
        if (window.confirm(`Are you sure you want to delete the profile "${username}"?`)) {
            onDeleteProfile(userId);
            if (profile.userId === userId) {
                handleCreateNew(); // Reset form if the active profile was deleted
            }
        }
    };
    
    const handleCreateNew = () => {
        setProfile(initialProfileState);
        setIsEditing(false);
        setIsDropdownOpen(false);
    };
    
    const handleSave = () => {
        if (!profile.username?.trim()) {
            alert("Profile Name is required.");
            return;
        }
        if (isEditing) {
            onUpdateProfile(profile);
        } else {
            onSaveProfile(profile);
        }
        handleCreateNew(); // Reset form after save/update
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setProfile(p => ({...p, [id]: value}));
        // if a manual change happens, it's considered a new or edited profile
        if (profile.userId !== 'new' && !isEditing) {
           setIsEditing(true);
        }
    };

    const getButtonText = () => {
        if (isEditing) return `Editing: ${profile.username}`;
        if (profile.userId !== 'new') return `Selected: ${profile.username}`;
        return 'Create New Profile';
    };

    return (
        <div className="bg-white rounded-lg shadow-md flex flex-col">
            <div className="p-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">Preview Profile</h3>
                <p className="text-sm text-gray-500">Configure a user and select a page to simulate.</p>
            </div>
            <div className="p-4 space-y-4">
                 <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Profile</label>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <span className="block truncate">{getButtonText()}</span>
                        <span className="absolute inset-y-0 right-0 top-6 flex items-center pr-2 pointer-events-none">
                            <Icon svg={ChevronDownIcon} className="h-5 w-5 text-gray-400" />
                        </span>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10 max-h-60 overflow-auto border border-gray-200">
                            <ul className="py-1">
                                <li onClick={handleCreateNew} className="text-gray-900 cursor-pointer select-none relative py-2 px-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-50">
                                    + Create New Profile
                                </li>
                                {users.map(user => (
                                    <li key={user.id} className="group text-gray-900 cursor-pointer select-none relative py-2 pl-4 pr-2 text-sm hover:bg-gray-100 flex justify-between items-center">
                                        <span onClick={() => handleSelectProfile(user)} className="flex-1 truncate">{user.username}</span>
                                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                                            <button onClick={() => handleEditProfile(user)} className="p-1 text-gray-500 hover:text-green-600 rounded-md"><Icon svg={PencilIcon} className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteProfile(user.id, user.username)} className="p-1 text-gray-500 hover:text-red-600 rounded-md"><Icon svg={TrashIcon} className="w-4 h-4" /></button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <hr/>
                
                 <InputField 
                    label="Profile Name"
                    id="username"
                    value={profile.username || ''}
                    onChange={handleChange}
                    placeholder="e.g., KSA Sports Fan"
                 />
                
                <div className="grid grid-cols-2 gap-4">
                    <SelectField label="Country" id="country" value={profile.country} onChange={handleChange}>
                        <option>KSA</option><option>UAE</option><option>EGY</option><option>WW</option>
                    </SelectField>
                    <SelectField label="Timezone" id="timezone" value={profile.timezone} onChange={handleChange}>
                         <option>Asia/Riyadh</option><option>UTC</option><option>America/New_York</option>
                    </SelectField>
                    <SelectField label="User Type" id="userType" value={profile.userType} onChange={handleChange}>
                        <option>Guest</option><option>Registered</option><option>Subscriber</option>
                    </SelectField>
                    <SelectField label="Package" id="packageType" value={profile.packageType} onChange={handleChange}>
                        <option>Free</option><option>VIP</option><option>VIP_SPORTS</option>
                    </SelectField>
                </div>
                 {(isEditing || profile.userId === 'new') && (
                     <button 
                        onClick={handleSave}
                        className="w-full flex items-center justify-center mt-2 px-4 py-2 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 border border-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Icon svg={PlusIcon} className="w-5 h-5 mr-2"/>
                        {isEditing ? 'Update Profile' : 'Save New Profile'}
                    </button>
                )}
            </div>
             <div className="p-4 mt-auto border-t">
                <button 
                    onClick={() => onLoadProfile(profile)}
                    disabled={!selectedPage}
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {selectedPage ? 'Load Profile & Page' : 'Select a Page to Load'}
                </button>
            </div>
        </div>
    );
};

export default ProfileSetup;