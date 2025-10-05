
import React from 'react';
import { Icon, SearchIcon, DashboardIcon, PlaylistIcon, CarouselIcon, RecIcon, PreviewIcon, UserGroupIcon, CogIcon } from '../ui/Icons';

const navItems = [
  { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
  { id: 'playlist', name: 'Playlist Manager', icon: PlaylistIcon },
  { id: 'carousel', name: 'Carousel Builder', icon: CarouselIcon },
  { id: 'recommendation', name: 'Recommendation Config', icon: RecIcon },
  { id: 'preview', name: 'Preview Tool', icon: PreviewIcon },
  { id: 'users', name: 'User Management', icon: UserGroupIcon },
  { id: 'settings', name: 'Settings', icon: CogIcon },
];

interface SidebarProps {
  activeView: string;
  onNavChange: (view: string) => void;
}


const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavChange }) => {
  return (
    <div className="flex flex-col w-64 bg-gray-800 text-gray-300">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">CMS Curation</h1>
      </div>
      <div className="p-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
             <Icon svg={SearchIcon} className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Content Manager"
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
          />
        </div>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = item.id === activeView;
          return (
            <button
              key={item.name}
              onClick={() => onNavChange(item.id)}
              className={`flex items-center w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon svg={item.icon} className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
