import React, { useState, useMemo } from 'react';
import { RouteNode, Carousel, ContentItem, User, PreviewProfile, ActionLog, UserInterestProfile } from '../../types';
import RoutingStructure from '../carousel/RoutingStructure';
import ProfileSetup from './ProfileSetup';
import PreviewDisplay from './PreviewDisplay';
import UserActivityLog from './UserActivityLog';
import ContentSearchModal from './ContentSearchModal';
import ToastContainer from '../ui/ToastContainer';

interface PreviewToolProps {
    routes: RouteNode[];
    carouselsByRoute: Record<string, Carousel[]>;
    contentItems: ContentItem[];
    users: User[];
    onSaveUserProfile: (profile: PreviewProfile) => void;
    onUpdateUserProfile: (profile: PreviewProfile) => void;
    onDeleteUserProfile: (userId: string) => void;
    onCreateCarousel: (carouselData: Omit<Carousel, 'modified' | 'position'>, route: RouteNode) => void;
}

const PreviewTool: React.FC<PreviewToolProps> = (props) => {
    const { 
        routes, carouselsByRoute, contentItems, users, 
        onSaveUserProfile, onUpdateUserProfile, onDeleteUserProfile, 
        onCreateCarousel 
    } = props;

    const [selectedPage, setSelectedPage] = useState<RouteNode | null>(null);
    const [loadedProfile, setLoadedProfile] = useState<PreviewProfile | null>(null);
    const [actionLog, setActionLog] = useState<ActionLog[]>([]);
    const [interestProfile, setInterestProfile] = useState<UserInterestProfile>({});
    const [deviceView, setDeviceView] = useState<'desktop' | 'tv' | 'mobile'>('desktop');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [toasts, setToasts] = useState<{ id: number, message: string }[]>([]);

    const addToast = (message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev.slice(-4), { id, message }]); // Keep max 5 toasts
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleLoadProfile = (profile: PreviewProfile) => {
        setLoadedProfile(profile);
        // Reset logs and interests when a new profile is loaded
        setActionLog([]);
        setInterestProfile({});
    };

    const handleUserAction = (content: ContentItem, action: ActionLog['action'], details?: any) => {
        const newLogEntry: ActionLog = {
            timestamp: new Date(),
            action,
            contentTitle: content.title,
            details: action === 'play' && details?.completion ? `Completion: ${details.completion}` : (details ? JSON.stringify(details) : undefined),
        };
        setActionLog(prev => [newLogEntry, ...prev].slice(0, 100)); // Keep last 100 logs

        const newInterestProfile = { ...interestProfile };
        let increment = 0;
        if (action === 'like' || action === 'download') increment = 0.3;
        else if (action === 'play') {
            if (details?.completion === '>85%') increment = 0.5;
            else if (details?.completion === '75%') increment = 0.4;
            else if (details?.completion === '50%') increment = 0.25;
            else if (details?.completion === '25%') increment = 0.1;
        }

        Object.entries(content.metadata).forEach(([key, values]) => {
            if (Array.isArray(values)) {
                values.forEach(value => {
                    const profileKey = `${key}:${value}`;
                    newInterestProfile[profileKey] = (newInterestProfile[profileKey] || 0) + increment;
                });
            }
        });
        setInterestProfile(newInterestProfile);
    };

    const carouselsForPage = useMemo(() => {
        if (!selectedPage || !loadedProfile) return [];
        const carousels = carouselsByRoute[selectedPage.id] || [];
        return carousels
            .filter(c => c.status === 'Active')
            .sort((a, b) => a.position - b.position)
            .map((carousel, index) => ({
                ...carousel,
                content: [...contentItems].sort(() => 0.5 - Math.random()).slice(0, 10),
            }));
    }, [selectedPage, loadedProfile, carouselsByRoute, contentItems]);
    
    return (
        <>
            <ToastContainer toasts={toasts} onRemove={removeToast} />
            <div className="flex gap-6 h-[calc(100vh-10rem)]">
                <div className="w-[320px] flex-shrink-0 flex flex-col gap-6">
                    <ProfileSetup 
                        users={users}
                        selectedPage={selectedPage}
                        onLoadProfile={handleLoadProfile}
                        onSaveProfile={onSaveUserProfile}
                        onUpdateProfile={onUpdateUserProfile}
                        onDeleteProfile={onDeleteUserProfile}
                    />
                     <RoutingStructure
                        routes={routes}
                        totalEntries={0} // Not relevant for preview
                        selectedRoute={selectedPage}
                        onRouteSelect={setSelectedPage}
                    />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-6">
                     <div className="flex-1 min-h-0">
                         <PreviewDisplay
                            profile={loadedProfile}
                            page={selectedPage}
                            carousels={carouselsForPage}
                            onUserAction={handleUserAction}
                            interestProfile={interestProfile}
                            deviceView={deviceView}
                            onDeviceChange={setDeviceView}
                            onOpenSearch={() => setIsSearchOpen(true)}
                            contentItems={contentItems}
                            actionLog={actionLog}
                            onCreateCarousel={onCreateCarousel}
                        />
                    </div>
                     <div className="h-56 flex-shrink-0">
                        <UserActivityLog log={actionLog} profile={interestProfile} />
                    </div>
                </div>
            </div>
            <ContentSearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                contentItems={contentItems}
                onUserAction={handleUserAction}
                interestProfile={interestProfile}
                addToast={addToast}
            />
        </>
    );
};

export default PreviewTool;