import React from 'react';
import { Icon, DesktopComputerIcon, TvIcon, DevicePhoneMobileIcon } from '../ui/Icons';
import Tooltip from '../ui/Tooltip';

type DeviceView = 'desktop' | 'tv' | 'mobile';

interface DeviceToggleProps {
  activeView: DeviceView;
  onChangeView: (view: DeviceView) => void;
}

const devices: { id: DeviceView; name: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
    { id: 'desktop', name: 'Desktop', icon: DesktopComputerIcon },
    { id: 'tv', name: 'TV', icon: TvIcon },
    { id: 'mobile', name: 'Mobile', icon: DevicePhoneMobileIcon },
];

const DeviceToggle: React.FC<DeviceToggleProps> = ({ activeView, onChangeView }) => {
  return (
    <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
      {devices.map((device) => (
        <Tooltip text={device.name} key={device.id}>
            <button
                onClick={() => onChangeView(device.id)}
                className={`px-3 py-1.5 rounded-md transition-colors text-sm font-medium flex items-center ${
                    activeView === device.id
                    ? 'bg-white text-indigo-600 shadow'
                    : 'text-gray-600 hover:bg-white/60'
                }`}
            >
                <Icon svg={device.icon} className="w-5 h-5" />
            </button>
        </Tooltip>
      ))}
    </div>
  );
};

export default DeviceToggle;