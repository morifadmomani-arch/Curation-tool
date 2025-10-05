import React, { useState } from 'react';
import RoutingStructure from './RoutingStructure';
import CarouselManagement from './CarouselManagement';
import { RouteNode, Carousel } from '../../types';
import CreateCarouselForm from './CreateCarouselForm';

interface CarouselBuilderProps {
    routes: RouteNode[];
    carouselsByRoute: Record<string, Carousel[]>;
    totalEntries: number;
    onCreateCarousel: (carouselData: Omit<Carousel, 'modified' | 'position'>, route: RouteNode) => void;
    onUpdateCarousel: (carousel: Carousel, routeId: string) => void;
    onDeleteCarousel: (id: string, routeId: string) => void;
    onToggleCarouselStatus: (id: string, routeId: string) => void;
    onDuplicateCarousel: (carousel: Carousel, routeId: string) => void;
    onBulkDeleteCarousels: (ids: string[], routeId: string) => void;
    onBulkToggleCarouselStatus: (ids: string[], routeId: string, status: 'Active' | 'Inactive') => void;
    onReorderCarousels: (routeId: string, sourceId: string, destinationId: string) => void;
}

type View = 'list' | 'create' | 'edit' | 'preview';

const MOCK_INITIAL_ROUTE: RouteNode = { id: 'ww-home', type: 'page', name: 'Home', status: 'active', count: 0, parentId: 'ww' };

const CarouselBuilder: React.FC<CarouselBuilderProps> = (props) => {
  const { 
    routes, 
    carouselsByRoute, 
    totalEntries, 
    onCreateCarousel,
    onUpdateCarousel,
    onDeleteCarousel,
    onToggleCarouselStatus,
    onDuplicateCarousel,
    onBulkDeleteCarousels,
    onBulkToggleCarouselStatus,
    onReorderCarousels
  } = props;

  const [selectedRoute, setSelectedRoute] = useState<RouteNode | null>(MOCK_INITIAL_ROUTE);
  const [view, setView] = useState<View>('list');
  const [activeCarousel, setActiveCarousel] = useState<Carousel | null>(null);

  const handleCreate = (carouselData: Omit<Carousel, 'modified' | 'position'>) => {
    if (!selectedRoute) return;
    onCreateCarousel(carouselData, selectedRoute);
    setView('list');
  };
  
  const handleSave = (carouselData: Carousel) => {
    if (!selectedRoute) return;
    onUpdateCarousel(carouselData, selectedRoute.id);
    setView('list');
    setActiveCarousel(null);
  };

  const handleStartCreate = () => {
    setActiveCarousel(null);
    setView('create');
  };
  
  const handleStartEdit = (carousel: Carousel) => {
    setActiveCarousel(carousel);
    setView('edit');
  };

  const handleStartPreview = (carousel: Carousel) => {
    setActiveCarousel(carousel);
    setView('preview');
  };
  
  const handleCancel = () => {
    setView('list');
    setActiveCarousel(null);
  }

  const handleDelete = (id: string) => {
    // Confirmation is now handled in the CarouselRow component
    if (selectedRoute) {
      onDeleteCarousel(id, selectedRoute.id);
    }
  };

  const handleToggleStatus = (id: string) => {
    if(selectedRoute) {
      onToggleCarouselStatus(id, selectedRoute.id);
    }
  };
  
  const handleDuplicate = (carousel: Carousel) => {
    if(selectedRoute) {
      onDuplicateCarousel(carousel, selectedRoute.id);
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    if (selectedRoute) {
      onBulkDeleteCarousels(ids, selectedRoute.id);
    }
  };

  const handleBulkToggleStatus = (ids: string[], status: 'Active' | 'Inactive') => {
    if (selectedRoute) {
      onBulkToggleCarouselStatus(ids, selectedRoute.id, status);
    }
  };

  const handleReorder = (sourceId: string, destinationId: string) => {
    if (selectedRoute) {
      onReorderCarousels(selectedRoute.id, sourceId, destinationId);
    }
  }

  if (view !== 'list') {
    return (
        <CreateCarouselForm 
            route={selectedRoute!} 
            onCancel={handleCancel} 
            onCreate={handleCreate}
            onSave={handleSave}
            carousel={activeCarousel}
            isReadOnly={view === 'preview'}
        />
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      <div className="w-[350px] flex-shrink-0">
        <RoutingStructure 
            routes={routes}
            totalEntries={totalEntries}
            selectedRoute={selectedRoute} 
            onRouteSelect={setSelectedRoute} 
        />
      </div>
      <div className="flex-1 min-w-0">
        <CarouselManagement 
            selectedRoute={selectedRoute} 
            carousels={carouselsByRoute[selectedRoute?.id ?? ''] || []}
            onStartCreate={handleStartCreate}
            onEdit={handleStartEdit}
            onPreview={handleStartPreview}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onDuplicate={handleDuplicate}
            onBulkDelete={handleBulkDelete}
            onBulkToggleStatus={handleBulkToggleStatus}
            onReorder={handleReorder}
        />
      </div>
    </div>
  );
};
export default CarouselBuilder;