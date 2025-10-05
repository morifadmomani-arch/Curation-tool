import React from 'react';
import { Icon } from '../ui/Icons';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  children: React.ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, icon, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-50 rounded-lg">
                    <Icon svg={icon} className="w-6 h-6 text-indigo-600" />
                </div>
            </div>
            <div>
                <h2 className="text-lg font-bold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
        </div>
      </div>
      <div className="p-6 bg-gray-50/50">
        {children}
      </div>
    </div>
  );
};

export default SettingsCard;
