import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AlbumGrid.css';

interface Album {
  id: number;
  basic_information: {
    title: string;
    cover_image: string;
    artists: { name: string }[];
  };
}

const AlbumGrid: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    axios
      .get('https://api.discogs.com/users/morganjb/collection/folders/0/releases', {
        params: {
          per_page: 100,
          sort: 'added',
          sort_order: 'desc',
        },
        headers: {
          Authorization: 'Discogs token=RdrvXEBTzPsnMmycwuPtxQsGzeWkPzjsWFULdMvl',
          'User-Agent': 'MyDiscogsApp/1.0',
        },
      })
      .then((res) => setAlbums(res.data.releases))
      .catch(console.error);
  }, []);

  return (
    <div className="grid">
      {albums.map((item) => (
        <div key={item.id} className="album-card">
          <img
            src={item.basic_information.cover_image}
            alt={item.basic_information.title}
          />
          <h4>{item.basic_information.title}</h4>
          <p>{item.basic_information.artists[0]?.name}</p>
        </div>
      ))}
    </div>
  );
};

export default AlbumGrid;