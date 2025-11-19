import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CreateNoteDto } from '../../types/note';
import css from './NoteForm.module.css';

const ValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  content: Yup.string()
    .max(500, 'Too Long!')
    .required('Required'), 
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});

interface NoteFormProps {
  onSubmit: (values: CreateNoteDto) => void;
  onCancel: () => void;
}

const NoteForm = ({ onSubmit, onCancel }: NoteFormProps) => {
  const initialValues: CreateNoteDto = {
    title: '',
    content: '',
    tag: 'Todo', // Значення за замовчуванням
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ValidationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <h2>Create new note</h2>
          
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={css.input} placeholder="Enter title..." />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={5}
              className={css.textarea}
              placeholder="Enter note content..."
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NoteForm;