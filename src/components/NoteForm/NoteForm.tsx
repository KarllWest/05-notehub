import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import type { CreateNotePayload } from '../../services/noteService';
import type { NoteTag } from '../../types/note';

interface NoteFormProps {
  onSubmit: (values: CreateNotePayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      tag: 'Todo' as NoteTag,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(3, 'Minimum 3 characters') // Перевірте, чи ви вводите більше 3 літер!
        .max(50, 'Maximum 50 characters')
        .required('Required'),
      content: Yup.string().max(500, 'Maximum 500 characters'),
      tag: Yup.string()
        .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
        .required('Required'),
    }),
    onSubmit: (values) => {
      console.log('✅ Форма валідна, відправляємо дані:', values);
      onSubmit(values);
    },
  });

  // Допомагає побачити помилки в консолі браузера
  if (Object.keys(formik.errors).length > 0 && formik.touched.title) {
    console.log('❌ Помилки валідації:', formik.errors);
  }

  return (
    <form className={css.form} onSubmit={formik.handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          placeholder="Enter at least 3 characters..."
        />
        {formik.touched.title && formik.errors.title ? (
          <span className={css.error}>{formik.errors.title}</span>
        ) : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.content}
        />
        {formik.touched.content && formik.errors.content ? (
          <span className={css.error}>{formik.errors.content}</span>
        ) : null}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tag}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {formik.touched.tag && formik.errors.tag ? (
          <span className={css.error}>{formik.errors.tag}</span>
        ) : null}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
        {/* Кнопка тепер завжди активна, щоб показати помилки при кліку */}
        <button
          type="submit"
          className={css.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;