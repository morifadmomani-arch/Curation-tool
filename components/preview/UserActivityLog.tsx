import React, { useState, useMemo } from 'react';
import { ActionLog, UserInterestProfile } from '../../types';

interface UserActivityLogProps {
    log: ActionLog[];
    profile: UserInterestProfile;
}

type Tab = 'History' | 'Profile';

const UserActivityLog: React.FC<UserActivityLogProps> = ({ log, profile }) => {
    const [activeTab, setActiveTab] = useState<Tab>('History');

    const sortedProfile = useMemo(() => {
        return Object.entries(profile)
            .filter(([, weight]) => (weight as number) > 0)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 20);
    }, [profile]);
    
    return (
        <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col min-h-0">
            <div className="p-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">User Activity Log</h3>
            </div>
            <div className="border-b border-gray-200">
                <nav className="flex space-x-4 px-4" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('History')}
                        className={`${activeTab === 'History' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                    >
                        Action History
                    </button>
                     <button
                        onClick={() => setActiveTab('Profile')}
                        className={`${activeTab === 'Profile' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                    >
                        Interest Profile
                    </button>
                </nav>
            </div>
            <div className="flex-1 overflow-y-auto p-4 text-sm">
                {activeTab === 'History' && (
                    <ul className="space-y-3">
                        {log.length > 0 ? log.map((entry, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-gray-400 text-xs font-mono mr-2 pt-0.5">{entry.timestamp.toLocaleTimeString()}</span>
                                <p className="text-gray-700">
                                    <span className="font-semibold text-gray-800 capitalize">{entry.action}</span> on <span className="font-semibold text-indigo-600">"{entry.contentTitle}"</span>
                                    {entry.details && <span className="text-gray-500 text-xs ml-1">({entry.details})</span>}
                                </p>
                            </li>
                        )) : (
                            <p className="text-gray-500 text-center py-4">No actions taken yet.</p>
                        )}
                    </ul>
                )}
                {activeTab === 'Profile' && (
                    <div className="space-y-3 pr-2">
                        {sortedProfile.length > 0 ? (() => {
                            const maxWeight = Math.max(...sortedProfile.map(([, weight]) => weight as number), 1);
                            return sortedProfile.map(([key, weight]) => (
                                <div key={key} className="grid grid-cols-12 items-center gap-2 text-xs">
                                    <span className="text-gray-600 capitalize truncate col-span-4">{key.replace(/:/g, ': ')}</span>
                                    <div className="col-span-8">
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div
                                                className="bg-sky-500 h-4 rounded-full flex items-center justify-center text-white font-bold text-[10px] leading-4"
                                                style={{ width: `${Math.max(10, ((weight as number) / maxWeight) * 100)}%` }}
                                            >
                                                {(weight as number).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ));
                        })() : (
                             <p className="text-gray-500 text-center py-4">No user interests detected yet.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserActivityLog;