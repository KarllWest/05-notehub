import axios from 'axios';
import type { Note } from '../types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export type CreateNotePayload = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;

const API_URL = 'https://notehub-public.goit.study/api/notes';
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const noteApi = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search) {
    params.search = search;
  }

  const { data } = await noteApi.get<FetchNotesResponse>('', { params });
  return data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const { data } = await noteApi.post<Note>('', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteApi.delete<Note>(`/${id}`);
  return data;
};