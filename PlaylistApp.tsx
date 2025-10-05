import React, { useState } from 'react';
import PlaylistManager from './components/playlist/PlaylistManager';
import PlaylistCreator from './components/playlist/PlaylistCreator';
import { Playlist } from './types';

// Lifted MOCK_PLAYLISTS from PlaylistManager
const MOCK_PLAYLISTS_INITIAL: Playlist[] = Array.from({ length: 100 }, (_, i) => {
    const createdDate = new Date('2024-01-15T12:40:00Z');
    createdDate.setDate(createdDate.getDate() + i);

    const modifiedDate = new Date('2024-03-01T20:30:00Z');
    modifiedDate.setDate(modifiedDate.getDate() + i);
    
    return {
      id: 1230 + i,
      title: 'EGY-Home',
      description: `EGY-Home-Momani ${i+1}`,
      items: 55 + i,
      created: createdDate.toISOString().split('T')[0], // YYYY-MM-DD
      modified: modifiedDate.toISOString().split('T')[0], // YYYY-MM-DD
      status: i % 5 === 0 ? 'Inactive' : 'Active', // Add some Inactive for testing
    };
});


type View = 'list' | 'create' | 'edit' | 'preview';

const PlaylistApp: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>(MOCK_PLAYLISTS_INITIAL);


  const handleCreate = () => {
    setSelectedPlaylist(null);
    setView('create');
  };
  
  const handleEdit = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setView('edit');
  };

  const handlePreview = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setView('preview');
  };

  const handleCancel = () => {
    setSelectedPlaylist(null);
    setView('list');
  };

  const handleSavePlaylist = (playlistData: Partial<Playlist>, status: 'Draft' | 'Active') => {
    if (playlistData.id && playlists.some(p => p.id === playlistData.id)) {
        // Update existing playlist
        setPlaylists(prev => prev.map(p => 
            p.id === playlistData.id 
            ? { ...p, ...playlistData, status, modified: new Date().toISOString().split('T')[0] } as Playlist
            : p
        ));
    } else {
        // Create new playlist
        const newPlaylist: Playlist = {
            id: Date.now(),
            title: playlistData.title || 'Untitled Playlist',
            description: playlistData.description || '',
            items: playlistData.items || 0,
            created: new Date().toISOString().split('T')[0],
            modified: new Date().toISOString().split('T')[0],
            status,
        };
        // Add new playlist to the top of the list
        setPlaylists(prev => [newPlaylist, ...prev]);
    }
    setView('list');
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      setPlaylists(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleBulkDelete = (ids: number[]) => {
    setPlaylists(prev => prev.filter(p => !ids.includes(p.id)));
  };

  const handleToggleStatus = (playlistToToggle: Playlist) => {
     setPlaylists(prev => prev.map(p => 
      p.id === playlistToToggle.id 
        ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } 
        : p
    ));
  };

  const handleDuplicate = (playlistToDuplicate: Playlist) => {
    const newPlaylist: Playlist = {
      ...playlistToDuplicate,
      id: Date.now() + Math.random(), // More robust unique ID for demo
      title: `${playlistToDuplicate.title} (Copy)`,
      description: `${playlistToDuplicate.description} (Copy)`,
      status: 'Draft',
    };
    setPlaylists(prev => [newPlaylist, ...prev]);
  };

  const renderPlaylistContent = () => {
    switch(view) {
      case 'create':
        return <PlaylistCreator onCancel={handleCancel} onSave={handleSavePlaylist} />;
      case 'edit':
        return <PlaylistCreator onCancel={handleCancel} playlist={selectedPlaylist} onSave={handleSavePlaylist} />;
      case 'preview':
        return <PlaylistCreator onCancel={handleCancel} playlist={selectedPlaylist} isReadOnly />;
      case 'list':
      default:
        return (
          <PlaylistManager 
            playlists={playlists}
            onCreate={handleCreate} 
            onEdit={handleEdit} 
            onPreview={handlePreview}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onToggleStatus={handleToggleStatus}
            onDuplicate={handleDuplicate}
          />
        );
    }
  }

  return (
    <>
      {renderPlaylistContent()}
    </>
  );
};

export default PlaylistApp;