export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  date: string; 
}

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}