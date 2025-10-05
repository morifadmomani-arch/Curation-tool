import React, { useState, useMemo } from 'react';
import { RouteNode, Carousel, ContentItem, ActionLog } from '../../types';
import { PreviewProfile, UserInterestProfile } from '../../types';
import PreviewCarousel from './PreviewCarousel';
import { Icon, PreviewIcon, SearchIcon, ArrowsExpandIcon, ArrowsShrinkIcon } from '../ui/Icons';
import DeviceToggle from './DeviceToggle';
import Tooltip from '../ui/Tooltip';
import GeneratedCarousel from './GeneratedCarousel';

interface PreviewDisplayProps {
    profile: PreviewProfile | null;
    page: RouteNode | null;
    carousels: (Carousel & { content: ContentItem[] })[];
    onUserAction: (content: ContentItem, action: 'play' | 'like' | 'share' | 'download', details?: any) => void;
    interestProfile: UserInterestProfile;
    deviceView: 'desktop' | 'tv' | 'mobile';
    onDeviceChange: (view: 'desktop' | 'tv' | 'mobile') => void;
    onOpenSearch: () => void;
    contentItems: ContentItem[];
    actionLog: ActionLog[];
    onCreateCarousel: (carouselData: Omit<Carousel, 'modified' | 'position'>, route: RouteNode) => void;
}

