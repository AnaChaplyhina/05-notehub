import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import css from './App.module.css';

const App = () => {

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', 1], 
    queryFn: () => fetchNotes({ page: 1, perPage: 9 }),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <h2>My Notes</h2>
      </header>

      {isLoading && <p style={{ textAlign: 'center' }}>Loading notes...</p>}
      
      {isError && <p style={{ textAlign: 'center', color: 'red' }}>Error loading notes!</p>}

      {data && <NoteList notes={data.notes} />}
    </div>
  );
};

export default App;