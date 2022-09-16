// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const NoteListItem = ({
  note
}) => {
  return (
    <li>
      <Link to={`/notes/${note._id}`}> {note.name}</Link>
    </li>
  )
}

NoteListItem.propTypes = {
  note: PropTypes.object.isRequired
}

export default NoteListItem;
