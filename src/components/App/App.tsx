import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import 'modern-normalize/modern-normalize.css';
import css from './App.module.css';

import { fetchNotes, createNote, deleteNote, type CreateNotePayload } from './services/noteService';
import NoteList from './components/NoteList/NoteList';
import Pagination from './components/Pagination/Pagination';
import SearchBox from './components/SearchBox/SearchBox';
import Modal from './components/Modal/Modal';
import NoteForm from './components/NoteForm/NoteForm';

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, search],
    queryFn: () => fetchNotes({ page, perPage, search }),
    placeholderData: (previousData) => previousData,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      console.log("✅ Успіх! Нотатка створена на сервері.");
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setIsModalOpen(false);
      setPage(1);
      setSearch('');
      setInputValue('');
    },
    onError: (error: any) => {
      console.error("❌ Помилка запиту:", error);
      alert(`Помилка створення: ${error.response?.data?.message || error.message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleCreateNote = (values: CreateNotePayload) => {
    createMutation.mutate(values);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Безпечний доступ до масиву нотаток
 const notes = data?.notes;
  const totalPages = data?.totalPages ?? 0;
  console.log("🔍 Дані від сервера:", data);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes!</p>}

      {/* ВИПРАВЛЕННЯ: Використовуємо знаки питання ?. перед .length */}
      {/* (notes?.length ?? 0) > 0 означає: якщо довжина є, бери її, якщо ні - бери 0 */}
      {Array.isArray(notes) && notes.length > 0 && (
        <NoteList notes={notes} onDelete={handleDeleteNote} />
      )}

      {/* ВИПРАВЛЕННЯ: Безпечна перевірка пагінації */}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          forcePage={page - 1}
          onPageChange={handlePageChange}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm
          onSubmit={handleCreateNote}
          onCancel={() => setIsModalOpen(false)}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}

export default App;