const PreviewDisplay: React.FC<PreviewDisplayProps> = (props) => {
    const { 
        profile, page, carousels, onUserAction, interestProfile, 
        deviceView, onDeviceChange, onOpenSearch, contentItems, actionLog, onCreateCarousel
    } = props;

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeTab, setActiveTab] = useState<'production' | 'recommendations'>('production');

    const recommendedCarousels = useMemo(() => {
        if (!page || activeTab !== 'recommendations' || actionLog.length === 0) {
            return [];
        }

        const generatedCarousels: (Carousel & { content: ContentItem[] })[] = [];
        const seenRecs = new Set<string>();

        const createRecCarousel = (id: string, title: string, content: ContentItem[]) => {
            if (seenRecs.has(title) || content.length < 2) return null;

            seenRecs.add(title);
            const newCarousel: Carousel & { content: ContentItem[] } = {
                id: id,
                editorialName: title,
                content: content,
                type: 'Recommended',
                position: generatedCarousels.length + 1,
                items: content.length,
                platforms: ['all'],
                recommendationType: 'Personalized',
                avodSvod: 'SVOD',
                status: 'Draft',
                pinned: false,
                modified: new Date().toISOString().split('T')[0],
                variants: [],
            };
            return newCarousel;
        };

        const interactedItemTitles = new Set(actionLog.map(log => log.contentTitle));

        // Strategy 1: "Because you liked..."
        const uniqueLikedTitles = [...new Set(actionLog.filter(log => log.action === 'like').map(log => log.contentTitle))];
        uniqueLikedTitles.forEach(likedTitle => {
            const sourceItem = contentItems.find(c => c.title === likedTitle);
            if (!sourceItem) return;
            const primaryGenre = sourceItem.metadata.genre?.[0];
            if (primaryGenre) {
                const recommendedContent = contentItems.filter(item =>
                    item.id !== sourceItem.id && !interactedItemTitles.has(item.title) && item.metadata.genre?.includes(primaryGenre)
                ).slice(0, 10);
                const carousel = createRecCarousel(`rec-liked-${sourceItem.id}`, `Because you liked ${sourceItem.title}`, recommendedContent);
                if (carousel) generatedCarousels.push(carousel);
            }
        });

        // Strategy 2: "Because you watched..." (for any watch action)
        const playLogs = actionLog.filter(log => log.action === 'play');
        const uniqueWatchedTitles = Array.from(new Set(playLogs.map(log => log.contentTitle)));

        uniqueWatchedTitles.slice(0, 3).forEach(watchedTitle => { // Take most recent 3 unique watches
            const sourceItem = contentItems.find(c => c.title === watchedTitle);
            if (sourceItem) {
                const primaryGenre = sourceItem.metadata.genre?.[0];
                if (primaryGenre) {
                    const recommendedContent = contentItems.filter(item =>
                        item.id !== sourceItem.id && !interactedItemTitles.has(item.title) && item.metadata.genre?.includes(primaryGenre)
                    ).slice(0, 10);
                    const carousel = createRecCarousel(`rec-watched-${sourceItem.id}`, `Because you watched ${sourceItem.title}`, recommendedContent);
                    if (carousel) generatedCarousels.push(carousel);
                }
            }
        });
        
        // Strategy 3: "Because you like Actor..."
        const highInterestItems = new Set(actionLog
            .filter(l => l.action === 'like' || (l.action === 'play' && l.details?.includes('>85%')))
            .map(l => l.contentTitle));

        const likedActors = new Set<string>();
        contentItems.forEach(item => {
            if (highInterestItems.has(item.title) && item.metadata.cast) {
                item.metadata.cast.forEach(actor => likedActors.add(actor));
            }
        });

        likedActors.forEach(actor => {
            const recommendedContent = contentItems.filter(item =>
                item.metadata.cast?.includes(actor) && !highInterestItems.has(item.title)
            ).slice(0, 10);
            const carousel = createRecCarousel(`rec-actor-${actor.replace(/\s+/g, '')}`, `Because you like ${actor}`, recommendedContent);
            if (carousel) generatedCarousels.push(carousel);
        });

        // Strategy 4: General Interest Carousels (Genre, Mood, Theme, etc.)
        Object.entries(interestProfile)
            .filter(([, weight]) => (weight as number) >= 0.1)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .forEach(([key,]) => {
                const [type, value] = key.split(':');
                if (!type || !value || type === 'cast') return; // Cast is handled separately

                const recommendedContent = contentItems.filter(item =>
                    item.metadata[type]?.includes(value) && !interactedItemTitles.has(item.title)
                ).slice(0, 10);

                const carousel = createRecCarousel(`rec-interest-${type}-${value.replace(/\s+/g, '')}`, `More in ${value}`, recommendedContent);
                if (carousel) generatedCarousels.push(carousel);
            });

        return generatedCarousels;

    }, [interestProfile, activeTab, contentItems, actionLog, page]);


    const renderContent = () => {
        if (!profile || !page) {
            return (
                <div className="text-center text-gray-500">
                    <Icon svg={PreviewIcon} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold">Welcome to the Preview Tool</h3>
                    <p className="mt-2 max-w-md mx-auto">Configure a profile, select a page, and click "Load" to begin your simulation.</p>
                </div>
            );
        }
        
        const contentToShow = (
            <>
                {carousels.map(carousel => (
                    <PreviewCarousel 
                        key={carousel.id} 
                        carousel={carousel} 
                        onUserAction={onUserAction}
                        interestProfile={interestProfile}
                        deviceView={deviceView}
                    />
                ))}
                {carousels.length === 0 && (
                     <div className="text-center text-gray-400 py-20">
                        <h3 className="text-lg font-semibold">No Carousels</h3>
                        <p className="mt-1">There are no active carousels configured for this page.</p>
                    </div>
                )}
            </>
        );

        const renderTabs = () => (
            <div className="flex space-x-1 border-b mb-4" style={{borderColor: deviceView === 'tv' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}}>
                <button onClick={() => setActiveTab('production')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'production' ? `border-b-2 border-indigo-500 ${deviceView === 'tv' ? 'text-white' : 'text-indigo-600'}` : `${deviceView === 'tv' ? 'text-gray-400' : 'text-gray-500'} border-b-2 border-transparent hover:border-gray-400`}`}>
                    Production
                </button>
                <button onClick={() => setActiveTab('recommendations')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'recommendations' ? `border-b-2 border-indigo-500 ${deviceView === 'tv' ? 'text-white' : 'text-indigo-600'}` : `${deviceView === 'tv' ? 'text-gray-400' : 'text-gray-500'} border-b-2 border-transparent hover:border-gray-400`}`}>
                    Recommendations
                </button>
            </div>
        );

        const viewportClasses = {
            desktop: 'w-full h-full bg-white rounded-lg p-6 overflow-y-auto',
            tv: 'w-full aspect-video max-h-full mx-auto bg-gray-900 text-white rounded-lg p-6 overflow-y-auto shadow-2xl',
            mobile: 'w-[375px] max-w-full h-[667px] max-h-full border-8 border-gray-800 bg-white rounded-2xl mx-auto p-4 overflow-y-auto shadow-2xl',
        }[deviceView];
        
        const textColorClass = deviceView === 'tv' ? 'text-white' : 'text-gray-800';

        return (
             <div className="bg-gray-200 rounded-lg h-full flex flex-col p-4 transition-all duration-300">
                <div className={`p-4 border-b ${deviceView === 'tv' ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0 flex justify-between items-center`}>
                    <div>
                        <h2 className={`text-xl font-bold ${textColorClass}`}>
                            Previewing: <span className="text-indigo-500">{page.name}</span>
                        </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DeviceToggle activeView={deviceView} onChangeView={onDeviceChange} />
                         <Tooltip text={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className={`p-2 rounded-md transition-colors ${deviceView === 'tv' ? 'text-white hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <Icon svg={isFullscreen ? ArrowsShrinkIcon : ArrowsExpandIcon} className="w-5 h-5" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
                <div className="flex-1 min-h-0 flex items-center justify-center p-4">
                   <div className={viewportClasses}>
                        {renderTabs()}
                        <div className="space-y-8">
                            {activeTab === 'production' && contentToShow}
                            {activeTab === 'recommendations' && (
                                recommendedCarousels.length > 0 ? recommendedCarousels.map(carousel => (
                                    <GeneratedCarousel 
                                        key={carousel.id} 
                                        carousel={carousel} 
                                        onUserAction={onUserAction}
                                        interestProfile={interestProfile}
                                        page={page}
                                        onCreateCarousel={onCreateCarousel}
                                        deviceView={deviceView}
                                    />
                                )) : (
                                    <div className="text-center text-gray-400 py-20">
                                        <h3 className="text-lg font-semibold">No Recommendations Yet</h3>
                                        <p className="mt-1">Interact with content (like, watch) to generate personalized recommendations.</p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const wrapperClasses = isFullscreen
        ? "fixed inset-0 z-50 bg-gray-100 flex flex-col"
        : "bg-white rounded-lg shadow-md h-full flex flex-col";

    return (
        <div className={wrapperClasses}>
            <div className="p-4 border-b flex-shrink-0">
                <button
                    onClick={onOpenSearch}
                    disabled={!profile || !page}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <Icon svg={SearchIcon} className="w-5 h-5 text-gray-400 mr-3" />
                    Search for specific content (Shahid CMS)
                </button>
            </div>
            <div className="flex-1 min-h-0">
                {renderContent()}
            </div>
        </div>
    );
};

export default PreviewDisplay;
