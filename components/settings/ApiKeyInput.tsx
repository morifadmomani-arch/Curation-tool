import React, { useState } from 'react';

interface ApiKeyInputProps {
    label: string;
    apiKey: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ label, apiKey }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const maskedKey = `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <input
                    type="text"
                    readOnly
                    value={maskedKey}
                    className="flex-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-l-md sm:text-sm cursor-default"
                />
                <button
                    type="button"
                    onClick={handleCopy}
                    className="relative -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
            </div>
        </div>
    );
};

export default ApiKeyInput;
