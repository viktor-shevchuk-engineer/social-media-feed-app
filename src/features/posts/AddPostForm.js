import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addNewPost } from './postsSlice';

const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');
  const [addRequestStatus, setAddRequestStatus] = useState('idle');

  const dispatch = useDispatch();

  const usersList = useSelector((state) => state.users);

  const onTitleChanged = ({ target }) => setTitle(target.value);
  const onContentChanged = ({ target }) => setContent(target.value);
  const onAuthorChanged = ({ target }) => setUserId(target.value);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setUserId('');
  };

  const canSave =
    [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

  const onSavePostSubmitted = async (event) => {
    event.preventDefault();

    if (!canSave) {
      return;
    }

    try {
      setAddRequestStatus('pending');
      await dispatch(addNewPost({ title, content, user: userId })).unwrap();
    } catch (error) {
      console.error('Failed to save the post: ', error);
    } finally {
      resetForm();
      setAddRequestStatus('idle');
    }
  };

  const userListOptions = usersList.map(({ id, name }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={onSavePostSubmitted}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {userListOptions}
        </select>
        <label htmlFor="postContent">Post:</label>
        <textarea
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="submit" disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
