import React, { useState, useRef, useEffect } from 'react';
import { ContentItem, ActionLog, UserInterestProfile } from '../../types';
import { Icon, DownloadIcon, PaintBrushIcon, SpinnerIcon } from '../ui/Icons';
import MetadataBubble from './MetadataBubble';
import { GoogleGenAI } from "@google/genai";


// Simple icons for actions
const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
);
const LikeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
);
const ShareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>
);


interface PreviewItemCardProps {
    item: ContentItem;
    onUserAction: (content: ContentItem, action: ActionLog['action'], details?: any) => void;
    interestProfile: UserInterestProfile;
    deviceView: 'desktop' | 'tv' | 'mobile';
}

const PreviewItemCard: React.FC<PreviewItemCardProps> = ({ item, onUserAction, interestProfile, deviceView }) => {
    const [showMetadata, setShowMetadata] = useState(false);
    const [playOptionsVisible, setPlayOptionsVisible] = useState(false);
    const playOptionsRef = useRef<HTMLDivElement>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (playOptionsRef.current && !playOptionsRef.current.contains(event.target as Node)) {
                setPlayOptionsVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePlaySelect = (completion: string) => {
        onUserAction(item, 'play', { completion });
        setPlayOptionsVisible(false);
    };

    const handleGenerateImage = async () => {
        setIsGenerating(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const prompt = `Create a promotional movie poster for a piece of content with the title "${item.title}". The primary genre is ${item.metadata.genre?.[0] || 'general'}. The image should be visually appealing and suitable for a content streaming platform. Do not include any text in the image.`;
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '16:9',
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                setGeneratedImageUrl(imageUrl);
            }
        } catch (error) {
            console.error("Error generating image:", error);
            alert("Failed to generate image. Please check the console for details.");
        } finally {
            setIsGenerating(false);
        }
    };


    const completionRates = ['25%', '50%', '75%', '>85%'];
    const finalImageUrl = generatedImageUrl || item.imageUrl;
    
    const textColor = deviceView === 'tv' ? 'text-gray-300' : 'text-gray-900';
    const actionColor = deviceView === 'tv' ? 'text-gray-400' : 'text-gray-500';
    const actionHoverColor = deviceView === 'tv' ? 'hover:text-white' : 'hover:text-gray-900';


    return (
        <div className="flex-shrink-0 w-full relative">
             <div className="relative w-full rounded-lg overflow-hidden bg-gray-800 text-white" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                <div className="absolute inset-0">
                    {finalImageUrl ? (
                        <img src={finalImageUrl} alt={item.title} className="object-cover w-full h-full" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                            {isGenerating ? (
                                <>
                                    <Icon svg={SpinnerIcon} className="w-8 h-8 text-gray-400 animate-spin" />
                                    <p className="text-xs mt-2 text-gray-400">Generating...</p>
                                </>
                            ) : (
                                <>
                                    <Icon svg={PaintBrushIcon} className="w-8 h-8 text-gray-500 mb-2" />
                                    <p className="text-xs text-gray-400 mb-2">No Image</p>
                                    <button onClick={handleGenerateImage} className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1 rounded-md">
                                        Generate
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div 
                className={`mt-2 text-sm ${textColor} font-semibold truncate relative`}
                onMouseEnter={() => setShowMetadata(true)}
                onMouseLeave={() => setShowMetadata(false)}
            >
                {item.title}
                 {showMetadata && (
                    <div className="absolute bottom-full left-0 mb-2 z-10">
                        <MetadataBubble item={item} interestProfile={interestProfile} />
                    </div>
                )}
            </div>
            <div className="mt-1 flex items-center justify-start space-x-2">
                <div className="relative" ref={playOptionsRef}>
                    <button onClick={() => setPlayOptionsVisible(v => !v)} className={`p-1 ${actionColor} ${actionHoverColor} transition-colors`}><Icon svg={PlayIcon} className="w-5 h-5" /></button>
                     {playOptionsVisible && (
                        <div className="absolute bottom-full left-0 mb-2 w-32 bg-gray-800 rounded-md shadow-lg z-10 py-1">
                            <p className="text-xs text-center text-gray-400 py-1 font-semibold">Completion Rate</p>
                            {completionRates.map(rate => (
                                <button
                                    key={rate}
                                    onClick={() => handlePlaySelect(rate)}
                                    className="w-full text-center px-3 py-1.5 text-sm text-white hover:bg-indigo-600"
                                >
                                    {rate}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={() => onUserAction(item, 'like')} className={`p-1 ${actionColor} hover:text-red-500 transition-colors`}><Icon svg={LikeIcon} className="w-5 h-5" /></button>
                <button onClick={() => onUserAction(item, 'share')} className={`p-1 ${actionColor} hover:text-blue-500 transition-colors`}><Icon svg={ShareIcon} className="w-5 h-5" /></button>
                <button onClick={() => onUserAction(item, 'download')} className={`p-1 ${actionColor} hover:text-green-500 transition-colors`}><Icon svg={DownloadIcon} className="w-5 h-5" /></button>
            </div>
        </div>
    );
};

export default PreviewItemCard;