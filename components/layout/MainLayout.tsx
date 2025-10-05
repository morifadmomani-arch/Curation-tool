import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavChange: (view: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, activeView, onNavChange }) => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar activeView={activeView} onNavChange={onNavChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNavChange={onNavChange} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
