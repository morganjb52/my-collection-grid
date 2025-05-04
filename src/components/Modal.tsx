import React, { useState, useEffect } from 'react';
import "./Modal.css"; // you can style it in a separate CSS file, or use inline styles
import { lastFmOverrides } from './manualOverrides.ts';

interface ModalProps {
  isOpen: boolean;
  album: any;
  closeModal: () => void;
}

const CUSTOM_FIELDS = {
    4: 'Purchase location',
    5: 'Date purchased',
    6: 'Purchase price',
}

const LASTFM_API_KEY = 'c788bd1a493cddc12617bfaca2fe286e';
const LASTFM_USERNAME = 'morganjb';

const fetchAlbumPlaycount = async (artist: string, album: string): Promise<number> => {
    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}&username=${LASTFM_USERNAME}&format=json`
      );
      const data = await response.json();
      return data.album?.userplaycount || 0;
    } catch (err) {
      console.error("Failed to fetch playcount", err);
      return 0;
    }
  };  

const renderNotes = (notes: any[]) => {
    return notes.map((note, index) => {
      const label = CUSTOM_FIELDS[note.field_id] || `Field ${note.field_id}`;
      return (
        <p key={index}><strong>{label}:</strong> {note.value}</p>
      );
    });
  };

const Modal: React.FC<ModalProps> = ({ isOpen, album, closeModal }) => {

  console.log("Album:", album);
console.log("Basic Information:", album.basic_information);

const info = album.basic_information;


const formattedDateAdded = new Date(album.date_added).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
 
  //custom fields
  const getCustomFields = (notes:any[]) => {
    const fields:Record<string, string> = {};
    notes?.forEach(note => {
        const label = CUSTOM_FIELDS[note.field_id];
        if (label) {
            fields[label] = note.value;
        }
    });
    return fields;
  };

  const customFields = getCustomFields(album.notes);

  //last.fm get playcounts
  const [playcount, setPlaycount] = useState<number | null>(null);

  useEffect(() => {
    if (!album || !album.basic_information) return;
  
    const fetchAlbumPlaycount = async () => {
      try {
        const discogsTitle = album.basic_information.title;
        const override = lastFmOverrides[discogsTitle];
  
        const artist = override?.artist || album.basic_information.artists?.[0]?.name || "";
        const title = override?.title || discogsTitle;
  
        if (!artist || !title) return; // avoid bad requests
  
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(title)}&username=${LASTFM_USERNAME}&format=json`
        );
        const data = await response.json();
        const count = data.album?.userplaycount || 0;
        setPlaycount(count);
      } catch (err) {
        console.error("Failed to fetch playcount", err);
        setPlaycount(null);
      }
    };
  
    fetchAlbumPlaycount();
  }, [album]);

if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    <button className="modal-close" onClick={closeModal}>X</button>
    <img
      src={album.basic_information.cover_image}
      alt={album.basic_information.title}
      className="modal-image"
    />
    <div className="modal-details">
      <h1>{album.basic_information.title}</h1>
      <h2>{album.basic_information.artists[0]?.name}</h2>
      <h4>{info.year}</h4>
      <p><strong>Label:</strong> {info.labels[0]?.name}</p>
      {/* <p><strong>Release Date:</strong> {info.release_date}</p> want to figure out how to get exact release date */}
      <p><strong>Date Added:</strong> {formattedDateAdded}</p>
      <p><strong>Location Purchased:</strong> {customFields['Purchase location']}</p>
      <p><strong>Purchase Date:</strong> {customFields['Date purchased']}</p>
      <p><strong>Price Paid:</strong> ${customFields['Purchase price']}</p>
      <p><strong>Last Marketplace Price:</strong> ${info.last_price}</p>
      {playcount !== null && (
  <p><strong>Playcount (Last.fm):</strong> {playcount}</p>
)}
    </div>
  </div>
</div>

  );
};

export default Modal;
