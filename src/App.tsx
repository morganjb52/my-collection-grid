import React from 'react';
import AlbumGrid from './components/AlbumGrid.tsx';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>My Discogs Collection</h1>
      <AlbumGrid />
    </div>
  );
}

export default App;