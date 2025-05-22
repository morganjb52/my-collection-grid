import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import './AlbumGrid.css';
import Modal from './Modal';

interface Album {
  id: number;
  basic_information: {
    title: string;
    cover_image: string;
    artists: { name: string }[];
    year: string;
    label: string;
    released: string;
  };
  date_added: string;
  location?: string;
  purchase_date?: string;
  price_paid?: number;
  last_price?: number;
}

const fetchAlbums = async (page: number, perPage: number): Promise<{ releases: Album[]; pagination: { pages: number } }> => {
  const res = await axios.get('https://api.discogs.com/users/morganjb/collection/folders/0/releases', {
    params: {
      per_page: perPage,
      page,
      sort: 'added',
      sort_order: 'desc',
    },
    headers: {
      Authorization: 'Discogs token=RdrvXEBTzPsnMmycwuPtxQsGzeWkPzjsWFULdMvl',
      'User-Agent': 'MyDiscogsApp/1.0',
    },
  });
  return res.data;
};

const AlbumGrid: React.FC = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['albums', page, perPage],
    queryFn: () => fetchAlbums(page, perPage),
  });

  const openModal = (album: Album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlbum(null);
  };

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(e.target.value));
    setPage(1); // Reset to first page on perPage change
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="perPage">Albums per page: </label>
        <select id="perPage" value={perPage} onChange={handlePerPageChange}>
          {[10, 20, 50].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="grid">
        {data?.releases.map((album) => (
          <div key={album.id} className="album-card" onClick={() => openModal(album)}>
            <img src={album.basic_information.cover_image} alt={album.basic_information.title} />
            <h4>{album.basic_information.title}</h4>
            <p>{album.basic_information.artists[0]?.name}</p>
          </div>
        ))}
      </div>

      {data && data.pagination && data.pagination.pages > 1 && (
        <ReactPaginate
          previousLabel={'← Previous'}
          nextLabel={'Next →'}
          pageCount={data.pagination.pages}
          onPageChange={handlePageClick}
          forcePage={page - 1}
          containerClassName={'pagination'}
          activeClassName={'active'}
          disabledClassName={'disabled'}
        />
      )}

      {selectedAlbum && (
        <Modal isOpen={isModalOpen} album={selectedAlbum} closeModal={closeModal} />
      )}

      {isFetching && <div>Updating...</div>}
    </>
  );
};

export default AlbumGrid;
