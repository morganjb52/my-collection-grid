import React from "react";
import "./Modal.css"; // you can style it in a separate CSS file, or use inline styles

interface ModalProps {
  isOpen: boolean;
  album: any;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, album, closeModal }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

const info = album.basic_information;

const formattedDateAdded = new Date(album.date_added).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  

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
      <p><strong>Location Purchased:</strong> {album.location}</p>
      <p><strong>Purchase Date:</strong> {album.purchase_date}</p>
      <p><strong>Price Paid:</strong> ${album.price_paid}</p>
      <p><strong>Last Marketplace Price:</strong> ${info.last_price}</p>
    </div>
  </div>
</div>

  );
};

export default Modal;
