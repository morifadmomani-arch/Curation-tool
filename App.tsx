import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import PlaylistApp from './PlaylistApp';
import CarouselBuilder from './components/carousel/CarouselBuilder';
import Dashboard from './components/dashboard/Dashboard';
import UserManagementApp from './components/user-management/UserManagementApp';
import Settings from './components/settings/Settings';
import PreviewTool from './components/preview/PreviewTool';
import { RouteNode, Carousel, User, Role, Module, ALL_MODULES, PreviewProfile } from './types';
import { MOCK_CONTENT_ITEMS } from './mockData';

type AppView = 'playlist' | 'carousel' | 'dashboard' | 'recommendation' | 'preview' | 'users' | 'settings' | 'admin-users';

// --- Mocks & Helpers ---
const MOCK_ROUTES_INITIAL: RouteNode[] = [
    { id: 'ww', type: 'folder', name: 'WW', count: 2, parentId: null, children: [
        { id: 'ww-home', type: 'page', name: 'Home', status: 'active', count: 0, parentId: 'ww' },
        { id: 'ww-movie', type: 'page', name: 'Movie', status: 'inactive', count: 0, parentId: 'ww' },
    ]},
    { id: 'ksa', type: 'folder', name: 'KSA', count: 3, parentId: null, children: []},
    { id: 'gcc', type: 'folder', name: 'GCC', count: 3, parentId: null, children: []},
    { id: 'uae', type: 'folder', name: 'UAE', count: 3, parentId: null, children: []},
];

const MOCK_INITIAL_ROLES: Role[] = [
    {
        id: 'role-1',
        name: 'All permissions',
        permissions: ALL_MODULES.reduce((acc, module) => {
            acc[module] = ['All'];
            return acc;
        }, {} as Record<Module, ('All'|'Create'|'Read'|'Update'|'Delete')[]>),
        createdOn: '2023-01-01T10:00:00Z',
        updatedOn: '2023-01-01T10:00:00Z',
    },
    {
        id: 'role-2',
        name: 'Content Manager',
        permissions: {
            'Dashboard': ['Read'],
            'Playlist Manager': ['All'],
            'Carousel Builder': ['All'],
            'Preview Tool': ['Read', 'Update'],
        },
        createdOn: '2023-01-02T11:00:00Z',
        updatedOn: '2023-05-10T14:00:00Z',
    },
    {
        id: 'role-3',
        name: 'Content Creator',
        permissions: {
            'Playlist Manager': ['Create', 'Read'],
            'Carousel Builder': ['Create', 'Read'],
        },
        createdOn: '2023-01-03T12:00:00Z',
        updatedOn: '2023-01-03T12:00:00Z',
    },
    {
        id: 'role-4',
        name: 'Read Only',
        permissions: ALL_MODULES.reduce((acc, module) => {
            acc[module] = ['Read'];
            return acc;
        }, {} as Record<Module, ('Read')[]>),
        createdOn: '2023-01-04T13:00:00Z',
        updatedOn: '2023-06-01T09:00:00Z',
    },
];

const MOCK_INITIAL_USERS: User[] = [
    { id: 'user-1', username: 'john.doe', email: 'john.doe@example.com', roleId: 'role-1', status: 'Active', userType: 'Publisher', projects: ['Production', 'Staging'], createdOn: '2023-02-15T10:00:00Z' },
    { id: 'user-2', username: 'jane.smith', email: 'jane.smith@example.com', roleId: 'role-2', status: 'Active', userType: 'Content Partner', projects: ['Production'], createdOn: '2023-03-20T11:30:00Z' },
    { id: 'user-3', username: 'peter.jones', email: 'peter.jones@example.com', roleId: 'role-3', status: 'Inactive', userType: 'Publisher', projects: ['Staging'], createdOn: '2023-04-10T09:00:00Z' },
    { id: 'user-4', username: 'susan.williams', email: 'susan.williams@example.com', roleId: 'role-4', status: 'Active', userType: 'Content Partner', projects: ['Production'], createdOn: '2023-05-01T14:20:00Z' },
];

// Recursive helper to update counts
const updateNodeCount = (nodes: RouteNode[], nodeId: string, parentId: string | null | undefined, change: number): RouteNode[] => {
    return nodes.map(node => {
        let newNode = { ...node };
        if (newNode.id === nodeId || (parentId && newNode.id === parentId)) {
            newNode.count = Math.max(0, (newNode.count || 0) + change);
        }
        if (newNode.children && newNode.children.length > 0) {
            newNode.children = updateNodeCount(newNode.children, nodeId, parentId, change);
        }
        return newNode;
    });
};

