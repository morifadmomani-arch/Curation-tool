import React from 'react';

interface DashboardFiltersProps {
    frequency: string;
    onFrequencyChange: (value: string) => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({ frequency, onFrequencyChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
            <label htmlFor="frequency" className="text-sm font-medium text-gray-700">Frequency:</label>
            <select
                id="frequency"
                value={frequency}
                onChange={(e) => onFrequencyChange(e.target.value)}
                className="border border-gray-300 rounded-md p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
            </select>
        </div>
        {/* Placeholder for date range */}
        <div className="flex items-center space-x-2">
            <input type="date" className="border border-gray-300 rounded-md p-1 text-sm" defaultValue="2024-07-01" />
            <span className="text-gray-500">-</span>
            <input type="date" className="border border-gray-300 rounded-md p-1 text-sm" defaultValue="2024-07-31" />
        </div>
      </div>
    </div>
  );
};
export default DashboardFilters;
