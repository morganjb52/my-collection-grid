import React from 'react';
import './App.css'
import AlbumGrid from './components/AlbumGrid';

function App() {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px', }}>My Discogs Collection</h1>
      <AlbumGrid />
    </div>
  );
}

export default App;