// Helper to find a route node by its ID
const findRouteById = (nodes: RouteNode[], id: string): RouteNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findRouteById(node.children, id);
            if (found) return found;
        }
    }
    return null;
}


const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('dashboard');
  
  // --- Carousel State Lifted to App Level for Persistence ---
  const [routes, setRoutes] = useState<RouteNode[]>(MOCK_ROUTES_INITIAL);
  const [carouselsByRoute, setCarouselsByRoute] = useState<Record<string, Carousel[]>>({});
  const [totalEntries, setTotalEntries] = useState(0);

  // --- User Management State ---
  const [users, setUsers] = useState<User[]>(MOCK_INITIAL_USERS);
  const [roles, setRoles] = useState<Role[]>(MOCK_INITIAL_ROLES);

  const handleCreateCarousel = (carouselData: Omit<Carousel, 'modified' | 'position'>, route: RouteNode) => {
    const currentCarousels = carouselsByRoute[route.id] || [];
    
    const newCarousel: Carousel = {
        ...carouselData,
        position: 1, // Always at the top
        modified: new Date().toISOString().split('T')[0],
    };

    const updatedCarousels = [newCarousel, ...currentCarousels].map((c, index) => ({
        ...c,
        position: index + 1,
    }));

    setCarouselsByRoute(prev => ({
        ...prev,
        [route.id]: updatedCarousels
    }));
    
    setRoutes(prevRoutes => updateNodeCount(prevRoutes, route.id, route.parentId, 1));
    
    setTotalEntries(prev => prev + 1);
  };

  const handleUpdateCarousel = (updatedCarousel: Carousel, routeId: string) => {
    setCarouselsByRoute(prev => ({
      ...prev,
      [routeId]: (prev[routeId] || []).map(c => c.id === updatedCarousel.id ? { ...updatedCarousel, modified: new Date().toISOString().split('T')[0] } : c)
    }));
  };

  const handleDeleteCarousel = (id: string, routeId: string) => {
    const route = findRouteById(routes, routeId);
    if (!route) return;

    setCarouselsByRoute(prev => ({
      ...prev,
      [routeId]: (prev[routeId] || []).filter(c => c.id !== id)
    }));

    setTotalEntries(prev => prev - 1);
    setRoutes(prevRoutes => updateNodeCount(prevRoutes, routeId, route.parentId, -1));
  };
  
  const handleToggleCarouselStatus = (id: string, routeId: string) => {
     setCarouselsByRoute(prev => ({
      ...prev,
      [routeId]: (prev[routeId] || []).map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c)
    }));
  };
  
  const handleDuplicateCarousel = (carouselToDuplicate: Carousel, routeId: string) => {
    const route = findRouteById(routes, routeId);
    if (!route) return;

    const newEditorialName = `${carouselToDuplicate.editorialName} (Copy)`;

    const newCarousel: Carousel = {
      ...carouselToDuplicate,
      id: `${Date.now()}`, // Simple unique ID for demo
      editorialName: newEditorialName,
      position: (carouselsByRoute[routeId]?.length || 0) + 1,
      status: 'Draft',
      // Deep copy variants and update the first variant's name
      variants: carouselToDuplicate.variants.map((v, index) => ({
        ...v,
        id: `variant-${Date.now()}-${index}`,
        editorialName: index === 0 ? newEditorialName : v.editorialName,
      })),
    };
    
    setCarouselsByRoute(prev => ({
      ...prev,
      [routeId]: [...(prev[routeId] || []), newCarousel]
    }));

    setTotalEntries(prev => prev + 1);
    setRoutes(prevRoutes => updateNodeCount(prevRoutes, routeId, route.parentId, 1));
  };

  const handleBulkDeleteCarousels = (ids: string[], routeId: string) => {
    const route = findRouteById(routes, routeId);
    if (!route) return;

    const currentCarousels = carouselsByRoute[routeId] || [];
    const updatedCarousels = currentCarousels.filter(c => !ids.includes(c.id));

    setCarouselsByRoute(prev => ({
        ...prev,
        [routeId]: updatedCarousels
    }));

    const numDeleted = ids.length;
    setTotalEntries(prev => prev - numDeleted);
    setRoutes(prevRoutes => updateNodeCount(prevRoutes, routeId, route.parentId, -numDeleted));
  };

  const handleBulkToggleCarouselStatus = (ids: string[], routeId: string, status: 'Active' | 'Inactive') => {
    const currentCarousels = carouselsByRoute[routeId] || [];
    const updatedCarousels = currentCarousels.map(c => 
        ids.includes(c.id) ? { ...c, status } : c
    );

    setCarouselsByRoute(prev => ({
        ...prev,
        [routeId]: updatedCarousels
    }));
  };
  
  const handleReorderCarousels = (routeId: string, sourceId: string, destinationId: string) => {
    const carousels = [...(carouselsByRoute[routeId] || [])];
    const sourceIndex = carousels.findIndex(c => c.id === sourceId);
    const destinationIndex = carousels.findIndex(c => c.id === destinationId);

    if (sourceIndex === -1 || destinationIndex === -1) return;

    const [removed] = carousels.splice(sourceIndex, 1);
    carousels.splice(destinationIndex, 0, removed);

    const reorderedCarousels = carousels.map((carousel, index) => ({
      ...carousel,
      position: index + 1,
    }));

    setCarouselsByRoute(prev => ({
      ...prev,
      [routeId]: reorderedCarousels
    }));
  };

  // --- User Management Handlers ---
  const handleSaveUser = (user: User) => {
    setUsers(prevUsers => {
      const exists = prevUsers.some(u => u.id === user.id);
      if (exists) {
        return prevUsers.map(u => u.id === user.id ? user : u);
      }
      return [user, ...prevUsers];
    });
  };

  const handleUpdateUserStatus = (userId: string, status: 'Active' | 'Inactive') => {
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, status } : u));
  };

  const handleSaveRole = (role: Role) => {
    setRoles(prevRoles => {
        const exists = prevRoles.some(r => r.id === role.id);
        if (exists) {
            return prevRoles.map(r => r.id === role.id ? { ...role, updatedOn: new Date().toISOString() } : r);
        }
        return [role, ...prevRoles];
    });
  };

  const handleSaveUserProfile = (profile: PreviewProfile) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: profile.username || `preview-${profile.country.toLowerCase()}-${profile.userType.toLowerCase().replace(' ', '')}`,
      email: `preview-${Date.now()}@example.com`,
      roleId: 'role-3', // Assign a default role, e.g., 'Content Creator'
      status: 'Active',
      // A simple mapping from PreviewProfile userType to User userType
      userType: profile.userType === 'Subscriber' ? 'Publisher' : 'Content Partner',
      projects: ['Production'],
      createdOn: new Date().toISOString(),
    };
    setUsers(prev => [newUser, ...prev]);
    alert(`Profile "${newUser.username}" saved! You can now select it from the dropdown.`);
  };

  const handleUpdateUserProfile = (profile: PreviewProfile) => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === profile.userId) {
        return {
          ...u,
          username: profile.username || u.username,
          userType: profile.userType === 'Subscriber' ? 'Publisher' : 'Content Partner',
        };
      }
      return u;
    }));
    alert(`Profile "${profile.username}" updated successfully!`);
  };

  const handleDeleteUserProfile = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
  };


  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'carousel':
        return <CarouselBuilder 
                  routes={routes} 
                  carouselsByRoute={carouselsByRoute}
                  totalEntries={totalEntries}
                  onCreateCarousel={handleCreateCarousel}
                  onUpdateCarousel={handleUpdateCarousel}
                  onDeleteCarousel={handleDeleteCarousel}
                  onToggleCarouselStatus={handleToggleCarouselStatus}
                  onDuplicateCarousel={handleDuplicateCarousel}
                  onBulkDeleteCarousels={handleBulkDeleteCarousels}
                  onBulkToggleCarouselStatus={handleBulkToggleCarouselStatus}
                  onReorderCarousels={handleReorderCarousels}
                />;
      case 'playlist':
        return <PlaylistApp />;
      case 'settings':
        return <Settings />;
      case 'preview':
        return <PreviewTool 
                  routes={routes}
                  carouselsByRoute={carouselsByRoute}
                  contentItems={MOCK_CONTENT_ITEMS}
                  users={users}
                  onSaveUserProfile={handleSaveUserProfile}
                  onUpdateUserProfile={handleUpdateUserProfile}
                  onDeleteUserProfile={handleDeleteUserProfile}
                  onCreateCarousel={handleCreateCarousel}
                />;
      case 'users': // Sidebar "User Management"
      case 'admin-users': // Header dropdown "Admin Users"
        return <UserManagementApp 
                  users={users}
                  roles={roles}
                  onSaveUser={handleSaveUser}
                  onUpdateUserStatus={handleUpdateUserStatus}
                  onSaveRole={handleSaveRole}
                />
      default:
        return (
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-xl font-bold text-gray-800">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
                <p className="mt-4 text-gray-600">This page is under construction.</p>
            </div>
        );
    }
  };

  return (
    <MainLayout activeView={activeView} onNavChange={(view) => setActiveView(view as AppView)}>
      {renderContent()}
    </MainLayout>
  );
};

export default App;