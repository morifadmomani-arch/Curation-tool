import React from 'react';
import { ContentItem, UserInterestProfile } from '../../types';

interface MetadataBubbleProps {
    item: ContentItem;
    interestProfile: UserInterestProfile;
}

const MetadataBubble: React.FC<MetadataBubbleProps> = ({ item, interestProfile }) => {
    
    const renderMetadata = () => {
        return Object.entries(item.metadata).flatMap(([key, values]) => {
            if (!Array.isArray(values) || values.length === 0) return [];
            
            return values.map(value => {
                const profileKey = `${key}:${value}`;
                const weight = interestProfile[profileKey] || 0;
                return { key: `${key}: ${value}`, weight };
            });
        });
    };

    const metadataWithWeights = renderMetadata();

    return (
        <div className="w-64 bg-gray-900/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl border border-gray-700">
            <h4 className="font-bold text-sm border-b border-gray-600 pb-1 mb-2">{item.title}</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {metadataWithWeights.length > 0 ? (
                    metadataWithWeights.map(({ key, weight }) => (
                        <div key={key} className="flex justify-between items-center text-xs">
                            <span className="text-gray-300 truncate">{key}</span>
                            <span className={`font-mono px-1.5 py-0.5 rounded ${weight > 0 ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-400'}`}>
                                {weight.toFixed(2)}
                            </span>
                        </div>
                    ))
                ) : (
                     <p className="text-xs text-gray-400">No metadata available.</p>
                )}
            </div>
        </div>
    );
};

export default MetadataBubble;