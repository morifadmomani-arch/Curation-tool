import React, { useState, useEffect } from 'react';
import { Playlist, PlaylistItem } from '../../types';
import { Icon, MoveIcon, TrashIcon } from '../ui/Icons';

interface PlaylistCreatorProps {
  playlist?: Playlist | null;
  onCancel: () => void;
  onSave?: (playlistData: Partial<Playlist>, status: 'Draft' | 'Active') => void;
  isReadOnly?: boolean;
}

// Mock data for dropdowns and items
const MOCK_SHOWS = [
  { id: '891580', name: '891580 - The-Pit - الحفرة - AVOD' },
  { id: '891581', name: '891581 - Another Show - SVOD' },
  { id: '891582', name: '891582 - Third Show - AVOD/SVOD' },
];
const MOCK_SEASONS = [
  { id: 'S01', name: '891582 - Season 01 - الموسم ١' },
  { id: 'S02', name: '891582 - Season 02 - الموسم ٢' },
  { id: 'S03', name: '891582 - Season 03 - الموسم ٣' },
];
const MOCK_EPISODES = [
  { id: 'E01', name: '893478 - Ep 01 - الحلقة ١' },
  { id: 'E02', name: '893478 - Ep 02 - الحلقة ٢' },
  { id: 'E03', name: '893478 - Ep 03 - الحلقة ٣' },
];
const MOCK_PLAYLIST_ITEMS: PlaylistItem[] = [
    { id: 1, thumb: '', show: 'The Pit', season: 'Season 03', ep: 'Ep 01', source: 'Series', status: 'Active', type: 'SVOD' },
    { id: 2, thumb: '', show: 'The Pit', season: 'Season 03', ep: 'Ep 01', source: 'Series', status: 'Active', type: 'AVOD' },
    { id: 3, thumb: '', show: 'The Pit', season: 'Season 03', ep: 'Ep 01', source: 'Series', status: 'Active', type: 'AVOD, SVOD' },
];

