import React, { useState, Fragment, useEffect } from 'react';
import { RouteNode } from '../../types';
import { Icon, SearchIcon, FolderIcon, DocumentTextIcon, ChevronRightIcon, ChevronDownIcon } from '../ui/Icons';

interface RoutingStructureProps {
    routes: RouteNode[];
    totalEntries: number;
    selectedRoute: RouteNode | null;
    onRouteSelect: (route: RouteNode) => void;
}

const RoutingStructure: React.FC<RoutingStructureProps> = ({ routes, totalEntries, selectedRoute, onRouteSelect }) => {
    const [expandedFolders, setExpandedFolders] = useState<string[]>(['ww']);
    
    useEffect(() => {
        // Set initial selection if none is provided
        if (!selectedRoute && routes.length > 0 && routes[0].children && routes[0].children.length > 0) {
            onRouteSelect(routes[0].children[0]);
        }
    }, [routes, selectedRoute, onRouteSelect]);


    const toggleFolder = (id: string) => {
        setExpandedFolders(prev => prev.includes(id) ? prev.filter(folderId => folderId !== id) : [...prev, id]);
    };
    
    const renderNode = (node: RouteNode, level: number) => {
        const isExpanded = expandedFolders.includes(node.id);
        const isSelected = selectedRoute?.id === node.id;

        return (
            <Fragment key={node.id}>
                <tr 
                    className={`cursor-pointer ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-50'}`} 
                    onClick={() => node.type === 'page' ? onRouteSelect(node) : toggleFolder(node.id)}
                >
                    <td className="py-2.5 px-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                        <div className="flex items-center" style={{ paddingLeft: `${level * 1.5}rem` }}>
                            {node.type === 'folder' && (
                                <Icon svg={isExpanded ? ChevronDownIcon : ChevronRightIcon} className="w-4 h-4 mr-2 text-gray-500" />
                            )}
                            <Icon svg={node.type === 'folder' ? FolderIcon : DocumentTextIcon} className="w-5 h-5 mr-3 text-gray-400" />
                            <span>{node.name}</span>
                        </div>
                    </td>
                    <td className="py-2.5 px-4 text-sm text-center">
                        {node.status && (
                             <div className={`w-3 h-3 rounded-full mx-auto ${node.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        )}
                    </td>
                    <td className="py-2.5 px-4 text-sm text-gray-500 text-right">{node.count}</td>
                </tr>
                {isExpanded && node.children?.map(child => renderNode(child, level + 1))}
            </Fragment>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800">Carousals Builder</h2>
                <p className="text-sm text-gray-500">{totalEntries} Entries Found</p>
            </div>
            <div className="p-4 border-t">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Routers</h3>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Icon svg={SearchIcon} className="w-5 h-5 text-gray-400" />
                    </span>
                    <input type="text" placeholder="Search routes..." className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="py-2 px-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Folder Name / Page</th>
                            <th className="py-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-2 px-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Number</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {routes.map(node => renderNode(node, 0))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoutingStructure;
