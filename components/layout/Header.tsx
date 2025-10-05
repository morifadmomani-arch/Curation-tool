import React, { useState, useRef, useEffect } from 'react';
import { Icon, SearchIcon, UserCircleIcon, CogIcon, ChevronDownIcon } from '../ui/Icons';

interface HeaderProps {
  onNavChange?: (view: string) => void; // Made optional to avoid breaking MainLayout
}

const Header: React.FC<HeaderProps> = ({ onNavChange }) => {
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

  const handleAdminUsersClick = () => {
    if(onNavChange) {
      onNavChange('admin-users');
    }
    setIsDropdownOpen(false);
  }

  return (
    <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon svg={SearchIcon} className="w-5 h-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
           <Icon svg={UserCircleIcon} className="w-7 h-7 text-gray-600" />
           <Icon svg={ChevronDownIcon} className="w-4 h-4 text-gray-600" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in-down">
              <button
                onClick={handleAdminUsersClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Admin Users
              </button>
              <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Log Out
              </a>
            </div>
          )}
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <Icon svg={CogIcon} className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
};

export default Header;