const InputField = ({ label, id, value, onChange, required = false, disabled = false, placeholder = '' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100"
        />
    </div>
);

const CustomSelect = ({ label, id, options, disabled = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            id={id}
            name={id}
            disabled={disabled}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
        >
            <option>Select or enter a value</option>
            {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
        </select>
    </div>
);

const PlaylistCreator: React.FC<PlaylistCreatorProps> = ({ playlist, onCancel, onSave, isReadOnly = false }) => {
  
  const [playlistId, setPlaylistId] = useState('M-20245');
  const [playlistName, setPlaylistName] = useState('Playlist 01');
  const [label, setLabel] = useState('Ramadan_2025');
  const [addMethod, setAddMethod] = useState<'dynamic' | 'ids'>('dynamic');
  const [idInput, setIdInput] = useState('888888,444444,44444,334546,566577');
  const [items, setItems] = useState<PlaylistItem[]>(MOCK_PLAYLIST_ITEMS);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    if (playlist) {
      setPlaylistId(String(playlist.id));
      setPlaylistName(playlist.title);
      setLabel(playlist.description);
      // In a real app, you would fetch the items for this playlist
      setItems(MOCK_PLAYLIST_ITEMS.slice(0, playlist.items));
    }
  }, [playlist]);

  const handleAddItem = () => {
    const newItem: PlaylistItem = {
      id: Date.now(),
      thumb: '',
      show: 'The Pit',
      season: 'Season 04',
      ep: 'Ep 10',
      source: 'Series',
      status: 'Active',
      type: 'SVOD'
    };
    setItems(prev => [newItem, ...prev]);
  };

  const handleDeleteItem = (idToDelete: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        setItems(prev => prev.filter(item => item.id !== idToDelete));
    }
  }
  
  const isAllSelected = items.length > 0 && selectedItems.length === items.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(items.map(i => i.id));
    } else {
      setSelectedItems([]);
    }
  }

  const handleSelectOne = (id: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(selectedId => selectedId !== id));
    }
  }

  const handleSaveClick = (status: 'Draft' | 'Active') => {
    if (onSave) {
        const playlistData: Partial<Playlist> = {
            id: playlist?.id, // Pass id if it's an edit
            title: playlistName,
            description: label,
            items: items.length,
        };
        onSave(playlistData, status);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Playlist Manager - Creation</h1>
        
        {/* General Section */}
        <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">General</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InputField label="Playlist ID" id="playlistId" value={playlistId} onChange={e => setPlaylistId(e.target.value)} required disabled={isReadOnly || !!playlist} />
                <InputField label="Playlist Name" id="playlistName" value={playlistName} onChange={e => setPlaylistName(e.target.value)} required disabled={isReadOnly} />
                <InputField label="Label" id="label" value={label} onChange={e => setLabel(e.target.value)} disabled={isReadOnly} />
            </div>
        </div>

        {/* Playlist Add Section */}
        {!isReadOnly && (
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Playlist add</h2>
                <div className="flex items-center space-x-8 mb-4">
                    <div className="flex items-center">
                        <input id="dynamic" name="add-method" type="radio" checked={addMethod === 'dynamic'} onChange={() => setAddMethod('dynamic')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                        <label htmlFor="dynamic" className="ml-2 block text-sm font-medium text-gray-700">Dynamic</label>
                    </div>
                    <div className="flex items-center">
                        <input id="ids" name="add-method" type="radio" checked={addMethod === 'ids'} onChange={() => setAddMethod('ids')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                        <label htmlFor="ids" className="ml-2 block text-sm font-medium text-gray-700">IDs</label>
                    </div>
                </div>

                {addMethod === 'dynamic' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CustomSelect label="Show" id="show" options={MOCK_SHOWS} />
                        <CustomSelect label="Season" id="season" options={MOCK_SEASONS} />
                        <CustomSelect label="Episode" id="episode" options={MOCK_EPISODES} />
                    </div>
                ) : (
                    <textarea 
                        rows={3} 
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={idInput}
                        onChange={e => setIdInput(e.target.value)}
                    ></textarea>
                )}
                 <div className="flex justify-end mt-4">
                    <button type="button" onClick={handleAddItem} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">Add</button>
                 </div>
            </div>
        )}

        {/* Playlist Items Section */}
        <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Playlist Items</h2>
            <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="p-4"><input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} disabled={isReadOnly} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /></th>
                            {['Thumb', 'Show', 'Season', 'Ep', 'Source', 'Status', 'Type', 'ACTIONS'].map(h => (
                                <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="p-4"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={(e) => handleSelectOne(item.id, e.target.checked)} disabled={isReadOnly} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" /></td>
                                <td className="px-4 py-2"><div className="w-16 h-9 bg-gray-200 rounded"></div></td>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.show}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{item.season}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{item.ep}</td>
                                <td className="px-4 py-2 text-sm text-gray-500">{item.source}</td>
                                <td className="px-4 py-2 text-sm"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span></td>
                                <td className="px-4 py-2 text-sm text-gray-500">{item.type}</td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center space-x-3">
                                        {!isReadOnly && <button type="button" className="text-gray-400 hover:text-gray-700 cursor-move"><Icon svg={MoveIcon} className="w-5 h-5" /></button>}
                                        {!isReadOnly && <button type="button" onClick={() => handleDeleteItem(item.id)} className="text-gray-400 hover:text-red-600"><Icon svg={TrashIcon} className="w-5 h-5" /></button>}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No items have been added to this playlist.</div>
                )}
            </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end items-center mt-8 pt-6 border-t space-x-3">
          <button onClick={onCancel} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300">
            Cancel
          </button>
          {!isReadOnly && (
            <>
                <button onClick={() => handleSaveClick('Draft')} className="px-6 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 border border-indigo-600">
                    Save
                </button>
                <button onClick={() => handleSaveClick('Active')} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Activate
                </button>
            </>
          )}
        </div>
    </div>
  );
};

export default PlaylistCreator;