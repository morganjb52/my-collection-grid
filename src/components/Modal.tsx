import React, { useState, useEffect } from 'react';
import './Modal.css';
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
};

const LASTFM_API_KEY = 'c788bd1a493cddc12617bfaca2fe286e';
const LASTFM_USERNAME = 'morganjb';

const Modal: React.FC<ModalProps> = ({ isOpen, album, closeModal }) => {
  const [playcount, setPlaycount] = useState<number | null>(null);

  useEffect(() => {
    if (!album || !album.basic_information) return;
  
    const fetchAlbumPlaycount = async () => {
      try {
        const albumId = album.id?.toString(); // 👈 Properly scoped inside the function
        const override = lastFmOverrides[albumId];
  
        const artist = override?.artist || album.basic_information.artists?.[0]?.name || "";
        const title = override?.title || album.basic_information.title;
  
        if (!artist || !title) return; // Avoid making a bad request
  
        const response = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${LASTFM_API_KEY}&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(title)}&username=${LASTFM_USERNAME}&format=json`
        );
        const data = await response.json();
        if (!data.album) {
            console.warn(`No album data returned for Discogs title "${album.basic_information.title}" (Discogs ID: ${albumId}) using artist "${artist}" and album "${title}"`);
            return;
          }
    
          const lastfmTitle = data.album?.name;
          if (lastfmTitle && lastfmTitle !== title) {
            console.info(`Title mismatch (Discogs ID: ${albumId}): Discogs "${title}" vs Last.fm "${lastfmTitle}"`);
          }
        
        const count = data.album?.userplaycount || 0;
        setPlaycount(count);
      } catch (err) {
        console.error("Failed to fetch playcount", err);
        setPlaycount(null);
      }
    };
  
    fetchAlbumPlaycount();
  }, [album]);

  if (!isOpen || !album || !album.basic_information) return null;

  const info = album.basic_information;

  const formattedDateAdded = new Date(album.date_added).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getCustomFields = (notes: any[]) => {
    const fields: Record<string, string> = {};
    notes?.forEach(note => {
      const label = CUSTOM_FIELDS[note.field_id];
      if (label) {
        fields[label] = note.value;
      }
    });
    return fields;
  };

  const customFields = getCustomFields(album.notes);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={closeModal}>
          X
        </button>
        <img
          src={info.cover_image}
          alt={info.title}
          className="modal-image"
        />
        <div className="modal-details">
          <h1>{info.title}</h1>
          <h2>{info.artists[0]?.name}</h2>
          <h4>{info.year}</h4>
          <p><strong>Label:</strong> {info.labels[0]?.name}</p>
          <p><strong>Date Added:</strong> {formattedDateAdded}</p>
          <p><strong>Location Purchased:</strong> {customFields['Purchase location']}</p>
          <p><strong>Purchase Date:</strong> {customFields['Date purchased']}</p>
          <p><strong>Price Paid:</strong> ${customFields['Purchase price']}</p>
          <p><strong>Last Marketplace Price:</strong> ${info.lowest_price}</p>
          {playcount !== null && (
            <p><strong>Playcount (Last.fm):</strong> {playcount}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
