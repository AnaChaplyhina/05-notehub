import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce'; 
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import css from './App.module.css';

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearchChange = (newValue: string) => {
    setSearch(newValue);
    setPage(1); 
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debouncedSearch], 
    queryFn: () => fetchNotes({ 
      page, 
      perPage: 9, 
      search: debouncedSearch 
    }),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>

        <SearchBox value={search} onChange={handleSearchChange} />
        
        <button className={css.createBtn} disabled>Create note +</button>
      </header>

      {isLoading && <p style={{ textAlign: 'center' }}>Loading notes...</p>}
      
      {isError && <p style={{ textAlign: 'center', color: 'red' }}>Error loading notes!</p>}

      {data && (
        <>
          <NoteList notes={data.notes} />
          
          <Pagination 
            totalPages={data.totalPages} 
            currentPage={page} 
            onPageChange={setPage} 
          />
        </>
      )}
    </div>
  );
};

export default App;