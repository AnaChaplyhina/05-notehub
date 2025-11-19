import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import { CreateNoteDto } from '../../types/note';

import NoteList from '../NoteList/NoteList';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';

const App = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 9, search: debouncedSearch }),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false); 
    },
  });


  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
     
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });


  const handleSearchChange = (newValue: string) => {
    setSearch(newValue);
    setPage(1);
  };

  const handleCreateNote = (noteData: CreateNoteDto) => {
    createMutation.mutate(noteData);
  };

  const handleDeleteNote = (id: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        
        <button 
          className={css.createBtn} 
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      {(isLoading || createMutation.isPending || deleteMutation.isPending) && (
        <div style={{textAlign: 'center', margin: 10}}>Loading...</div>
      )}
      
      {isError && <p className={css.error}>Error loading notes!</p>}

      {data && (
        <>
          <NoteList notes={data.notes} onDelete={handleDeleteNote} />
          <Pagination 
            totalPages={data.totalPages} 
            currentPage={page} 
            onPageChange={setPage} 
          />
        </>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm 
          onSubmit={handleCreateNote} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default App;