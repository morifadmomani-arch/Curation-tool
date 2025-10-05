import React, { useState, useEffect } from 'react';
import SettingsCard from './SettingsCard';
import ApiKeyInput from './ApiKeyInput';
import { Icon, GlobeAltIcon, PaintBrushIcon, KeyIcon, BellIcon, TrashIcon, RefreshIcon } from '../ui/Icons';

// --- Reusable Form Components ---
// Fix: Added explicit props interface and React.FC type to InputField to ensure correct type inference by TypeScript.
interface InputFieldProps {
    label: string;
    id: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    type?: string;
    disabled?: boolean;
}
const InputField: React.FC<InputFieldProps> = ({ label, id, value, onChange, type = 'text', disabled = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input type={type} id={id} value={value} onChange={onChange as (e: React.ChangeEvent<HTMLInputElement>) => void} disabled={disabled} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100" />
    </div>
);

// Fix: Added explicit props interface and React.FC type to SelectField to resolve "missing children" error.
interface SelectFieldProps {
    label: string;
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    children: React.ReactNode;
    disabled?: boolean;
}
const SelectField: React.FC<SelectFieldProps> = ({ label, id, value, onChange, children, disabled = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <select id={id} value={value} onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void} disabled={disabled} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100">
            {children}
        </select>
    </div>
);

const ToggleSwitch = ({ label, enabled, onChange, description = '' }) => (
    <div className="flex items-center justify-between">
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        <button
            type="button"
            className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
        >
            <span className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
        </button>
    </div>
);


interface SettingsState {
    appName: string;
    timezone: string;
    language: string;
    primaryColor: string;
    darkMode: boolean;
    analyticsKey: string;
    mapServiceKey: string;
    emailOnNewUser: boolean;
    emailOnContentApproval: boolean;
}

const initialSettings: SettingsState = {
    appName: 'CMS Curation Tool',
    timezone: 'UTC-5:00',
    language: 'en',
    primaryColor: '#4f46e5',
    darkMode: false,
    analyticsKey: 'pk_live_123456789abcdefghijklmnopqrstuv',
    mapServiceKey: 'sk_test_987654321zyxwutsrqponmlkjihgfed',
    emailOnNewUser: true,
    emailOnContentApproval: false,
};

const Settings: React.FC = () => {
    const [settings, setSettings] = useState<SettingsState>(initialSettings);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);
        setIsDirty(hasChanges);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setSettings(prev => ({ ...prev, [id]: value }));
    };

    const handleToggle = (id: keyof SettingsState, value: boolean) => {
        setSettings(prev => ({...prev, [id]: value}));
    };
    
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({ ...prev, primaryColor: e.target.value }));
    }

    const handleSave = () => {
        console.log('Saving settings:', settings);
        // Here you would typically make an API call to save the settings
        alert('Settings saved successfully!');
        // Update initialSettings to the new state to reset dirty check
        // In a real app, you might refetch or just update the initial state
        // For this demo, we'll just log it.
        setIsDirty(false);
    };

    const handleDiscard = () => {
        setSettings(initialSettings);
    };

    return (
        <div className="space-y-8 pb-24">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>

            <SettingsCard title="General" description="Basic application-wide settings." icon={GlobeAltIcon}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Application Name" id="appName" value={settings.appName} onChange={handleChange} />
                    <SelectField label="Timezone" id="timezone" value={settings.timezone} onChange={handleChange}>
                        <option>UTC-5:00</option>
                        <option>UTC+0:00</option>
                        <option>UTC+8:00</option>
                    </SelectField>
                    <SelectField label="Language" id="language" value={settings.language} onChange={handleChange}>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                    </SelectField>
                </div>
            </SettingsCard>

            <SettingsCard title="Appearance" description="Customize the look and feel of the application." icon={PaintBrushIcon}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="flex items-center space-x-4">
                        <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">Primary Color</label>
                        <div className="relative">
                             <input type="color" id="primaryColor" value={settings.primaryColor} onChange={handleColorChange} className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer" />
                        </div>
                        <span className="text-sm text-gray-800 font-mono bg-gray-100 px-2 py-1 rounded">{settings.primaryColor}</span>
                    </div>
                    <ToggleSwitch label="Enable Dark Mode" enabled={settings.darkMode} onChange={(val) => handleToggle('darkMode', val)} />
                </div>
            </SettingsCard>
            
            <SettingsCard title="API Keys & Integrations" description="Manage keys for third-party services." icon={KeyIcon}>
                 <div className="space-y-4">
                    <ApiKeyInput label="Analytics Service Key" apiKey={settings.analyticsKey} />
                    <ApiKeyInput label="Map Service Key" apiKey={settings.mapServiceKey} />
                 </div>
            </SettingsCard>

            <SettingsCard title="Notifications" description="Configure when users receive email notifications." icon={BellIcon}>
                <div className="space-y-4">
                    <ToggleSwitch label="New User Registration" description="Send a welcome email when a new user signs up." enabled={settings.emailOnNewUser} onChange={(val) => handleToggle('emailOnNewUser', val)} />
                    <ToggleSwitch label="Content Approval Request" description="Notify admins when content is submitted for approval." enabled={settings.emailOnContentApproval} onChange={(val) => handleToggle('emailOnContentApproval', val)} />
                </div>
            </SettingsCard>
            
            <SettingsCard title="Advanced" description="High-impact and potentially destructive actions." icon={TrashIcon}>
                <div>
                     <label className="block text-sm font-medium text-gray-700">Clear Cache</label>
                     <p className="text-xs text-gray-500 mb-2">Immediately clear all application caches. This might affect performance temporarily.</p>
                     <button className="flex items-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 border border-red-200 text-sm font-medium">
                        <Icon svg={RefreshIcon} className="w-4 h-4 mr-2" />
                        Clear Application Cache
                     </button>
                </div>
            </SettingsCard>

            {isDirty && (
                <div className="fixed bottom-0 left-0 right-0 z-40">
                    <div className="flex justify-center">
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-t-lg shadow-[0_-4px_10px_rgba(0,0,0,0.05)] animate-fade-in-up">
                             <div className="flex items-center space-x-4">
                                <p className="text-sm font-medium text-gray-700">You have unsaved changes.</p>
                                <button onClick={handleDiscard} className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Discard</button>
                                <button onClick={handleSave} className="px-6 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
