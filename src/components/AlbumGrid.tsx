import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AlbumGrid.css';
import Modal from "./Modal";

// Normalize function to make comparisons more consistent
const normalize = (str: string) =>
  str.toLowerCase().replace(/[^a-z0-9]/gi, '').trim();

interface Album {
  id: number;
  basic_information: {
    title: string;
    cover_image: string;
    artists: { name: string }[];
    year: string;
    label: string;
    released: string; // Release date (sometimes this might need to be formatted)
  };
  date_added: string;  // When the album was added to your collection
  location: string;    // Custom field for the location purchased
  purchase_date: string; // Custom field for purchase date
  price_paid: number;  // Custom field for price paid
  last_price: number;  // Custom field for last marketplace price
}

const AlbumGrid: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);  // Local state to store albums
  const [isModalOpen, setIsModalOpen] = useState(false);  // State to track if modal is open
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);  // State to store selected album

  // Function to open the modal
  const openModal = (album: Album) => {
    console.log("Opening Modal with album:", album);
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  // Fetch albums from the API when the component mounts
  useEffect(() => {
    axios
      .get('https://api.discogs.com/users/morganjb/collection/folders/0/releases', {
        params: {
          per_page: 20,
          sort: 'added',
          sort_order: 'desc',
        },
        headers: {
          Authorization: 'Discogs token=RdrvXEBTzPsnMmycwuPtxQsGzeWkPzjsWFULdMvl',
          'User-Agent': 'MyDiscogsApp/1.0',
        },
      })
      .then((res) => {
        // Map through the results and format the data
        const formattedAlbums = res.data.releases.map((album: any) => ({
          id: album.id,
          basic_information: album.basic_information,
          date_added: album.date_added,
          notes: album.notes || [],
          last_price: album.lowest_price ?? 0, // Fallback
        }));
        setAlbums(formattedAlbums);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="grid">
      {albums.map((item) => (
        <div
          key={item.id}
          className="album-card"
          onClick={() => openModal(item)} // Corrected: openModal with the clicked album
        >
          <img
            src={item.basic_information.cover_image}
            alt={item.basic_information.title}
          />
          <h4>{item.basic_information.title}</h4>
          <p>{item.basic_information.artists[0]?.name}</p>
        </div>
      ))}

      {/* Render the Modal component if it is open */}
      {selectedAlbum && (
        <Modal
          isOpen={isModalOpen}
          album={selectedAlbum}
          closeModal={closeModal}
        />
      )}
    </div>
  );
};

export default AlbumGrid;
