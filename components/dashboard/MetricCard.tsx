import React from 'react';
import { Icon, InformationCircleIcon } from '../ui/Icons';

interface MetricCardProps {
    title: string;
    value: string;
    description: string;
    tooltip: string;
    isLoading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, tooltip, isLoading = false }) => {

    if (isLoading) {
        return (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 col-span-1">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 col-span-1">
            <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium text-gray-600">{title}</h4>
                <div className="relative group">
                    <Icon svg={InformationCircleIcon} className="w-4 h-4 text-gray-400" />
                    <div className="absolute bottom-full mb-2 w-max max-w-xs px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        {tooltip}
                    </div>
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
    );
};
export default MetricCard;