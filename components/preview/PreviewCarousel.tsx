import React from 'react';
import { Carousel, ContentItem, UserInterestProfile, ActionLog } from '../../types';
import PreviewItemCard from './PreviewItemCard';

interface PreviewCarouselProps {
    carousel: Carousel & { content: ContentItem[] };
    onUserAction: (content: ContentItem, action: ActionLog['action'], details?: any) => void;
    interestProfile: UserInterestProfile;
    deviceView: 'desktop' | 'tv' | 'mobile';
}

const PreviewCarousel: React.FC<PreviewCarouselProps> = ({ carousel, onUserAction, interestProfile, deviceView }) => {
    const titleColor = deviceView === 'tv' ? 'text-white' : 'text-gray-800';

    const cardWidthClass = {
        desktop: 'w-48',
        tv: 'w-56',
        mobile: 'w-40',
    }[deviceView];

    return (
        <div className="space-y-3">
            <h3 className={`text-lg font-bold ${titleColor}`}>{carousel.editorialName}</h3>
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

export default PreviewCarousel;