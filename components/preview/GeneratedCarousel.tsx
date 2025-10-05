import React from 'react';
import { Carousel, ContentItem, UserInterestProfile, ActionLog, RouteNode } from '../../types';
import PreviewItemCard from './PreviewItemCard';
import { Icon, PlusIcon } from '../ui/Icons';
import Tooltip from '../ui/Tooltip';

// Helper to create a proper Carousel object from a recommendation
const createCarouselFromRecommendation = (carousel: Carousel & { content: ContentItem[] }): Omit<Carousel, 'modified' | 'position'> => {
    const defaultVariant = {
        id: `variant-${Date.now()}`,
        weight: 100,
        editorialName: carousel.editorialName,
        carouselCompType: 'Normal Carousel Component',
        packages: ['vip'],
        age: ['all'],
        deviceType: ['web', 'mobile_android', 'mobile_ios', 'android_tv'],
        regionConfig: { selectedRegion: 'GCC', included: ['KSA', 'UAE', 'QATAR', 'BAHRAIN', 'OMAN', 'KUWAIT'], excluded: [] },
        recommendationType: 'Editorials (Manual)',
        vodAvailable: true,
        allowPrevious: true,
        removePrevious: false,
        episodeOrder: true,
        includeExclude: '',
        avodSvod: 'SVOD',
    };

    return {
        id: `${Date.now()}`.slice(-6),
        editorialName: carousel.editorialName,
        type: 'Normal Carousel Component',
        items: carousel.content.length,
        platforms: ['web', 'mobile_android', 'mobile_ios', 'android_tv'],
        recommendationType: 'Editorials (Manual)',
        avodSvod: 'SVOD',
        status: 'Draft',
        pinned: false,
        variants: [defaultVariant],
    };
};

interface GeneratedCarouselProps {
    carousel: Carousel & { content: ContentItem[] };
    onUserAction: (content: ContentItem, action: ActionLog['action'], details?: any) => void;
    interestProfile: UserInterestProfile;
    page: RouteNode;
    onCreateCarousel: (carouselData: Omit<Carousel, 'modified' | 'position'>, route: RouteNode) => void;
    deviceView: 'desktop' | 'tv' | 'mobile';
}

const GeneratedCarousel: React.FC<GeneratedCarouselProps> = ({ carousel, onUserAction, interestProfile, page, onCreateCarousel, deviceView }) => {

    const handleUseCarousel = () => {
        const newCarouselData = createCarouselFromRecommendation(carousel);
        onCreateCarousel(newCarouselData, page);
        alert(`Carousel "${carousel.editorialName}" has been added as a draft to the '${page.name}' page in the Carousel Builder.`);
    };
    
    const titleColor = deviceView === 'tv' ? 'text-white' : 'text-gray-800';

    const cardWidthClass = {
        desktop: 'w-48',
        tv: 'w-56',
        mobile: 'w-40',
    }[deviceView];

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h3 className={`text-lg font-bold ${titleColor}`}>{carousel.editorialName}</h3>
                <Tooltip text="Add this carousel to the production list in the Carousel Builder">
                    <button 
                        onClick={handleUseCarousel}
                        className="flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700"
                    >
                        <Icon svg={PlusIcon} className="w-4 h-4 mr-1.5" />
                        Use This Carousel
                    </button>
                </Tooltip>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4">
                {carousel.content.map(item => (
                    <div key={item.id} className={`${cardWidthClass} flex-shrink-0`}>
                        <PreviewItemCard 
                            item={item} 
                            onUserAction={onUserAction}
                            interestProfile={interestProfile}
                            deviceView={deviceView}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GeneratedCarousel;