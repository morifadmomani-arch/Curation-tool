import React, { useState, useEffect } from 'react';
import { Icon, PlusIcon, TrashIcon } from './Icons';

// Mock data for regions and their corresponding countries
const REGION_DATA: Record<string, string[]> = {
  'GCC': ['KSA', 'UAE', 'QATAR', 'BAHRAIN', 'OMAN', 'KUWAIT'],
  'MENA': ['EGY', 'JOR', 'LBN', 'MAR', 'TUN', 'DZA'],
  'WW': ['USA', 'CAN', 'GBR', 'FRA', 'DEU', 'AUS'],
};

interface RegionSelectorProps {}

/**
 * A component for selecting a region and then including or excluding countries.
 */
const RegionSelector: React.FC<RegionSelectorProps> = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('GCC');
  const [includedCountries, setIncludedCountries] = useState<string[]>([]);
  const [excludedCountries, setExcludedCountries] = useState<string[]>([]);
  const [countryToAdd, setCountryToAdd] = useState('');

  // Effect to update included countries when the region changes
  useEffect(() => {
    const regionCountries = REGION_DATA[selectedRegion] || [];
    setIncludedCountries(regionCountries);
    setExcludedCountries([]); // Reset exclusions on region change
  }, [selectedRegion]);

  // Moves a country from the included list to the excluded list
  const handleExclude = (country: string) => {
    setIncludedCountries(prev => prev.filter(c => c !== country));
    setExcludedCountries(prev => [...prev, country].sort());
  };

  // Moves a country from the excluded list back to the included list
  const handleInclude = (country: string) => {
    setExcludedCountries(prev => prev.filter(c => c !== country));
    setIncludedCountries(prev => [...prev, country].sort());
  };
  
  // Adds a manually entered country to the included list
  const handleAddCountryToList = () => {
    const country = countryToAdd.trim().toUpperCase();
    if (country && !includedCountries.includes(country) && !excludedCountries.includes(country)) {
      setIncludedCountries(prev => [...prev, country].sort());
      setCountryToAdd('');
    }
  };

  // A reusable component to display a list of countries
  const ListBox = ({ title, countries, onAction, actionIcon: ActionIcon, borderColorClass }: {
    title: string,
    countries: string[],
    onAction: (country: string) => void,
    actionIcon: React.FC<React.SVGProps<SVGSVGElement>>,
    borderColorClass: string,
  }) => (
    <div className={`p-3 rounded-md border-2 ${borderColorClass} bg-opacity-10 h-full`}>
      <h4 className="text-sm font-semibold text-gray-700 mb-2">{title} ({countries.length})</h4>
      <div className="space-y-2 h-32 overflow-y-auto pr-1">
        {countries.map(country => (
          <div key={country} className="flex justify-between items-center bg-white p-1.5 rounded-md border shadow-sm">
            <span className="text-sm text-gray-800">{country}</span>
            <button type="button" onClick={() => onAction(country)} className="text-gray-400 hover:text-red-600">
               <Icon svg={ActionIcon} className="w-4 h-4" />
            </button>
          </div>
        ))}
        {countries.length === 0 && <p className="text-xs text-gray-500 text-center pt-4">No countries.</p>}
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="region-select" className="block text-sm font-medium text-gray-700 mb-1">Region Selection</label>
          <select 
            id="region-select" 
            value={selectedRegion} 
            onChange={e => setSelectedRegion(e.target.value)}
            className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {Object.keys(REGION_DATA).map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div>
            <label htmlFor="country-add" className="block text-sm font-medium text-gray-700 mb-1">Add Country Manually</label>
            <div className="flex">
                <input 
                    type="text"
                    id="country-add"
                    value={countryToAdd}
                    onChange={e => setCountryToAdd(e.target.value)}
                    placeholder="e.g., KSA"
                    className="w-full px-3 py-2 border border-r-0 border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                />
                <button type="button" onClick={handleAddCountryToList} className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 text-sm font-medium">Add</button>
            </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <ListBox 
          title="Included Countries"
          countries={includedCountries}
          onAction={handleExclude}
          actionIcon={TrashIcon}
          borderColorClass="border-green-300"
        />
        <ListBox 
          title="Excluded Countries"
          countries={excludedCountries}
          onAction={handleInclude}
          actionIcon={PlusIcon}
          borderColorClass="border-red-300"
        />
      </div>
    </div>
  );
};

export default RegionSelector;
